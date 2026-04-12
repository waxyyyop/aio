const { SlashCommandBuilder } = require('discord.js');
const Embed = require('../lib/embed');
const musicManager = require('../lib/musicManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Show the current music queue')
    .addNumberOption(option =>
      option.setName('page')
        .setDescription('Page number')
        .setRequired(false)
        .setMinValue(1)
    ),

  executeMessage: async (message, args) => {
    const guildId = message.guild.id;
    const queue = musicManager.getQueue(guildId);
    const player = musicManager.getPlayer(guildId);

    if (!queue || queue.length === 0) {
      return message.reply('Queue is empty.');
    }

    const list = queue.map((t, i) => `${i + 1}. ${t.title} - ${t.author}`).slice(0, 10).join('\n');
    const status = player?.playing ? '▶️ Playing' : '⏸️ Paused';
    
    await message.reply(`${status}\n\n${list}`);
  },

  async execute(interaction) {
    const guildId = interaction.guildId;
    const page = interaction.options.getNumber('page') || 1;
    const queue = musicManager.getQueue(guildId);
    const player = musicManager.getPlayer(guildId);

    if (!queue || queue.length === 0) {
      return interaction.reply({ embeds: [Embed.info('Queue is empty')] });
    }

    const perPage = 10;
    const maxPage = Math.ceil(queue.length / perPage);
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const pageQueue = queue.slice(start, end);

    const list = pageQueue.map((t, i) => `${start + i + 1}. ${t.title}\n   👤 ${t.author}`).join('\n');
    
    const embed = Embed.success('Music Queue')
      .setDescription(list || 'No tracks')
      .addFields(
        { name: 'Status', value: player?.playing ? '▶️ Playing' : '⏸️ Paused', inline: true },
        { name: 'Total Tracks', value: queue.length.toString(), inline: true },
        { name: 'Loop Mode', value: player?.loop || 'none', inline: true },
        { name: 'Page', value: `${page}/${maxPage}`, inline: true }
      );

    return interaction.reply({ embeds: [embed] });
  }
};
