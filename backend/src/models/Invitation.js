const mongoose = require('mongoose');

const SECTION_TYPES = [
  'hero', 'hosts', 'story', 'event', 'countdown', 'schedule', 'venue',
  'gallery', 'video', 'dresscode', 'contact', 'rsvp', 'wishes', 'note',
  'quote', 'families', 'timeline', 'gifts', 'faq', 'closing', 'scratch',
];

const EVENT_TYPES = [
  'wedding', 'nikah', 'walima', 'mehndi', 'engagement', 'birthday',
  'baby-shower', 'anniversary', 'party', 'corporate', 'graduation', 'other',
];

const sectionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, enum: SECTION_TYPES, required: true },
    enabled: { type: Boolean, default: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: false, minimize: false }
);

const stickerSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    stickerId: { type: String, required: true },
    sectionId: { type: String, default: '' }, // section the sticker is anchored to; x/y are relative to it
    x: { type: Number, default: 50 }, // percent of invitation width
    y: { type: Number, default: 10 }, // percent of section height
    size: { type: Number, default: 18 }, // percent of invitation width
    rotation: { type: Number, default: 0 },
    opacity: { type: Number, default: 1 },
    flip: { type: Boolean, default: false },
    zIndex: { type: Number, default: 1 },
  },
  { _id: false }
);

const invitationSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    eventType: { type: String, enum: EVENT_TYPES, default: 'wedding' },
    description: { type: String, default: '', maxlength: 300 }, // used for link previews
    coverImage: { type: String, default: '' },
    theme: {
      preset: { type: String, default: 'blush' },
      mode: { type: String, enum: ['light', 'dark'], default: 'light' }, // guest-facing colour scheme
      primary: { type: String, default: '#be185d' },
      secondary: { type: String, default: '#f9a8d4' },
      background: { type: String, default: '#fff7fb' },
      surface: { type: String, default: '#ffffff' },
      text: { type: String, default: '#3f3f46' },
      fontHeading: { type: String, default: 'Great Vibes' },
      fontBody: { type: String, default: 'Poppins' },
      bgType: { type: String, enum: ['color', 'gradient', 'pattern', 'image'], default: 'color' },
      bgValue: { type: String, default: '' },
      envelope: { type: Boolean, default: true }, // show the entry screen
      entryStyle: { type: String, default: 'linen-monogram' }, // envelope or door design
      sealColor: { type: String, default: '#7a2430' },
      sealIcon: { type: String, enum: ['monogram', 'dove', 'heart', 'butterfly', 'rose', 'crest'], default: 'monogram' },
      monogram: { type: String, default: '', maxlength: 6 },
      animation: { type: String, enum: ['none', 'petals', 'confetti', 'hearts', 'stars', 'snow'], default: 'petals' },
    },
    sections: { type: [sectionSchema], default: [] },
    stickers: { type: [stickerSchema], default: [] },
    music: {
      url: { type: String, default: '' },
      title: { type: String, default: '' },
      enabled: { type: Boolean, default: false },
    },
    published: { type: Boolean, default: true },
    passwordHash: { type: String, default: null, select: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true, minimize: false }
);

module.exports = mongoose.model('Invitation', invitationSchema);
module.exports.SECTION_TYPES = SECTION_TYPES;
module.exports.EVENT_TYPES = EVENT_TYPES;
