const { SlashCommandBuilder } = require('discord.js');
const Embed = require('../lib/embed');
const musicManager = require('../lib/musicManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Set the music volume')
    .addNumberOption(option =>
      option.setName('level')
        .setDescription('Volume level (0-200)')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(200)
    ),

  executeMessage: async (message, args) => {
    const level = parseInt(args[0]);
    if (isNaN(level) || level < 0 || level > 200) {
      return message.reply('Volume must be between 0 and 200.');
    }

    const guildId = message.guildId;
    const current = musicManager.setVolume(guildId, level);

    if (current === null) {
      return message.reply('No music player active.');
    }

    return message.reply(`🔊 Volume set to ${current}%`);
  },

  async execute(interaction) {
    const level = interaction.options.getNumber('level');
    const guildId = interaction.guildId;
    const current = musicManager.setVolume(guildId, level);

    if (current === null) {
      return interaction.reply({ embeds: [Embed.error('No music player active')] });
    }

    const embed = Embed.success('Volume Updated')
      .setDescription(`🔊 Volume: **${current}%**`);

    return interaction.reply({ embeds: [embed] });
  }
};
