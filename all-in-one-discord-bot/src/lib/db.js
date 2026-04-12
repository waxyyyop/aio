const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

async function connect() {
  if (!MONGODB_URI) {
    console.warn('No MONGODB_URI provided; skipping MongoDB connection.');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}

module.exports = { connect, mongoose };