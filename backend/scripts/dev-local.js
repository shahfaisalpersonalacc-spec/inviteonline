// Local development without MongoDB Atlas: starts a real MongoDB via mongodb-memory-server,
// persisted in backend/.localdb so data survives restarts. Other settings still come from .env.
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { MongoMemoryServer } = require('mongodb-memory-server');

(async () => {
  const dbPath = path.join(__dirname, '..', '.localdb');
  fs.mkdirSync(dbPath, { recursive: true });
  const mongo = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: 'wiredTiger', port: 27027 } });

  process.env.MONGODB_URI = mongo.getUri('inviteonline');
  process.env.JWT_SECRET ||= 'local-dev-secret-change-me';
  console.log(`Local MongoDB at ${process.env.MONGODB_URI} (data in .localdb)`);

  const stop = async () => {
    await mongo.stop({ doCleanup: false });
    process.exit(0);
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);

  require('../src/server');
})();
