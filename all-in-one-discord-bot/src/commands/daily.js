const { SlashCommandBuilder } = require('discord.js');
const UserBalance = require('../models/UserBalance');
const PremiumGuild = require('../models/PremiumGuild');
const { success, error } = require('../lib/embed');

const lastDaily = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('PREMIUM: Claim daily coins reward (once per day)'),

  executeMessage: async (message) => {
    const isPremium = await PremiumGuild.findOne({ guildId: message.guild.id });
    if (!isPremium) return message.reply({ embeds: [error('This is a premium feature.')] });

    const key = `${message.guild.id}-${message.author.id}`;
    const lastClaim = lastDaily.get(key);
    const now = Date.now();
    if (lastClaim && now - lastClaim < 86400000) {
      const remaining = Math.ceil((86400000 - (now - lastClaim)) / 3600000);
      return message.reply({ embeds: [error(`Daily reward already claimed. Try again in ${remaining} hours.`)] });
    }

    try {
      let balance = await UserBalance.findOne({ guildId: message.guild.id, userId: message.author.id });
      if (!balance) balance = new UserBalance({ guildId: message.guild.id, userId: message.author.id, balance: 0 });
      const reward = Math.floor(Math.random() * 100) + 50; // 50-150 coins
      balance.balance += reward;
      await balance.save();
      lastDaily.set(key, now);
      return message.reply({ embeds: [success(`You claimed **${reward} coins**! 💰\nNew balance: ${balance.balance}`)] });
    } catch (err) {
      console.error(err);
      return message.reply({ embeds: [error('Failed to claim daily reward.')] });
    }
  },

  executeInteraction: async (interaction) => {
    const isPremium = await PremiumGuild.findOne({ guildId: interaction.guild.id });
    if (!isPremium) return interaction.reply({ embeds: [error('This is a premium feature.')], ephemeral: true });

    const key = `${interaction.guild.id}-${interaction.user.id}`;
    const lastClaim = lastDaily.get(key);
    const now = Date.now();
    if (lastClaim && now - lastClaim < 86400000) {
      const remaining = Math.ceil((86400000 - (now - lastClaim)) / 3600000);
      return interaction.reply({ embeds: [error(`Daily reward already claimed. Try again in ${remaining} hours.`)], ephemeral: true });
    }

    try {
      let balance = await UserBalance.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
      if (!balance) balance = new UserBalance({ guildId: interaction.guild.id, userId: interaction.user.id, balance: 0 });
      const reward = Math.floor(Math.random() * 100) + 50;
      balance.balance += reward;
      await balance.save();
      lastDaily.set(key, now);
      return interaction.reply({ embeds: [success(`You claimed **${reward} coins**! 💰\nNew balance: ${balance.balance}`)], ephemeral: false });
    } catch (err) {
      console.error(err);
      return interaction.reply({ embeds: [error('Failed to claim daily reward.')], ephemeral: true });
    }
  }
};
