const { SlashCommandBuilder, getVoiceConnection } = require('discord.js');
const Embed = require('../lib/embed');
const musicManager = require('../lib/musicManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Leave the voice channel and clear queue'),

  executeMessage: async (message) => {
    const guildId = message.guild.id;
    const connection = getVoiceConnection(guildId);

    if (!connection) {
      return message.reply('Not connected to a voice channel.');
    }

    try {
      connection.destroy();
      musicManager.deletePlayer(guildId);
      return message.reply('👋 Left the voice channel and cleared the queue.');
    } catch (err) {
      return message.reply('Error leaving voice channel: ' + err.message);
    }
  },

  async execute(interaction) {
    const guildId = interaction.guildId;
    const connection = getVoiceConnection(guildId);

    if (!connection) {
      return interaction.reply({ embeds: [Embed.error('Not connected to a voice channel')] });
    }

    try {
      connection.destroy();
      musicManager.deletePlayer(guildId);

      const embed = Embed.success('Disconnected')
        .setDescription('Left the voice channel');

      return interaction.reply({ embeds: [embed] });
    } catch (err) {
      return interaction.reply({ embeds: [Embed.error('Error: ' + err.message)] });
    }
  }
};
