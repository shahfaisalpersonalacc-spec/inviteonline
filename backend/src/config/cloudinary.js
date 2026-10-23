const cloudinary = require('cloudinary').v2;

let configured = false;

function getCloudinary() {
  if (!configured) {
    const { CLOUDINARY_URL, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
    // Preferred: the single "API environment variable" from the Cloudinary Console
    // (cloudinary://KEY:SECRET@CLOUD_NAME), so key, secret and cloud always belong together.
    const fromUrl = CLOUDINARY_URL && CLOUDINARY_URL.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
    const creds = fromUrl
      ? { api_key: fromUrl[1], api_secret: fromUrl[2], cloud_name: fromUrl[3] }
      : { cloud_name: CLOUDINARY_CLOUD_NAME, api_key: CLOUDINARY_API_KEY, api_secret: CLOUDINARY_API_SECRET };
    if (!creds.cloud_name || !creds.api_key || !creds.api_secret) {
      const err = new Error('File uploads are not configured on the server (Cloudinary keys missing)');
      err.status = 503;
      throw err;
    }
    cloudinary.config({ ...creds, secure: true });
    configured = true;
  }
  return cloudinary;
}

// Uploads an in-memory buffer; resourceType: 'image' | 'video' (Cloudinary stores audio as 'video').
function uploadBuffer(buffer, { folder, resourceType = 'image' }) {
  const client = getCloudinary();
  return new Promise((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        ...(resourceType === 'image'
          ? { transformation: [{ width: 2000, height: 2000, crop: 'limit', quality: 'auto', fetch_format: 'auto' }] }
          : {}),
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

module.exports = { uploadBuffer };
