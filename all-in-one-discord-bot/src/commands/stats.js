const { SlashCommandBuilder } = require('discord.js');
const Case = require('../models/Case');
const PremiumGuild = require('../models/PremiumGuild');
const { info } = require('../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Show bot/guild statistics'),

  executeMessage: async (message) => {
    try {
      const bans = await Case.countDocuments({ guildId: message.guild.id, type: 'ban' });
      const kicks = await Case.countDocuments({ guildId: message.guild.id, type: 'kick' });
      const warns = await Case.countDocuments({ guildId: message.guild.id, type: 'warn' });
      const isPremium = await PremiumGuild.findOne({ guildId: message.guild.id });
      
      const embed = info('', '📊 Guild Stats').addFields([
        { name: 'Members', value: message.guild.memberCount.toString(), inline: true },
        { name: 'Channels', value: message.guild.channels.cache.size.toString(), inline: true },
        { name: 'Roles', value: message.guild.roles.cache.size.toString(), inline: true },
        { name: 'Total Bans', value: bans.toString(), inline: true },
        { name: 'Total Kicks', value: kicks.toString(), inline: true },
        { name: 'Total Warns', value: warns.toString(), inline: true },
        { name: 'Premium', value: isPremium ? '✅ Yes' : '❌ No', inline: true }
      ]);
      return message.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      return message.reply({ embeds: [info('Error fetching stats')] });
    }
  },

  executeInteraction: async (interaction) => {
    try {
      const bans = await Case.countDocuments({ guildId: interaction.guild.id, type: 'ban' });
      const kicks = await Case.countDocuments({ guildId: interaction.guild.id, type: 'kick' });
      const warns = await Case.countDocuments({ guildId: interaction.guild.id, type: 'warn' });
      const isPremium = await PremiumGuild.findOne({ guildId: interaction.guild.id });
      
      const embed = info('', '📊 Guild Stats').addFields([
        { name: 'Members', value: interaction.guild.memberCount.toString(), inline: true },
        { name: 'Channels', value: interaction.guild.channels.cache.size.toString(), inline: true },
        { name: 'Roles', value: interaction.guild.roles.cache.size.toString(), inline: true },
        { name: 'Total Bans', value: bans.toString(), inline: true },
        { name: 'Total Kicks', value: kicks.toString(), inline: true },
        { name: 'Total Warns', value: warns.toString(), inline: true },
        { name: 'Premium', value: isPremium ? '✅ Yes' : '❌ No', inline: true }
      ]);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (err) {
      console.error(err);
      return interaction.reply({ embeds: [info('Error fetching stats')], ephemeral: true });
    }
  }
};
