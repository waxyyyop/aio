const { SlashCommandBuilder } = require('discord.js');
const Case = require('../models/Case');
const { success, error, info } = require('../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user')
    .addUserOption(o => o.setName('user').setDescription('User to warn').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Warn reason').setRequired(false)),

  executeMessage: async (message, args) => {
    if (!message.member || !message.member.permissions.has('ModerateMembers')) return message.reply({ embeds: [error('You need Moderate Members permission.')] });
    const user = message.mentions.users.first();
    if (!user) return message.reply({ embeds: [error('Usage: !warn <user mention> [reason]')] });
    const reason = args.slice(1).join(' ') || 'No reason provided';
    try {
      const warns = await Case.countDocuments({ guildId: message.guild.id, userId: user.id, type: 'warn' });
      const c = new Case({ guildId: message.guild.id, userId: user.id, moderatorId: message.author.id, type: 'warn', reason });
      await c.save();
      const embed = success(`⚠️ Warned ${user.tag}\n**Reason:** ${reason}\n**Total Warns:** ${warns + 1}`);
      message.reply({ embeds: [embed] });
      if (warns + 1 >= 3) {
        try {
          await message.guild.members.ban(user, { reason: `Reached 3 warnings` });
          return message.channel.send({ embeds: [info(`User auto-banned after 3 warnings`)] });
        } catch (err) {
          console.error('Failed to auto-ban:', err);
        }
      }
    } catch (err) {
      console.error(err);
      return message.reply({ embeds: [error('Failed to warn user.')] });
    }
  },

  executeInteraction: async (interaction) => {
    if (!interaction.member || !interaction.member.permissions.has('ModerateMembers')) return interaction.reply({ embeds: [error('You need Moderate Members permission.')], ephemeral: true });
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    try {
      const warns = await Case.countDocuments({ guildId: interaction.guild.id, userId: user.id, type: 'warn' });
      const c = new Case({ guildId: interaction.guild.id, userId: user.id, moderatorId: interaction.user.id, type: 'warn', reason });
      await c.save();
      const embed = success(`⚠️ Warned ${user.tag}\n**Reason:** ${reason}\n**Total Warns:** ${warns + 1}`);
      interaction.reply({ embeds: [embed], ephemeral: false });
      if (warns + 1 >= 3) {
        try {
          await interaction.guild.members.ban(user, { reason: `Reached 3 warnings` });
          return interaction.channel.send({ embeds: [info(`User auto-banned after 3 warnings`)] });
        } catch (err) {
          console.error('Failed to auto-ban:', err);
        }
      }
    } catch (err) {
      console.error(err);
      return interaction.reply({ embeds: [error('Failed to warn user.')], ephemeral: true });
    }
  }
};
