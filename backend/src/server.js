require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Start listening even if the database is down: requests get a clear 503 from the app
// (see config/db.js) and the connection is retried on the next request.
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
connectDB(process.env.MONGODB_URI).catch(() => {
  console.error('Database not connected yet. Check MONGODB_URI in backend/.env (user, password, cluster) and Atlas Network Access.');
});
