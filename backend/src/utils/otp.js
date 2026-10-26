const crypto = require('crypto');
const HttpError = require('./HttpError');
const { sha256 } = require('./tokens');

const OTP_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

// Fields live on the User with select:false; load them with this before calling the helpers.
const OTP_FIELDS = '+otpHash +otpPurpose +otpExpires +otpAttempts +otpSentAt';

const canResend = (user) => !user.otpSentAt || Date.now() - user.otpSentAt.getTime() >= RESEND_COOLDOWN_MS;

// Puts a fresh code on the user (caller saves) and returns the plain code for the email.
function issueOtp(user, purpose) {
  const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
  user.otpHash = sha256(code);
  user.otpPurpose = purpose;
  user.otpExpires = new Date(Date.now() + OTP_TTL_MS);
  user.otpAttempts = 0;
  user.otpSentAt = new Date();
  return code;
}

function clearOtp(user) {
  user.otpHash = undefined;
  user.otpPurpose = undefined;
  user.otpExpires = undefined;
  user.otpAttempts = undefined;
  user.otpSentAt = undefined;
}

// Throws 400 unless `code` matches the user's live code for `purpose`. Saves the attempt count on failure.
async function consumeOtp(user, purpose, code) {
  const invalid = new HttpError(400, 'Invalid or expired code');
  if (!user || !user.otpHash || user.otpPurpose !== purpose || user.otpExpires < new Date()) throw invalid;

  if (sha256(code) !== user.otpHash) {
    user.otpAttempts = (user.otpAttempts || 0) + 1;
    if (user.otpAttempts >= MAX_ATTEMPTS) clearOtp(user);
    await user.save();
    throw invalid;
  }
  clearOtp(user);
}

module.exports = { OTP_FIELDS, MAX_ATTEMPTS, canResend, issueOtp, consumeOtp };
