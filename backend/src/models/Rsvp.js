const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema(
  {
    invitation: { type: mongoose.Schema.Types.ObjectId, ref: 'Invitation', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    phone: { type: String, trim: true, maxlength: 30, default: '' },
    email: { type: String, trim: true, lowercase: true, maxlength: 120, default: '' },
    status: { type: String, enum: ['yes', 'no', 'maybe'], required: true },
    guests: { type: Number, min: 0, max: 50, default: 1 },
    message: { type: String, trim: true, maxlength: 500, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Rsvp', rsvpSchema);
