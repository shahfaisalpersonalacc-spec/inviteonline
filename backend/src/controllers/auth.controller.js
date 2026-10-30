const { z } = require('zod');
const User = require('../models/User');
const HttpError = require('../utils/HttpError');
const { signAuthToken } = require('../utils/tokens');
const { sendEmail, otpEmail, welcomeEmail } = require('../utils/email');
const { OTP_FIELDS, canResend, issueOtp, consumeOtp } = require('../utils/otp');

const password = z.string().min(8, 'must be at least 8 characters').max(128);
const email = z.string().trim().toLowerCase().pipe(z.email());
const code = z.string().trim().regex(/^\d{6}$/, 'must be 6 digits');

const schemas = {
  register: z.object({ name: z.string().trim().min(2).max(80), email, password }),
  login: z.object({ email, password: z.string().min(1) }),
  verifyEmail: z.object({ email, code }),
  resendCode: z.object({ email, purpose: z.enum(['verify', 'reset']) }),
  forgot: z.object({ email }),
  reset: z.object({ email, code, password }),
  profile: z.object({
    name: z.string().trim().min(2).max(80).optional(),
    // a web image link, or '' to remove the photo
    avatar: z.union([z.literal(''), z.url({ protocol: /^https?$/ }).max(500)]).optional(),
    currentPassword: z.string().optional(),
    newPassword: password.optional(),
    code: code.optional(), // required with newPassword: the code from POST /password-code
  }),
  passwordCode: z.object({ currentPassword: z.string().min(1) }),
};

const clientUrl = () => (process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/$/, '');

// Issues and emails a code, unless one for the same purpose went out within the resend cooldown
// (then the earlier code stays valid and nothing is sent). Always saves the user.
async function sendCode(user, purpose) {
  const fresh = user.otpPurpose !== purpose || canResend(user);
  const otp = fresh ? issueOtp(user, purpose) : null;
  await user.save();
  if (!otp) return;
  try {
    await sendEmail({
      to: user.email,
      toName: user.name,
      subject: `${otp} is your InviteOnline ${{ reset: 'reset', change: 'password change' }[purpose] || 'verification'} code`,
      html: otpEmail(user.name, otp, purpose),
    });
  } catch (e) {
    console.error('[email] code failed:', e.message);
    // Nothing reached the inbox, so don't hold the next attempt behind the resend cooldown.
    user.otpSentAt = undefined;
    await user.save();
    throw new HttpError(502, 'Could not send the code email right now. Please try again later.');
  }
}

async function register(req, res) {
  const { name, email: addr, password: pw } = req.body;
  let user = await User.findOne({ email: addr }).select(OTP_FIELDS);
  if (user && user.emailVerified !== false) throw new HttpError(409, 'An account with this email already exists. Try logging in instead.');

  // An unverified account is only a pending signup, so registering again simply takes it over.
  if (user) Object.assign(user, { name, password: pw });
  else user = new User({ name, email: addr, password: pw, emailVerified: false });

  await sendCode(user, 'verify');
  res.status(201).json({ needsVerification: true, email: addr });
}

async function verifyEmail(req, res) {
  const user = await User.findOne({ email: req.body.email }).select(OTP_FIELDS);
  if (user && user.emailVerified !== false) throw new HttpError(400, 'This email is already verified. Please log in.');
  await consumeOtp(user, 'verify', req.body.code);

  user.emailVerified = true;
  await user.save();

  sendEmail({ to: user.email, toName: user.name, subject: 'Welcome to InviteOnline 🎉', html: welcomeEmail(user.name, `${clientUrl()}/dashboard`) })
    .catch((e) => console.error('[email] welcome failed:', e.message));

  res.json({ token: signAuthToken(user._id), user: user.toPublic() });
}

async function resendCode(req, res) {
  const { email: addr, purpose } = req.body;
  const user = await User.findOne({ email: addr }).select(OTP_FIELDS);
  if (user && (purpose === 'reset' || user.emailVerified === false)) await sendCode(user, purpose);
  res.json({ message: 'If that account needs a code, a new one has been sent.' });
}

async function login(req, res) {
  const { email: addr, password: pw } = req.body;
  const user = await User.findOne({ email: addr }).select(`+password ${OTP_FIELDS}`);
  if (!user || !(await user.comparePassword(pw))) throw new HttpError(401, 'Email or password is incorrect.');

  if (user.emailVerified === false) {
    await sendCode(user, 'verify').catch((e) => console.error('[auth] verify code on login failed:', e.message));
    return res.status(403).json({ message: 'Please verify your email first. We sent you a code.', needsVerification: true, email: addr });
  }
  res.json({ token: signAuthToken(user._id), user: user.toPublic() });
}

function me(req, res) {
  res.json({ user: req.user.toPublic() });
}

const FORGOT_MSG = 'If an account exists for that email, a reset code has been sent.';

async function forgotPassword(req, res) {
  const user = await User.findOne({ email: req.body.email }).select(OTP_FIELDS);
  if (user) await sendCode(user, 'reset');
  res.json({ message: FORGOT_MSG });
}

async function resetPassword(req, res) {
  const user = await User.findOne({ email: req.body.email }).select(OTP_FIELDS);
  await consumeOtp(user, 'reset', req.body.code);

  user.password = req.body.password;
  user.emailVerified = true; // the code proves they own the inbox
  await user.save();
  res.json({ message: 'Password updated.', token: signAuthToken(user._id), user: user.toPublic() });
}

// Step 1 of a password change from the profile: check the current password, email a code.
async function requestPasswordCode(req, res) {
  const user = await User.findById(req.user._id).select(`+password ${OTP_FIELDS}`);
  if (!(await user.comparePassword(req.body.currentPassword))) throw new HttpError(400, 'Your current password is incorrect.');
  await sendCode(user, 'change');
  res.json({ message: `We emailed a 6-digit code to ${user.email}.` });
}

async function updateProfile(req, res) {
  const { name, avatar, currentPassword, newPassword, code: otp } = req.body;
  const user = await User.findById(req.user._id).select(`+password ${OTP_FIELDS}`);
  if (newPassword) {
    if (!currentPassword || !(await user.comparePassword(currentPassword))) {
      throw new HttpError(400, 'Your current password is incorrect.');
    }
    // step 2: the emailed code confirms it's really the account owner
    if (!otp) throw new HttpError(400, 'Enter the 6-digit code we emailed you');
    await consumeOtp(user, 'change', otp);
    user.password = newPassword;
  }
  // only once every check above has passed
  if (name) user.name = name;
  if (avatar !== undefined) user.avatar = avatar || undefined;
  await user.save();
  // a password change ends older sessions, so this one gets a fresh token
  res.json({ user: user.toPublic(), ...(newPassword ? { token: signAuthToken(user._id) } : {}) });
}

module.exports = { schemas, register, verifyEmail, resendCode, login, me, forgotPassword, resetPassword, requestPasswordCode, updateProfile };
