const express = require('express');
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
app.use(
  cors({
    origin: (origin, cb) => cb(null, !origin || allowed.includes(origin)),
    allowedHeaders: ['Content-Type', 'Authorization', 'x-unlock-token'],
  })
);

app.use(express.json({ limit: '1mb' }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/invitations', require('./routes/invitation.routes'));
app.use('/api/uploads', require('./routes/upload.routes'));
app.use('/api/public', require('./routes/public.routes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
