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
      file.mimetype.startsWith(mimePrefix) ? cb(null, true) : cb(new HttpError(400, mimePrefix === 'image/' ? 'Please choose an image file (JPG, PNG or WebP).' : 'Please choose an audio file, such as an MP3.')),
  }).single('file');

const imageUpload = makeUpload(8, 'image/');
const audioUpload = makeUpload(15, 'audio/');

router.use(requireAuth, uploadLimiter);

router.post('/image', imageUpload, async (req, res) => {
  if (!req.file) throw new HttpError(400, 'Please choose a file to upload.');
  const result = await uploadBuffer(req.file.buffer, { folder: `inviteonline/${req.user._id}/images` });
  res.status(201).json({ url: result.secure_url, width: result.width, height: result.height });
});

router.post('/audio', audioUpload, async (req, res) => {
  if (!req.file) throw new HttpError(400, 'Please choose a file to upload.');
  const result = await uploadBuffer(req.file.buffer, { folder: `inviteonline/${req.user._id}/audio`, resourceType: 'video' });
  res.status(201).json({ url: result.secure_url, duration: result.duration });
});

module.exports = router;
