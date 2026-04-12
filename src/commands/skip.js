const { SlashCommandBuilder } = require('discord.js');
const Embed = require('../lib/embed');
const musicManager = require('../lib/musicManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current track'),

  executeMessage: async (message) => {
    const guildId = message.guild.id;
    const player = musicManager.getPlayer(guildId);
    
    if (!player || !player.current) {
      return message.reply('Nothing is playing.');
    }

    const next = musicManager.skipTrack(guildId);
    if (next) {
      return message.reply(`⏭️ Skipped. Now playing: ${next.title}`);
    }

    return message.reply('⏭️ Skipped. Queue ended.');
  },

  async execute(interaction) {
    const guildId = interaction.guildId;
    const player = musicManager.getPlayer(guildId);

    if (!player || !player.current) {
      return interaction.reply({ embeds: [Embed.error('Nothing is playing')] });
    }

    const current = player.current;
    const next = musicManager.skipTrack(guildId);

    const embed = Embed.success('Skipped')
      .addFields(
        { name: 'Previous Track', value: current.title, inline: false },
        { name: 'Next Track', value: next ? next.title : 'Queue ended', inline: false }
      );

    return interaction.reply({ embeds: [embed] });
  }
};
