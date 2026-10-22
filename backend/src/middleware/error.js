const multer = require('multer');

function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let status = err.status || 500;
  let message = err.message || 'Something went wrong';

  if (err instanceof multer.MulterError) {
    status = 400;
    message = err.code === 'LIMIT_FILE_SIZE' ? 'File is too large' : err.message;
  } else if (err.name === 'CastError') {
    status = 404;
    message = 'Not found';
  } else if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'value';
    message = field === 'email' ? 'An account with this email already exists' : `This ${field} is already taken`;
  } else if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }

  if (status >= 500) console.error(err);
  res.status(status).json({ message: status >= 500 && process.env.NODE_ENV === 'production' ? 'Server error' : message });
}

module.exports = { notFound, errorHandler };
