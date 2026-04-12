const mongoose = require('mongoose');
const { Schema } = mongoose;

const antinukeConfigSchema = new Schema({
  guildId: { type: String, required: true, unique: true },
  enabled: { type: Boolean, default: false },
  deleteChannelThreshold: { type: Number, default: 5 }, // auto-ban if N channels deleted in 5 min
  deleteRoleThreshold: { type: Number, default: 5 },
  deleteMessagesThreshold: { type: Number, default: 50 },
  raidThreshold: { type: Number, default: 10 }, // auto-ban if N joins in 1 min
  action: { type: String, enum: ['warn', 'kick', 'ban'], default: 'ban' },
  whitelist: [String], // whitelisted user IDs
  blacklist: [String], // blacklisted user IDs
  extraOwners: [String], // extra owner user IDs (for command access)
  logs: { type: String }, // log channel ID
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.AntinukeConfig || mongoose.model('AntinukeConfig', antinukeConfigSchema);
