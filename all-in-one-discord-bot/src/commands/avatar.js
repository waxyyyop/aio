const { SlashCommandBuilder } = require('discord.js');
const { build } = require('../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Show a user\'s avatar')
    .addUserOption(o => o.setName('user').setDescription('User to show avatar for').setRequired(false)),

  executeMessage: async (message, args) => {
    const user = message.mentions.users.first() || message.author;
    const avatarUrl = user.displayAvatarURL({ size: 1024 });
    const embed = build({ title: `${user.username}'s Avatar`, image: avatarUrl, color: 0x5865F2 });
    return message.reply({ embeds: [embed] });
  },

  executeInteraction: async (interaction) => {
    const user = interaction.options.getUser('user') || interaction.user;
    const avatarUrl = user.displayAvatarURL({ size: 1024 });
    const embed = build({ title: `${user.username}'s Avatar`, image: avatarUrl, color: 0x5865F2 });
    return interaction.reply({ embeds: [embed], ephemeral: false });
  }
};
