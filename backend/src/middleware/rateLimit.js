const { rateLimit } = require('express-rate-limit');

const isTest = process.env.NODE_ENV === 'test';

const make = (windowMinutes, limit, message) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skip: () => isTest,
    message: { message },
  });

module.exports = {
  authLimiter: make(15, 30, 'Too many attempts, please try again in a few minutes'),
  emailLimiter: make(60, 5, 'Too many reset requests, please try again later'),
  guestLimiter: make(10, 20, 'Too many submissions, please slow down'),
  uploadLimiter: make(10, 60, 'Too many uploads, please slow down'),
};
