const { SlashCommandBuilder } = require('discord.js');
const Case = require('../models/Case');
const { success, error, info } = require('../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server')
    .addUserOption(o => o.setName('user').setDescription('User to ban').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Ban reason').setRequired(false)),

  executeMessage: async (message, args) => {
    if (!message.member || !message.member.permissions.has('BanMembers')) return message.reply({ embeds: [error('You need Ban Members permission.')] });
    const user = message.mentions.users.first();
    if (!user) return message.reply({ embeds: [error('Usage: !ban <user mention> [reason]')] });
    const reason = args.slice(1).join(' ') || 'No reason provided';
    try {
      await message.guild.members.ban(user, { reason });
      const c = new Case({ guildId: message.guild.id, userId: user.id, moderatorId: message.author.id, type: 'ban', reason });
      await c.save();
      return message.reply({ embeds: [success(`Banned ${user.tag}\n**Reason:** ${reason}`)] });
    } catch (err) {
      console.error(err);
      return message.reply({ embeds: [error('Failed to ban user.')] });
    }
  },

  executeInteraction: async (interaction) => {
    if (!interaction.member || !interaction.member.permissions.has('BanMembers')) return interaction.reply({ embeds: [error('You need Ban Members permission.')], ephemeral: true });
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    try {
      await interaction.guild.members.ban(user, { reason });
      const c = new Case({ guildId: interaction.guild.id, userId: user.id, moderatorId: interaction.user.id, type: 'ban', reason });
      await c.save();
      return interaction.reply({ embeds: [success(`Banned ${user.tag}\n**Reason:** ${reason}`)], ephemeral: false });
    } catch (err) {
      console.error(err);
      return interaction.reply({ embeds: [error('Failed to ban user.')], ephemeral: true });
    }
  }
};
