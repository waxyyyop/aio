const mongoose = require('mongoose');
const { Schema } = mongoose;

const guildConfigSchema = new Schema({
  guildId: { type: String, required: true, unique: true },
  prefix: { type: String, default: process.env.PREFIX || '!' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.GuildConfig || mongoose.model('GuildConfig', guildConfigSchema);