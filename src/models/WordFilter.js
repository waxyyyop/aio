const mongoose = require('mongoose');
const { Schema } = mongoose;

const wordFilterSchema = new Schema({
  guildId: { type: String, required: true, unique: true },
  enabled: { type: Boolean, default: false },
  words: [String],
  action: { type: String, enum: ['warn', 'delete', 'mute'], default: 'delete' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.WordFilter || mongoose.model('WordFilter', wordFilterSchema);
