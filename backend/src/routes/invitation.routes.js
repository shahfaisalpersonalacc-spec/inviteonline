const router = require('express').Router();
const c = require('../controllers/invitation.controller');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimit');

router.use(requireAuth);

router.get('/', c.list);
router.post('/', validate(c.schemas.create), c.create);
router.get('/slug-available/:slug', c.slugAvailable);
router.get('/:id', c.get);
router.put('/:id', validate(c.schemas.update), c.update);
// deleting needs the account password (rate-limited like logins, so it can't be used to guess it)
router.delete('/:id', authLimiter, validate(c.schemas.remove), c.remove);
router.post('/:id/duplicate', c.duplicate);
router.get('/:id/rsvps', c.listRsvps);
router.delete('/:id/rsvps/:rsvpId', c.deleteRsvp);
router.get('/:id/wishes', c.listWishes);
router.delete('/:id/wishes/:wishId', c.deleteWish);

module.exports = router;
