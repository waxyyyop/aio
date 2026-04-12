const { SlashCommandBuilder } = require('discord.js');
const ReactionRole = require('../models/ReactionRole');
const PremiumGuild = require('../models/PremiumGuild');
const { success, error, info } = require('../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reactionrole')
    .setDescription('PREMIUM: Set up reaction roles')
    .addSubcommand(s => s.setName('add').setDescription('Add reaction role').addStringOption(o => o.setName('message_id').setDescription('Message ID').setRequired(true)).addStringOption(o => o.setName('emoji').setDescription('Emoji (name or unicode)').setRequired(true)).addRoleOption(o => o.setName('role').setDescription('Role to assign').setRequired(true)))
    .addSubcommand(s => s.setName('remove').setDescription('Remove reaction role').addStringOption(o => o.setName('message_id').setDescription('Message ID').setRequired(true)).addStringOption(o => o.setName('emoji').setDescription('Emoji').setRequired(true)))
    .addSubcommand(s => s.setName('list').setDescription('List all reaction roles')),

  executeMessage: async (message, args) => {
    if (!message.member || !message.member.permissions.has('ManageRoles')) return message.reply({ embeds: [error('You need Manage Roles permission.')] });
    const isPremium = await PremiumGuild.findOne({ guildId: message.guild.id });
    if (!isPremium) return message.reply({ embeds: [error('This is a premium feature.')] });

    const sub = (args[0] || '').toLowerCase();
    
    if (sub === 'list') {
      try {
        const roles = await ReactionRole.find({ guildId: message.guild.id });
        if (!roles.length) return message.reply({ embeds: [info('No reaction roles set.')] });
        const list = roles.map(r => `Message: ${r.messageId} | Emoji: ${r.emoji} | Role: <@&${r.roleId}>`).join('\n');
        return message.reply({ embeds: [info(list, 'Reaction Roles')] });
      } catch (err) {
        console.error(err);
        return message.reply({ embeds: [error('Failed to fetch reaction roles.')] });
      }
    }

    return message.reply({ embeds: [info('Usage: !reactionrole add|remove|list')] });
  },

  executeInteraction: async (interaction) => {
    if (!interaction.member || !interaction.member.permissions.has('ManageRoles')) return interaction.reply({ embeds: [error('You need Manage Roles permission.')], ephemeral: true });
    const isPremium = await PremiumGuild.findOne({ guildId: interaction.guild.id });
    if (!isPremium) return interaction.reply({ embeds: [error('This is a premium feature.')], ephemeral: true });

    const sub = interaction.options.getSubcommand();

    if (sub === 'add') {
      const messageId = interaction.options.getString('message_id');
      const emoji = interaction.options.getString('emoji');
      const role = interaction.options.getRole('role');
      try {
        const rr = new ReactionRole({
          guildId: interaction.guild.id,
          messageId,
          emoji,
          roleId: role.id,
          channelId: interaction.channel.id
        });
        await rr.save();
        return interaction.reply({ embeds: [success(`Added reaction role: ${emoji} → ${role.name}`)], ephemeral: false });
      } catch (err) {
        console.error(err);
        return interaction.reply({ embeds: [error('Failed to add reaction role (already exists?).')], ephemeral: true });
      }
    }

    if (sub === 'remove') {
      const messageId = interaction.options.getString('message_id');
      const emoji = interaction.options.getString('emoji');
      try {
        const result = await ReactionRole.findOneAndDelete({ guildId: interaction.guild.id, messageId, emoji });
        if (!result) return interaction.reply({ embeds: [error('Reaction role not found.')], ephemeral: true });
        return interaction.reply({ embeds: [success('Reaction role removed.')], ephemeral: false });
      } catch (err) {
        console.error(err);
        return interaction.reply({ embeds: [error('Failed to remove reaction role.')], ephemeral: true });
      }
    }

    if (sub === 'list') {
      try {
        const roles = await ReactionRole.find({ guildId: interaction.guild.id });
        if (!roles.length) return interaction.reply({ embeds: [info('No reaction roles set.')], ephemeral: true });
        const list = roles.map(r => `Message: ${r.messageId} | Emoji: ${r.emoji} | Role: <@&${r.roleId}>`).join('\n');
        return interaction.reply({ embeds: [info(list, 'Reaction Roles')], ephemeral: true });
      } catch (err) {
        console.error(err);
        return interaction.reply({ embeds: [error('Failed to fetch reaction roles.')], ephemeral: true });
      }
    }
  }
};
