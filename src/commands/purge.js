const { SlashCommandBuilder } = require('discord.js');
const Case = require('../models/Case');
const { success, error } = require('../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete multiple messages')
    .addIntegerOption(o => o.setName('amount').setDescription('Number of messages to delete (1-100)').setRequired(true).setMinValue(1).setMaxValue(100)),

  executeMessage: async (message, args) => {
    if (!message.member || !message.member.permissions.has('ManageMessages')) return message.reply({ embeds: [error('You need Manage Messages permission.')] });
    const amount = parseInt(args[0]);
    if (!amount || amount < 1 || amount > 100) return message.reply({ embeds: [error('Please specify 1-100 messages to delete.')] });
    try {
      const deleted = await message.channel.bulkDelete(amount, true);
      const c = new Case({ guildId: message.guild.id, userId: message.author.id, moderatorId: message.author.id, type: 'purge', reason: `Purged ${deleted.size} messages` });
      await c.save();
      const reply = await message.reply({ embeds: [success(`Deleted ${deleted.size} messages`)] });
      setTimeout(() => reply.delete().catch(() => {}), 5000);
    } catch (err) {
      console.error(err);
      return message.reply({ embeds: [error('Failed to purge messages.')] });
    }
  },

  executeInteraction: async (interaction) => {
    if (!interaction.member || !interaction.member.permissions.has('ManageMessages')) return interaction.reply({ embeds: [error('You need Manage Messages permission.')], ephemeral: true });
    const amount = interaction.options.getInteger('amount');
    try {
      const deleted = await interaction.channel.bulkDelete(amount, true);
      const c = new Case({ guildId: interaction.guild.id, userId: interaction.user.id, moderatorId: interaction.user.id, type: 'purge', reason: `Purged ${deleted.size} messages` });
      await c.save();
      return interaction.reply({ embeds: [success(`Deleted ${deleted.size} messages`)], ephemeral: true });
    } catch (err) {
      console.error(err);
      return interaction.reply({ embeds: [error('Failed to purge messages.')], ephemeral: true });
    }
  }
};
