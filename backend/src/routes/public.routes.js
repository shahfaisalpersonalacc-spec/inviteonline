const router = require('express').Router();
const c = require('../controllers/public.controller');
const validate = require('../middleware/validate');
const { authLimiter, guestLimiter, viewLimiter } = require('../middleware/rateLimit');

router.get('/:slug', c.getBySlug);
router.post('/:slug/unlock', authLimiter, validate(c.schemas.unlock), c.unlock);
router.post('/:slug/view', viewLimiter, c.trackView);
router.post('/:slug/rsvp', guestLimiter, validate(c.schemas.rsvp), c.submitRsvp);
router.get('/:slug/wishes', c.listWishes);
router.post('/:slug/wishes', guestLimiter, validate(c.schemas.wish), c.addWish);

module.exports = router;
