const multer = require('multer');

function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

const SERVER_ERROR = 'Something went wrong on our side. Please try again in a moment.';

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let status = err.status || err.statusCode || 500;
  let message = err.message || SERVER_ERROR;

  if (err instanceof multer.MulterError) {
    status = 400;
    message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'That file is too large. Photos can be up to 8 MB and songs up to 15 MB.'
        : 'Please upload one file at a time.';
  } else if (err.name === 'CastError') {
    status = 404;
    message = "We couldn't find that. It may have been deleted.";
  } else if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'value';
    message = field === 'email' ? 'An account with this email already exists. Try logging in instead.' : field === 'slug' ? 'This link is already taken. Please choose another.' : `This ${field} is already taken`;
  } else if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  } else if (err.type === 'entity.too.large') {
    message = 'That is too much to save at once. Try shortening some text or removing a few items.';
  } else if (err.type === 'entity.parse.failed') {
    message = 'Your request could not be read. Please refresh the page and try again.';
  }

  if (status >= 500) console.error(err);
  // Unexpected crashes (500) never show their technical text in production; deliberate 502/503
  // messages (email or uploads unavailable, database down) are written for users.
  res.status(status).json({ message: status === 500 && process.env.NODE_ENV === 'production' ? SERVER_ERROR : message });
}

module.exports = { notFound, errorHandler };
