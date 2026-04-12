const mongoose = require('mongoose');
const { Schema } = mongoose;

const reactionRoleSchema = new Schema({
  guildId: { type: String, required: true },
  messageId: { type: String, required: true },
  channelId: String,
  emoji: String,
  roleId: String,
  createdAt: { type: Date, default: Date.now }
});

reactionRoleSchema.index({ guildId: 1, messageId: 1, emoji: 1 }, { unique: true });

module.exports = mongoose.models.ReactionRole || mongoose.model('ReactionRole', reactionRoleSchema);
