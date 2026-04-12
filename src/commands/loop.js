const { SlashCommandBuilder } = require('discord.js');
const Embed = require('../lib/embed');
const musicManager = require('../lib/musicManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Set loop mode for music')
    .addStringOption(option =>
      option.setName('mode')
        .setDescription('Loop mode')
        .setRequired(true)
        .addChoices(
          { name: 'Off (none)', value: 'none' },
          { name: 'Loop Track', value: 'track' },
          { name: 'Loop Queue', value: 'queue' }
        )
    ),

  executeMessage: async (message, args) => {
    const mode = args[0]?.toLowerCase();
    if (!['none', 'track', 'queue'].includes(mode)) {
      return message.reply('Mode must be: none, track, or queue');
    }

    const guildId = message.guildId;
    const current = musicManager.setLoop(guildId, mode);

    if (current === null) {
      return message.reply('No music player active.');
    }

    const modes = { 'none': '🔁 Off', 'track': '🔂 Track', 'queue': '🔁 Queue' };
    return message.reply(`${modes[current]} mode enabled`);
  },

  async execute(interaction) {
    const mode = interaction.options.getString('mode');
    const guildId = interaction.guildId;
    const current = musicManager.setLoop(guildId, mode);

    if (current === null) {
      return interaction.reply({ embeds: [Embed.error('No music player active')] });
    }

    const modes = { 'none': '🔁 Off', 'track': '🔂 Track', 'queue': '🔁 Queue' };
    const embed = Embed.success('Loop Mode Updated')
      .setDescription(`${modes[current]} mode enabled`);

    return interaction.reply({ embeds: [embed] });
  }
};
