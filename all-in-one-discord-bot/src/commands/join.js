module.exports = {
  data: { name: 'join', description: 'Join the voice channel' },
  executeMessage: async (message) => {
    const vc = message.member.voice.channel;
    if (!vc) return message.reply('You need to be in a voice channel to use this.');
    const { joinVoiceChannel } = require('@discordjs/voice');
    const connection = joinVoiceChannel({
      channelId: vc.id,
      guildId: vc.guild.id,
      adapterCreator: vc.guild.voiceAdapterCreator
    });
    const state = message.client.music.get(vc.guild.id) || { connection: null, player: null, queue: [] };
    state.connection = connection;
    message.client.music.set(vc.guild.id, state);
    await message.reply(`Joined ${vc.name}`);
  }
};
