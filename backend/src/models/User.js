const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    // login tokens issued before this are no longer accepted (set whenever the password changes)
    passwordChangedAt: { type: Date },
    // No default on purpose: accounts created before email verification existed have no
    // value and must keep working. Only an explicit `false` means "not verified yet".
    emailVerified: { type: Boolean },
    otpHash: { type: String, select: false },
    otpPurpose: { type: String, enum: ['verify', 'reset', 'change'], select: false },
    otpExpires: { type: Date, select: false },
    otpAttempts: { type: Number, select: false },
    otpSentAt: { type: Date, select: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  // 1s back, so the token issued right after this change (iat is in whole seconds) still counts as newer
  if (!this.isNew) this.passwordChangedAt = new Date(Date.now() - 1000);
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.methods.toPublic = function () {
  return { id: this._id, name: this.name, email: this.email, createdAt: this.createdAt };
};

module.exports = mongoose.model('User', userSchema);
