const mongoose = require('mongoose');
const { Schema } = mongoose;

const welcomeMessageSchema = new Schema({
  guildId: { type: String, required: true, unique: true },
  enabled: { type: Boolean, default: false },
  message: String,
  channelId: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.WelcomeMessage || mongoose.model('WelcomeMessage', welcomeMessageSchema);
