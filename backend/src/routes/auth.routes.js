const router = require('express').Router();
const c = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { authLimiter, emailLimiter } = require('../middleware/rateLimit');

router.post('/register', authLimiter, validate(c.schemas.register), c.register);
router.post('/login', authLimiter, validate(c.schemas.login), c.login);
router.get('/me', requireAuth, c.me);
router.put('/profile', requireAuth, validate(c.schemas.profile), c.updateProfile);
router.post('/forgot-password', emailLimiter, validate(c.schemas.forgot), c.forgotPassword);
router.post('/reset-password/:token', authLimiter, validate(c.schemas.reset), c.resetPassword);

module.exports = router;
