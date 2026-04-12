module.exports = {
  data: { name: 'queue', description: 'Show current queue' },
  executeMessage: async (message) => {
    const guildId = message.guild.id;
    const state = message.client.music.get(guildId);
    if (!state) return message.reply('Queue is empty.');
    const now = state.playing ? 'Playing' : 'Not playing';
    const list = state.queue.map((t, i) => `${i + 1}. ${t.title}`).slice(0, 10).join('\n') || 'No queued tracks.';
    await message.reply(`${now}\n${list}`);
  }
};
