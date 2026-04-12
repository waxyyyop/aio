const { SlashCommandBuilder } = require('discord.js');
const { build } = require('../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Show server information'),

  executeMessage: async (message) => {
    const guild = message.guild;
    const embed = build({
      title: `Server Info: ${guild.name}`,
      thumbnail: guild.iconURL(),
      color: 0x5865F2,
      fields: [
        { name: 'ID', value: guild.id, inline: true },
        { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
        { name: 'Members', value: guild.memberCount.toString(), inline: true },
        { name: 'Channels', value: guild.channels.cache.size.toString(), inline: true },
        { name: 'Roles', value: guild.roles.cache.size.toString(), inline: true },
        { name: 'Created', value: guild.createdAt.toDateString(), inline: true }
      ]
    });
    return message.reply({ embeds: [embed] });
  },

  executeInteraction: async (interaction) => {
    const guild = interaction.guild;
    const embed = build({
      title: `Server Info: ${guild.name}`,
      thumbnail: guild.iconURL(),
      color: 0x5865F2,
      fields: [
        { name: 'ID', value: guild.id, inline: true },
        { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
        { name: 'Members', value: guild.memberCount.toString(), inline: true },
        { name: 'Channels', value: guild.channels.cache.size.toString(), inline: true },
        { name: 'Roles', value: guild.roles.cache.size.toString(), inline: true },
        { name: 'Created', value: guild.createdAt.toDateString(), inline: true }
      ]
    });
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
