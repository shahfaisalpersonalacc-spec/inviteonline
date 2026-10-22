const mongoose = require('mongoose');

const wishSchema = new mongoose.Schema(
  {
    invitation: { type: mongoose.Schema.Types.ObjectId, ref: 'Invitation', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    message: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Wish', wishSchema);
