module.exports = {
  data: { name: 'leave', description: 'Leave voice channel and clear queue' },
  executeMessage: async (message) => {
    const guildId = message.guild.id;
    const state = message.client.music.get(guildId);
    if (!state || !state.connection) return message.reply('Not connected.');
    try {
      state.player?.stop();
      state.connection.destroy();
    } catch (e) {}
    message.client.music.delete(guildId);
    await message.reply('Left the voice channel and cleared the queue.');
  }
};
