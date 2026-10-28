const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

// One shared connection per process. On serverless hosts (Vercel) the module stays warm
// between requests, so the cached promise is reused instead of reconnecting every time.
let pending = null;

function connectDB(uri = process.env.MONGODB_URI) {
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose.connection);
  if (!uri) return Promise.reject(Object.assign(new Error('MONGODB_URI is not set'), { status: 503 }));
  if (!pending) {
    pending = mongoose
      // MONGODB_DB picks the database when the URI doesn't name one (e.g. ".../?retryWrites=true").
      .connect(uri, { serverSelectionTimeoutMS: 8000, ...(process.env.MONGODB_DB ? { dbName: process.env.MONGODB_DB } : {}) })
      .then((m) => {
        console.log('MongoDB connected');
        return m.connection;
      })
      .catch((err) => {
        pending = null; // allow the next request to retry
        console.error('MongoDB connection failed:', err.message);
        throw Object.assign(new Error("We're having trouble connecting right now. Please try again in a moment."), { status: 503 });
      });
  }
  return pending;
}

module.exports = connectDB;
