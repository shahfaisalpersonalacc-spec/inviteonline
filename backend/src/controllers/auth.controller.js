const { z } = require('zod');
const User = require('../models/User');
const HttpError = require('../utils/HttpError');
const { signAuthToken, sha256, randomToken } = require('../utils/tokens');
const { sendEmail, resetPasswordEmail, welcomeEmail } = require('../utils/email');

const password = z.string().min(8, 'must be at least 8 characters').max(128);

const schemas = {
  register: z.object({ name: z.string().trim().min(2).max(80), email: z.email().trim().toLowerCase(), password }),
  login: z.object({ email: z.email().trim().toLowerCase(), password: z.string().min(1) }),
  forgot: z.object({ email: z.email().trim().toLowerCase() }),
  reset: z.object({ password }),
  profile: z.object({
    name: z.string().trim().min(2).max(80).optional(),
    currentPassword: z.string().optional(),
    newPassword: password.optional(),
  }),
};

const clientUrl = () => (process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/$/, '');

async function register(req, res) {
  const { name, email, password: pw } = req.body;
  if (await User.exists({ email })) throw new HttpError(409, 'An account with this email already exists');
  const user = await User.create({ name, email, password: pw });

  sendEmail({ to: email, toName: name, subject: 'Welcome to InviteOnline 🎉', html: welcomeEmail(name, `${clientUrl()}/dashboard`) })
    .catch((e) => console.error('[email] welcome failed:', e.message));

  res.status(201).json({ token: signAuthToken(user._id), user: user.toPublic() });
}

async function login(req, res) {
  const { email, password: pw } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(pw))) throw new HttpError(401, 'Invalid email or password');
  res.json({ token: signAuthToken(user._id), user: user.toPublic() });
}

function me(req, res) {
  res.json({ user: req.user.toPublic() });
}

const FORGOT_MSG = 'If an account exists for that email, a password reset link has been sent.';

async function forgotPassword(req, res) {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const token = randomToken();
    user.resetPasswordToken = sha256(token);
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();
    try {
      await sendEmail({
        to: user.email,
        toName: user.name,
        subject: 'Reset your InviteOnline password',
        html: resetPasswordEmail(user.name, `${clientUrl()}/reset-password/${token}`),
      });
    } catch (e) {
      console.error('[email] reset failed:', e.message);
      throw new HttpError(502, 'Could not send the reset email right now. Please try again later.');
    }
  }
  res.json({ message: FORGOT_MSG });
}

async function resetPassword(req, res) {
  const user = await User.findOne({
    resetPasswordToken: sha256(req.params.token || ''),
    resetPasswordExpires: { $gt: new Date() },
  });
  if (!user) throw new HttpError(400, 'This reset link is invalid or has expired');

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.json({ message: 'Password updated. You can now log in.', token: signAuthToken(user._id), user: user.toPublic() });
}

async function updateProfile(req, res) {
  const { name, currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (name) user.name = name;
  if (newPassword) {
    if (!currentPassword || !(await user.comparePassword(currentPassword))) {
      throw new HttpError(400, 'Current password is incorrect');
    }
    user.password = newPassword;
  }
  await user.save();
  res.json({ user: user.toPublic() });
}

module.exports = { schemas, register, login, me, forgotPassword, resetPassword, updateProfile };
