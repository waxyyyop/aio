const { SlashCommandBuilder } = require('discord.js');
const UserBalance = require('../models/UserBalance');
const PremiumGuild = require('../models/PremiumGuild');
const { success, error, info } = require('../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('PREMIUM: Check your coins balance')
    .addUserOption(o => o.setName('user').setDescription('User to check balance for').setRequired(false)),

  executeMessage: async (message, args) => {
    const isPremium = await PremiumGuild.findOne({ guildId: message.guild.id });
    if (!isPremium) return message.reply({ embeds: [error('This is a premium feature.')] });

    const user = message.mentions.users.first() || message.author;
    try {
      let balance = await UserBalance.findOne({ guildId: message.guild.id, userId: user.id });
      if (!balance) balance = new UserBalance({ guildId: message.guild.id, userId: user.id, balance: 0 });
      return message.reply({ embeds: [info(`${user.username}'s Balance: **${balance.balance} coins** 💰`)] });
    } catch (err) {
      console.error(err);
      return message.reply({ embeds: [error('Failed to fetch balance.')] });
    }
  },

  executeInteraction: async (interaction) => {
    const isPremium = await PremiumGuild.findOne({ guildId: interaction.guild.id });
    if (!isPremium) return interaction.reply({ embeds: [error('This is a premium feature.')], ephemeral: true });

    const user = interaction.options.getUser('user') || interaction.user;
    try {
      let balance = await UserBalance.findOne({ guildId: interaction.guild.id, userId: user.id });
      if (!balance) balance = new UserBalance({ guildId: interaction.guild.id, userId: user.id, balance: 0 });
      return interaction.reply({ embeds: [info(`${user.username}'s Balance: **${balance.balance} coins** 💰`)], ephemeral: true });
    } catch (err) {
      console.error(err);
      return interaction.reply({ embeds: [error('Failed to fetch balance.')], ephemeral: true });
    }
  }
};
