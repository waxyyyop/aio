const mongoose = require('mongoose');
const { Schema } = mongoose;

const caseSchema = new Schema({
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  moderatorId: { type: String, required: true },
  type: { type: String, enum: ['warn', 'mute', 'kick', 'ban', 'purge'], required: true },
  reason: { type: String },
  duration: { type: Number }, // in ms, for mutes
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
});

module.exports = mongoose.models.Case || mongoose.model('Case', caseSchema);
