const mongoose = require('mongoose');
const { Schema } = mongoose;

const premiumGuildSchema = new Schema({
  guildId: { type: String, required: true, unique: true },
  addedBy: { type: String, required: true },
  premiumSince: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  noPrefix: { type: Boolean, default: false }
});

module.exports = mongoose.models.PremiumGuild || mongoose.model('PremiumGuild', premiumGuildSchema);
