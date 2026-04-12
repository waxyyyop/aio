const mongoose = require('mongoose');
const { Schema } = mongoose;

const lavaliinkNodeSchema = new Schema({
  name: { type: String, required: true, unique: true },
  host: { type: String, required: true },
  port: { type: Number, required: true },
  password: { type: String, required: true },
  secure: { type: Boolean, default: false },
  priority: { type: Number, default: 0 },
  status: { type: String, enum: ['online', 'offline', 'error'], default: 'offline' },
  lastCheck: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.LavaliinkNode || mongoose.model('LavaliinkNode', lavaliinkNodeSchema);
