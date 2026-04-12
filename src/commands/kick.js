const { SlashCommandBuilder } = require('discord.js');
const Case = require('../models/Case');
const { success, error } = require('../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from the server')
    .addUserOption(o => o.setName('user').setDescription('User to kick').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Kick reason').setRequired(false)),

  executeMessage: async (message, args) => {
    if (!message.member || !message.member.permissions.has('KickMembers')) return message.reply({ embeds: [error('You need Kick Members permission.')] });
    const user = message.mentions.users.first();
    if (!user) return message.reply({ embeds: [error('Usage: !kick <user mention> [reason]')] });
    const reason = args.slice(1).join(' ') || 'No reason provided';
    try {
      const member = await message.guild.members.fetch(user.id);
      await member.kick(reason);
      const c = new Case({ guildId: message.guild.id, userId: user.id, moderatorId: message.author.id, type: 'kick', reason });
      await c.save();
      return message.reply({ embeds: [success(`Kicked ${user.tag}\n**Reason:** ${reason}`)] });
    } catch (err) {
      console.error(err);
      return message.reply({ embeds: [error('Failed to kick user.')] });
    }
  },

  executeInteraction: async (interaction) => {
    if (!interaction.member || !interaction.member.permissions.has('KickMembers')) return interaction.reply({ embeds: [error('You need Kick Members permission.')], ephemeral: true });
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    try {
      const member = await interaction.guild.members.fetch(user.id);
      await member.kick(reason);
      const c = new Case({ guildId: interaction.guild.id, userId: user.id, moderatorId: interaction.user.id, type: 'kick', reason });
      await c.save();
      return interaction.reply({ embeds: [success(`Kicked ${user.tag}\n**Reason:** ${reason}`)], ephemeral: false });
    } catch (err) {
      console.error(err);
      return interaction.reply({ embeds: [error('Failed to kick user.')], ephemeral: true });
    }
  }
};
