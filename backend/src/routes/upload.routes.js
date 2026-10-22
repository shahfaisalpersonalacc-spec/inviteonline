const router = require('express').Router();
const multer = require('multer');
const { requireAuth } = require('../middleware/auth');
const { uploadLimiter } = require('../middleware/rateLimit');
const { uploadBuffer } = require('../config/cloudinary');
const HttpError = require('../utils/HttpError');

const MB = 1024 * 1024;

const makeUpload = (maxMb, mimePrefix) =>
  multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxMb * MB, files: 1 },
    fileFilter: (req, file, cb) =>
      file.mimetype.startsWith(mimePrefix) ? cb(null, true) : cb(new HttpError(400, `Only ${mimePrefix.slice(0, -1)} files are allowed`)),
  }).single('file');

const imageUpload = makeUpload(8, 'image/');
const audioUpload = makeUpload(15, 'audio/');

router.use(requireAuth, uploadLimiter);

router.post('/image', imageUpload, async (req, res) => {
  if (!req.file) throw new HttpError(400, 'No file uploaded');
  const result = await uploadBuffer(req.file.buffer, { folder: `inviteonline/${req.user._id}/images` });
  res.status(201).json({ url: result.secure_url, width: result.width, height: result.height });
});

router.post('/audio', audioUpload, async (req, res) => {
  if (!req.file) throw new HttpError(400, 'No file uploaded');
  const result = await uploadBuffer(req.file.buffer, { folder: `inviteonline/${req.user._id}/audio`, resourceType: 'video' });
  res.status(201).json({ url: result.secure_url, duration: result.duration });
});

module.exports = router;
