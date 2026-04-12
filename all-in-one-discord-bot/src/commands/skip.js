module.exports = {
  data: { name: 'skip', description: 'Skip current track' },
  executeMessage: async (message) => {
    const guildId = message.guild.id;
    const state = message.client.music.get(guildId);
    if (!state || !state.player) return message.reply('Nothing is playing.');
    state.player.stop();
    await message.reply('Skipped.');
  }
};
