const { SlashCommandBuilder } = require('discord.js');
const Embed = require('../lib/embed');
const musicManager = require('../lib/musicManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop playback and clear the queue'),

  executeMessage: async (message) => {
    const guildId = message.guild.id;
    const player = musicManager.getPlayer(guildId);

    if (!player) {
      return message.reply('Nothing to stop.');
    }

    musicManager.clearQueue(guildId);
    musicManager.deletePlayer(guildId);

    return message.reply('⏹️ Stopped playback and cleared the queue.');
  },

  async execute(interaction) {
    const guildId = interaction.guildId;
    const player = musicManager.getPlayer(guildId);

    if (!player) {
      return interaction.reply({ embeds: [Embed.error('Nothing to stop')] });
    }

    musicManager.clearQueue(guildId);
    musicManager.deletePlayer(guildId);

    const embed = Embed.success('Playback Stopped')
      .setDescription('Queue cleared and connection closed');

    return interaction.reply({ embeds: [embed] });
  }
};
