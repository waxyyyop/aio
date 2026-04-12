const mongoose = require('mongoose');
const { Schema } = mongoose;

const botConfigSchema = new Schema({
  premiumAvatar: { type: String },
  premiumBanner: { type: String },
  defaultAvatar: { type: String },
  defaultBanner: { type: String },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.BotConfig || mongoose.model('BotConfig', botConfigSchema);
