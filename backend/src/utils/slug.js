const crypto = require('crypto');

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{1,58}[a-z0-9])$/;
const RESERVED = new Set(['admin', 'api', 'login', 'register', 'dashboard', 'new', 'edit', 'settings']);

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, '-and-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

const isValidSlug = (slug) => SLUG_RE.test(slug) && !RESERVED.has(slug);

function withSuffix(base) {
  const suffix = crypto.randomBytes(3).toString('hex');
  return `${base || 'invite'}-${suffix}`.replace(/^-/, '');
}

// Finds a free slug based on the title; Model is passed in to avoid a require cycle.
async function uniqueSlug(Model, title) {
  const base = slugify(title) || 'invite';
  if (isValidSlug(base) && !(await Model.exists({ slug: base }))) return base;
  for (let i = 0; i < 5; i++) {
    const candidate = withSuffix(base);
    if (!(await Model.exists({ slug: candidate }))) return candidate;
  }
  return withSuffix('invite') + Date.now().toString(36);
}

module.exports = { slugify, isValidSlug, uniqueSlug };
