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
  authLimiter: make(15, 30, 'Too many attempts. Please wait a few minutes and try again.'),
  emailLimiter: make(60, 5, "You've requested a lot of emails. Please wait a while and try again."),
  guestLimiter: make(10, 20, 'Too many submissions. Please wait a few minutes and try again.'),
  viewLimiter: make(10, 30, 'Too many requests. Please wait a moment.'),
  uploadLimiter: make(10, 60, 'Too many uploads. Please wait a few minutes and try again.'),
};
