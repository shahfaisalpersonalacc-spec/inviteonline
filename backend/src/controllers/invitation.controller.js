const { z } = require('zod');
const bcrypt = require('bcryptjs');
const Invitation = require('../models/Invitation');
const Rsvp = require('../models/Rsvp');
const Wish = require('../models/Wish');
const HttpError = require('../utils/HttpError');
const { isValidSlug, uniqueSlug, slugify } = require('../utils/slug');
const { buildDefaultSections, themeFor, newId } = require('../utils/defaults');

const { SECTION_TYPES, EVENT_TYPES } = Invitation;
const color = z.string().regex(/^#[0-9a-fA-F]{3,8}$/, 'must be a hex colour');

const themeSchema = z
  .object({
    preset: z.string().max(40),
    primary: color,
    secondary: color,
    background: color,
    surface: color,
    text: color,
    fontHeading: z.string().max(60),
    fontBody: z.string().max(60),
    bgType: z.enum(['color', 'gradient', 'pattern', 'image']),
    bgValue: z.string().max(1000),
    envelope: z.boolean(),
    animation: z.enum(['none', 'petals', 'confetti', 'hearts', 'stars', 'snow']),
  })
  .partial();

const sectionSchema = z.object({
  id: z.string().min(1).max(40),
  type: z.enum(SECTION_TYPES),
  enabled: z.boolean().default(true),
  data: z.record(z.string(), z.any()).default({}),
});

const stickerSchema = z.object({
  id: z.string().min(1).max(40),
  stickerId: z.string().min(1).max(60),
  sectionId: z.string().max(40).default(''),
  x: z.number().min(-20).max(120),
  y: z.number().min(-5).max(105),
  size: z.number().min(2).max(100),
  rotation: z.number().min(-360).max(360).default(0),
  opacity: z.number().min(0.1).max(1).default(1),
  flip: z.boolean().default(false),
  zIndex: z.number().int().min(0).max(999).default(1),
});

const schemas = {
  create: z.object({
    title: z.string().trim().min(1).max(120),
    eventType: z.enum(EVENT_TYPES).default('wedding'),
    themePreset: z.string().max(40).optional(),
  }),
  update: z.object({
    title: z.string().trim().min(1).max(120).optional(),
    slug: z.string().trim().toLowerCase().optional(),
    eventType: z.enum(EVENT_TYPES).optional(),
    description: z.string().max(300).optional(),
    coverImage: z.string().max(1000).optional(),
    theme: themeSchema.optional(),
    sections: z.array(sectionSchema).max(40).optional(),
    stickers: z.array(stickerSchema).max(200).optional(),
    music: z.object({ url: z.string().max(1000), title: z.string().max(120), enabled: z.boolean() }).partial().optional(),
    published: z.boolean().optional(),
    // string = set new password, null = remove password, undefined = unchanged
    password: z.string().min(4).max(64).nullable().optional(),
  }),
};

// Loads an invitation owned by the current user, or 404 (never reveals other users' pages).
async function loadOwned(req, select) {
  const q = Invitation.findOne({ _id: req.params.id, owner: req.user._id });
  if (select) q.select(select);
  const inv = await q;
  if (!inv) throw new HttpError(404, 'Invitation not found');
  return inv;
}

function serialize(inv, extra = {}) {
  const o = inv.toObject();
  const hasPassword = Boolean(o.passwordHash);
  delete o.passwordHash;
  return { ...o, hasPassword, ...extra };
}

async function list(req, res) {
  const invitations = await Invitation.find({ owner: req.user._id })
    .select('title slug eventType coverImage published views theme.primary theme.preset createdAt updatedAt')
    .sort({ updatedAt: -1 })
    .lean();
  const ids = invitations.map((i) => i._id);
  const [rsvpCounts, wishCounts] = await Promise.all([
    Rsvp.aggregate([{ $match: { invitation: { $in: ids } } }, { $group: { _id: '$invitation', n: { $sum: 1 } } }]),
    Wish.aggregate([{ $match: { invitation: { $in: ids } } }, { $group: { _id: '$invitation', n: { $sum: 1 } } }]),
  ]);
  const toMap = (rows) => Object.fromEntries(rows.map((r) => [String(r._id), r.n]));
  const r = toMap(rsvpCounts);
  const w = toMap(wishCounts);
  res.json({
    invitations: invitations.map((i) => ({ ...i, rsvpCount: r[String(i._id)] || 0, wishCount: w[String(i._id)] || 0 })),
  });
}

async function create(req, res) {
  const { title, eventType, themePreset } = req.body;
  const { sections, themePreset: defaultPreset } = buildDefaultSections(eventType);
  const inv = await Invitation.create({
    owner: req.user._id,
    title,
    eventType,
    slug: await uniqueSlug(Invitation, title),
    theme: themeFor(themePreset || defaultPreset),
    sections,
  });
  res.status(201).json({ invitation: serialize(inv) });
}

async function get(req, res) {
  const inv = await loadOwned(req, '+passwordHash');
  res.json({ invitation: serialize(inv) });
}

async function update(req, res) {
  const inv = await loadOwned(req, '+passwordHash');
  const { password, slug, theme, music, ...rest } = req.body;

  if (slug !== undefined && slug !== inv.slug) {
    if (!isValidSlug(slug)) {
      throw new HttpError(400, 'Link must be 3–60 characters: lowercase letters, numbers and hyphens only');
    }
    if (await Invitation.exists({ slug, _id: { $ne: inv._id } })) throw new HttpError(409, 'This link is already taken');
    inv.slug = slug;
  }
  const current = inv.toObject();
  if (theme) inv.set('theme', { ...current.theme, ...theme });
  if (music) inv.set('music', { ...current.music, ...music });
  if (password === null) inv.passwordHash = null;
  else if (typeof password === 'string') inv.passwordHash = await bcrypt.hash(password, 10);

  Object.assign(inv, rest);
  await inv.save();
  res.json({ invitation: serialize(inv) });
}

async function remove(req, res) {
  const inv = await loadOwned(req);
  await Promise.all([Rsvp.deleteMany({ invitation: inv._id }), Wish.deleteMany({ invitation: inv._id }), inv.deleteOne()]);
  res.json({ message: 'Invitation deleted' });
}

async function duplicate(req, res) {
  const src = await loadOwned(req);
  const o = src.toObject();
  const title = `${o.title} (copy)`.slice(0, 120);
  const copy = await Invitation.create({
    owner: req.user._id,
    title,
    slug: await uniqueSlug(Invitation, title),
    eventType: o.eventType,
    description: o.description,
    coverImage: o.coverImage,
    theme: o.theme,
    sections: o.sections.map((s) => ({ ...s, id: newId() })),
    stickers: o.stickers.map((s) => ({ ...s, id: newId() })),
    music: o.music,
    published: false,
  });
  res.status(201).json({ invitation: serialize(copy) });
}

async function slugAvailable(req, res) {
  const slug = slugify(req.params.slug);
  const valid = isValidSlug(slug) && slug === req.params.slug.toLowerCase();
  const taken = valid
    ? await Invitation.exists({ slug, ...(req.query.exclude ? { _id: { $ne: req.query.exclude } } : {}) })
    : true;
  res.json({ slug, valid, available: valid && !taken });
}

async function listRsvps(req, res) {
  const inv = await loadOwned(req, '_id title');
  const rsvps = await Rsvp.find({ invitation: inv._id }).sort({ createdAt: -1 }).lean();

  if (req.query.format === 'csv') {
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = [
      ['Name', 'Status', 'Guests', 'Phone', 'Email', 'Message', 'Date'],
      ...rsvps.map((r) => [r.name, r.status, r.guests, r.phone, r.email, r.message, new Date(r.createdAt).toISOString()]),
    ];
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="rsvps-${slugify(inv.title) || 'invite'}.csv"`);
    return res.send('﻿' + rows.map((r) => r.map(esc).join(',')).join('\n'));
  }

  const summary = { yes: 0, no: 0, maybe: 0, totalGuests: 0 };
  for (const r of rsvps) {
    summary[r.status] += 1;
    if (r.status === 'yes') summary.totalGuests += r.guests || 0;
  }
  res.json({ rsvps, summary });
}

async function deleteRsvp(req, res) {
  const inv = await loadOwned(req, '_id');
  await Rsvp.deleteOne({ _id: req.params.rsvpId, invitation: inv._id });
  res.json({ message: 'Deleted' });
}

async function listWishes(req, res) {
  const inv = await loadOwned(req, '_id');
  const wishes = await Wish.find({ invitation: inv._id }).sort({ createdAt: -1 }).lean();
  res.json({ wishes });
}

async function deleteWish(req, res) {
  const inv = await loadOwned(req, '_id');
  await Wish.deleteOne({ _id: req.params.wishId, invitation: inv._id });
  res.json({ message: 'Deleted' });
}

module.exports = {
  schemas, list, create, get, update, remove, duplicate, slugAvailable,
  listRsvps, deleteRsvp, listWishes, deleteWish,
};
