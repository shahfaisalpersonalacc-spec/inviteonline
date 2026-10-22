const { z } = require('zod');
const bcrypt = require('bcryptjs');
const Invitation = require('../models/Invitation');
const Rsvp = require('../models/Rsvp');
const Wish = require('../models/Wish');
const HttpError = require('../utils/HttpError');
const { signUnlockToken, verifyToken } = require('../utils/tokens');

const schemas = {
  unlock: z.object({ password: z.string().min(1).max(64) }),
  rsvp: z.object({
    name: z.string().trim().min(1).max(80),
    phone: z.string().trim().max(30).optional().default(''),
    email: z.union([z.email().trim().toLowerCase(), z.literal('')]).optional().default(''),
    status: z.enum(['yes', 'no', 'maybe']),
    guests: z.coerce.number().int().min(0).max(50).default(1),
    message: z.string().trim().max(500).optional().default(''),
  }),
  wish: z.object({ name: z.string().trim().min(1).max(80), message: z.string().trim().min(1).max(500) }),
};

async function findPublished(slug) {
  const inv = await Invitation.findOne({ slug: String(slug).toLowerCase(), published: true }).select('+passwordHash');
  if (!inv) throw new HttpError(404, 'This invitation does not exist or is not published');
  return inv;
}

function isUnlocked(req, inv) {
  if (!inv.passwordHash) return true;
  const payload = verifyToken(req.headers['x-unlock-token'] || '', 'unlock');
  return Boolean(payload && payload.inv === String(inv._id));
}

async function requireUnlocked(req) {
  const inv = await findPublished(req.params.slug);
  if (!isUnlocked(req, inv)) throw new HttpError(403, 'This invitation is password protected');
  return inv;
}

// Only fields guests need — never owner, passwordHash, etc.
function publicView(inv) {
  const o = inv.toObject();
  return {
    id: o._id,
    title: o.title,
    slug: o.slug,
    eventType: o.eventType,
    description: o.description,
    coverImage: o.coverImage,
    theme: o.theme,
    sections: o.sections.filter((s) => s.enabled),
    stickers: o.stickers,
    music: o.music,
    hasPassword: Boolean(o.passwordHash),
  };
}

async function getBySlug(req, res) {
  const inv = await findPublished(req.params.slug);
  if (!isUnlocked(req, inv)) {
    // Enough for the password screen and link previews, nothing more.
    const o = inv.toObject();
    return res.json({
      locked: true,
      invitation: { title: o.title, slug: o.slug, description: o.description, coverImage: o.coverImage, theme: o.theme, hasPassword: true },
    });
  }
  res.json({ locked: false, invitation: publicView(inv) });
}

async function unlock(req, res) {
  const inv = await findPublished(req.params.slug);
  if (!inv.passwordHash) return res.json({ unlockToken: null });
  if (!(await bcrypt.compare(req.body.password, inv.passwordHash))) throw new HttpError(401, 'Wrong password');
  res.json({ unlockToken: signUnlockToken(inv._id) });
}

async function trackView(req, res) {
  await Invitation.updateOne({ slug: String(req.params.slug).toLowerCase(), published: true }, { $inc: { views: 1 } });
  res.status(204).end();
}

async function submitRsvp(req, res) {
  const inv = await requireUnlocked(req);
  const rsvpSection = inv.sections.find((s) => s.type === 'rsvp' && s.enabled);
  if (!rsvpSection) throw new HttpError(400, 'RSVP is not enabled for this invitation');

  const deadline = rsvpSection.data?.deadline && new Date(rsvpSection.data.deadline);
  if (deadline && !Number.isNaN(deadline.getTime()) && deadline.getTime() + 24 * 3600 * 1000 < Date.now()) {
    throw new HttpError(400, 'The RSVP deadline has passed');
  }
  const maxGuests = Number(rsvpSection.data?.maxGuests) || 10;
  const body = { ...req.body, guests: req.body.status === 'no' ? 0 : Math.min(Math.max(req.body.guests, 1), maxGuests) };

  const rsvp = await Rsvp.create({ invitation: inv._id, ...body });
  res.status(201).json({ message: 'Thank you! Your response has been recorded.', rsvp: { id: rsvp._id, status: rsvp.status } });
}

async function listWishes(req, res) {
  const inv = await requireUnlocked(req);
  const wishes = await Wish.find({ invitation: inv._id }).sort({ createdAt: -1 }).limit(100).select('name message createdAt').lean();
  res.json({ wishes });
}

async function addWish(req, res) {
  const inv = await requireUnlocked(req);
  if (!inv.sections.some((s) => s.type === 'wishes' && s.enabled)) throw new HttpError(400, 'Wishes are not enabled');
  const wish = await Wish.create({ invitation: inv._id, ...req.body });
  res.status(201).json({ wish: { _id: wish._id, name: wish.name, message: wish.message, createdAt: wish.createdAt } });
}

module.exports = { schemas, getBySlug, unlock, trackView, submitRsvp, listWishes, addWish };
