const { SlashCommandBuilder } = require('discord.js');
const { build } = require('../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Show user information')
    .addUserOption(o => o.setName('user').setDescription('User to show info for').setRequired(false)),

  executeMessage: async (message, args) => {
    const user = message.mentions.users.first() || message.author;
    const member = await message.guild.members.fetch(user.id).catch(() => null);
    const embed = build({
      title: `User Info: ${user.username}`,
      thumbnail: user.displayAvatarURL(),
      color: 0x5865F2,
      fields: [
        { name: 'ID', value: user.id, inline: true },
        { name: 'Created', value: user.createdAt.toDateString(), inline: true },
        { name: 'Bot', value: user.bot ? 'Yes' : 'No', inline: true },
        member ? { name: 'Joined', value: member.joinedAt?.toDateString() || 'Unknown', inline: true } : null,
        member ? { name: 'Roles', value: member.roles.cache.map(r => r.name).join(', ') || 'None', inline: false } : null
      ].filter(Boolean)
    });
    return message.reply({ embeds: [embed] });
  },

  executeInteraction: async (interaction) => {
    const user = interaction.options.getUser('user') || interaction.user;
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    const embed = build({
      title: `User Info: ${user.username}`,
      thumbnail: user.displayAvatarURL(),
      color: 0x5865F2,
      fields: [
        { name: 'ID', value: user.id, inline: true },
        { name: 'Created', value: user.createdAt.toDateString(), inline: true },
        { name: 'Bot', value: user.bot ? 'Yes' : 'No', inline: true },
        member ? { name: 'Joined', value: member.joinedAt?.toDateString() || 'Unknown', inline: true } : null,
        member ? { name: 'Roles', value: member.roles.cache.map(r => r.name).join(', ') || 'None', inline: false } : null
      ].filter(Boolean)
    });
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
