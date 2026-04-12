const mongoose = require('mongoose');
const { Schema } = mongoose;

const userBalanceSchema = new Schema({
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  balance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

userBalanceSchema.index({ guildId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.models.UserBalance || mongoose.model('UserBalance', userBalanceSchema);
