const { SlashCommandBuilder } = require('discord.js');
const Case = require('../models/Case');
const { info, error } = require('../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cases')
    .setDescription('View moderation cases')
    .addUserOption(o => o.setName('user').setDescription('User to show cases for').setRequired(false))
    .addIntegerOption(o => o.setName('limit').setDescription('Number of cases to show (default 10, max 50)').setRequired(false).setMaxValue(50).setMinValue(1)),

  executeMessage: async (message, args) => {
    if (!message.member || !message.member.permissions.has('ModerateMembers')) return message.reply({ embeds: [error('You need Moderate Members permission.')] });
    const user = message.mentions.users.first();
    const limit = parseInt(args[1]) || 10;

    try {
      const query = user ? { guildId: message.guild.id, userId: user.id } : { guildId: message.guild.id };
      const cases = await Case.find(query).sort({ createdAt: -1 }).limit(limit).lean().exec();
      if (!cases.length) return message.reply({ embeds: [info('No cases found.')] });

      const caseText = cases.map((c, i) => `**${i + 1}.** ${c.type.toUpperCase()} - <@${c.userId}>\n   Reason: ${c.reason || 'No reason'}`).join('\n');
      const embed = info(caseText, `Moderation Cases (${cases.length})`);
      return message.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      return message.reply({ embeds: [error('Failed to fetch cases.')] });
    }
  },

  executeInteraction: async (interaction) => {
    if (!interaction.member || !interaction.member.permissions.has('ModerateMembers')) return interaction.reply({ embeds: [error('You need Moderate Members permission.')], ephemeral: true });
    const user = interaction.options.getUser('user');
    const limit = interaction.options.getInteger('limit') || 10;

    try {
      const query = user ? { guildId: interaction.guild.id, userId: user.id } : { guildId: interaction.guild.id };
      const cases = await Case.find(query).sort({ createdAt: -1 }).limit(limit).lean().exec();
      if (!cases.length) return interaction.reply({ embeds: [info('No cases found.')], ephemeral: true });

      const caseText = cases.map((c, i) => `**${i + 1}.** ${c.type.toUpperCase()} - <@${c.userId}>\n   Reason: ${c.reason || 'No reason'}`).join('\n');
      const embed = info(caseText, `Moderation Cases (${cases.length})`);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (err) {
      console.error(err);
      return interaction.reply({ embeds: [error('Failed to fetch cases.')], ephemeral: true });
    }
  }
};
