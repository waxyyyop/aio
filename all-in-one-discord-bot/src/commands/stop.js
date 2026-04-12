module.exports = {
  data: { name: 'stop', description: 'Stop playback and clear queue' },
  executeMessage: async (message) => {
    const guildId = message.guild.id;
    const state = message.client.music.get(guildId);
    if (!state) return message.reply('Nothing to stop.');
    state.queue = [];
    state.player?.stop();
    await message.reply('Stopped playback and cleared the queue.');
  }
};
