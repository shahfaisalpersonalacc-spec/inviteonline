// Load .env for local runs (tests set their own env; on Vercel the host injects variables).
if (process.env.NODE_ENV !== 'test') require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();

app.set('trust proxy', 1); // correct client IPs for rate limiting behind Render/Railway/Nginx
app.use(helmet());

const allowed = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((s) => s.trim().replace(/\/$/, ''));
// Outside production, a local frontend (any localhost port) is always allowed, even when
// CLIENT_URL points at the deployed site.
const isLocalDev = (origin) => process.env.NODE_ENV !== 'production' && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
app.use(
  cors({
    origin: (origin, cb) => cb(null, !origin || allowed.includes(origin) || isLocalDev(origin)),
    allowedHeaders: ['Content-Type', 'Authorization', 'x-unlock-token'],
  })
);

app.use(express.json({ limit: '1mb' }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ name: 'InviteOnline API', health: '/api/health' }));

// Reports whether the database is reachable (handy right after deploying).
app.get('/api/health', async (req, res) => {
  try {
    await connectDB();
    res.json({ ok: true, db: 'connected' });
  } catch (err) {
    res.status(503).json({ ok: false, db: 'not connected', reason: process.env.MONGODB_URI ? 'cannot reach MongoDB (check Atlas Network Access and the URI)' : 'MONGODB_URI is not set' });
  }
});

// Connect on first use so the app works however it is started (node server, Vercel functions, tests).
app.use('/api', async (req, res, next) => {
  if (req.method !== 'OPTIONS') await connectDB(); // CORS preflights never need the database
  next();
});
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/invitations', require('./routes/invitation.routes'));
app.use('/api/uploads', require('./routes/upload.routes'));
app.use('/api/public', require('./routes/public.routes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
