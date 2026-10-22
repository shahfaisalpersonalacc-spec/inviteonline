const User = require('../models/User');
const { verifyToken } = require('../utils/tokens');
const HttpError = require('../utils/HttpError');

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const payload = token && verifyToken(token, 'auth');
  if (!payload) throw new HttpError(401, 'Please log in to continue');

  const user = await User.findById(payload.sub);
  if (!user) throw new HttpError(401, 'Account no longer exists');
  req.user = user;
  next();
}

module.exports = { requireAuth };
