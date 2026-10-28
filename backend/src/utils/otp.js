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
  const invalid = new HttpError(400, 'That code is incorrect or has expired. Check your latest email, or ask for a new code.');
  if (!user || !user.otpHash || user.otpPurpose !== purpose || user.otpExpires < new Date()) throw invalid;

  // Count the attempt atomically in the database, so guesses sent in parallel can't all read the
  // same count and slip past the limit. (Only the counter is written, nothing else on the user.)
  const Model = user.constructor;
  const counted = await Model.findOneAndUpdate({ _id: user._id, otpHash: user.otpHash }, { $inc: { otpAttempts: 1 } }, { new: true }).select(OTP_FIELDS);
  const spent = !counted || counted.otpAttempts > MAX_ATTEMPTS;
  if (spent || sha256(code) !== user.otpHash) {
    if (counted && counted.otpAttempts >= MAX_ATTEMPTS) {
      await Model.updateOne({ _id: user._id }, { $unset: { otpHash: 1, otpPurpose: 1, otpExpires: 1, otpAttempts: 1, otpSentAt: 1 } });
    }
    throw invalid;
  }
  clearOtp(user); // the caller saves
}

module.exports = { OTP_FIELDS, MAX_ATTEMPTS, canResend, issueOtp, consumeOtp };
