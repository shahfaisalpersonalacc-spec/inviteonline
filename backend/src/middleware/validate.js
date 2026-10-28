// Validates req.body against a zod schema and replaces it with the parsed (stripped) value.
// The first problem is reported as one plain sentence ("Email is required"), not zod's raw text.

// Field names as people see them on the forms. Anything else is humanised (fontHeading -> "Font heading").
const LABELS = {
  name: 'Name',
  email: 'Email',
  password: 'Password',
  currentPassword: 'Current password',
  newPassword: 'New password',
  code: 'Code',
  purpose: 'Code type',
  title: 'Invitation name',
  slug: 'Link',
  eventType: 'Event type',
  description: 'Preview description',
  coverImage: 'Preview image',
  status: 'Your answer',
  guests: 'Number of guests',
  phone: 'Phone number',
  message: 'Message',
  sections: 'Sections',
  stickers: 'Stickers',
  url: 'Song link',
};

function labelFor(path) {
  // the most specific named key (sections.3.data.title -> "title")
  const key = [...path].reverse().find((p) => typeof p === 'string');
  if (!key) return 'This field';
  if (LABELS[key]) return LABELS[key];
  const words = key.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

// zod's own wording starts like this; a message written in a schema ("must be 6 digits") doesn't
const isZodDefault = (msg) => /^(Invalid|Too (small|big)|Expected|Required)/.test(msg);

function friendly(issue) {
  const label = labelFor(issue.path);
  const custom = !isZodDefault(issue.message);
  if (custom) return /^[a-z]/.test(issue.message) ? `${label} ${issue.message}` : issue.message;

  switch (issue.code) {
    case 'invalid_type':
      return /received undefined|received null/.test(issue.message) ? `${label} is required` : `${label} doesn't look right`;
    case 'too_small':
      if (issue.origin === 'string') return issue.minimum <= 1 ? `${label} is required` : `${label} must be at least ${issue.minimum} characters`;
      if (issue.origin === 'array') return `Please add at least ${issue.minimum} ${label.toLowerCase()}`;
      return `${label} must be at least ${issue.minimum}`;
    case 'too_big':
      if (issue.origin === 'string') return `${label} can be at most ${issue.maximum} characters`;
      if (issue.origin === 'array') return `You can have at most ${issue.maximum} ${label.toLowerCase()}`;
      return `${label} can be at most ${issue.maximum}`;
    case 'invalid_format':
      if (issue.format === 'email') return 'Please enter a valid email address';
      if (issue.format === 'url') return `${label} must be a valid link`;
      return `${label} doesn't look right`;
    case 'invalid_value':
      return `Please choose a valid ${label.toLowerCase()}`;
    default:
      return `${label} doesn't look right`;
  }
}

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body ?? {});
  if (!result.success) return res.status(400).json({ message: friendly(result.error.issues[0]) });
  req.body = result.data;
  next();
};

module.exports = validate;
