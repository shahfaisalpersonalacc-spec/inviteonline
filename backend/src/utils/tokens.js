const crypto = require('crypto');
const jwt = require('jsonwebtoken');

function secret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET is not set');
  return s;
}

const signAuthToken = (userId) =>
  jwt.sign({ sub: String(userId), scope: 'auth' }, secret(), { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const signUnlockToken = (invitationId) =>
  jwt.sign({ inv: String(invitationId), scope: 'unlock' }, secret(), { expiresIn: '12h' });

function verifyToken(token, scope) {
  try {
    const payload = jwt.verify(token, secret());
    return payload.scope === scope ? payload : null;
  } catch {
    return null;
  }
}

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const randomToken = () => crypto.randomBytes(32).toString('hex');

module.exports = { signAuthToken, signUnlockToken, verifyToken, sha256, randomToken };
