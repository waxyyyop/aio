const { SlashCommandBuilder } = require('discord.js');
const BotConfig = require('../models/BotConfig');
const { success, error, info } = require('../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setimages')
    .setDescription('Manage premium/default avatar and banner URLs')
    .addSubcommand(s => s.setName('show').setDescription('Show current image config'))
    .addSubcommand(s => s.setName('set').setDescription('Set an image URL').addStringOption(o => o.setName('scope').setDescription('premium or default').addChoices({name: 'premium', value: 'premium'}, {name: 'default', value: 'default'}).setRequired(true)).addStringOption(o => o.setName('type').setDescription('avatar or banner').addChoices({name: 'avatar', value: 'avatar'}, {name: 'banner', value: 'banner'}).setRequired(true)).addStringOption(o => o.setName('url').setDescription('Image URL').setRequired(true)))
    .addSubcommand(s => s.setName('clear').setDescription('Clear an image URL').addStringOption(o => o.setName('scope').setDescription('premium or default').addChoices({name: 'premium', value: 'premium'}, {name: 'default', value: 'default'}).setRequired(true)).addStringOption(o => o.setName('type').setDescription('avatar or banner').addChoices({name: 'avatar', value: 'avatar'}, {name: 'banner', value: 'banner'}).setRequired(true))),

  executeMessage: async (message, args) => {
    const client = message.client;
    const isOwner = client.isOwner && client.isOwner(message.author.id);
    const isAdmin = message.member && message.member.permissions.has && message.member.permissions.has('Administrator');
    if (!isOwner && !isAdmin) return message.reply({ embeds: [error('You need to be the bot owner or a server administrator to use this command.')] });

    const sub = (args[0] || '').toLowerCase();
    if (sub === 'show' || !sub) {
      const cfg = await BotConfig.findOne().lean().exec().catch(() => null);
      const embed = info('', 'Image Config').addFields([
        { name: 'Premium Avatar', value: cfg?.premiumAvatar || process.env.PREMIUM_AVATAR_URL || 'none', inline: true },
        { name: 'Premium Banner', value: cfg?.premiumBanner || process.env.PREMIUM_BANNER_URL || 'none', inline: true },
        { name: 'Default Avatar', value: cfg?.defaultAvatar || process.env.DEFAULT_AVATAR_URL || 'none', inline: true },
        { name: 'Default Banner', value: cfg?.defaultBanner || process.env.DEFAULT_BANNER_URL || 'none', inline: true }
      ]);
      return message.reply({ embeds: [embed] });
    }

    if (sub === 'set') {
      const scope = (args[1] || '').toLowerCase();
      const type = (args[2] || '').toLowerCase();
      const url = args.slice(3).join(' ');
      if (!['premium', 'default'].includes(scope) || !['avatar', 'banner'].includes(type) || !url) {
        return message.reply({ embeds: [error('Usage: !setimages set <premium|default> <avatar|banner> <url>')] });
      }

      const update = {};
      update[`${scope}${type.charAt(0).toUpperCase() + type.slice(1)}`] = url;
      update.updatedAt = new Date();

      try {
        await BotConfig.findOneAndUpdate({}, { $set: update }, { upsert: true, new: true });
        return message.reply({ embeds: [success(`Updated ${scope} ${type}`)] });
      } catch (err) {
        console.error(err);
        return message.reply({ embeds: [error('Failed to update images config.')] });
      }
    }

    if (sub === 'clear') {
      const scope = (args[1] || '').toLowerCase();
      const type = (args[2] || '').toLowerCase();
      if (!['premium', 'default'].includes(scope) || !['avatar', 'banner'].includes(type)) {
        return message.reply({ embeds: [error('Usage: !setimages clear <premium|default> <avatar|banner>')] });
      }
      const update = {};
      update[`${scope}${type.charAt(0).toUpperCase() + type.slice(1)}`] = null;
      update.updatedAt = new Date();
      try {
        await BotConfig.findOneAndUpdate({}, { $set: update }, { upsert: true, new: true });
        return message.reply({ embeds: [success(`Cleared ${scope} ${type}`)] });
      } catch (err) {
        console.error(err);
        return message.reply({ embeds: [error('Failed to clear images config.')] });
      }
    }

    return message.reply({ embeds: [info('Usage: !setimages show|set|clear')] });
  },

  executeInteraction: async (interaction) => {
    const client = interaction.client;
    const isOwner = client.isOwner && client.isOwner(interaction.user.id);
    const isAdmin = interaction.member && interaction.member.permissions && interaction.member.permissions.has('Administrator');
    if (!isOwner && !isAdmin) return interaction.reply({ embeds: [error('You need to be the bot owner or a server administrator to use this command.')], ephemeral: true });

    const sub = interaction.options.getSubcommand();
    if (sub === 'show') {
      const cfg = await BotConfig.findOne().lean().exec().catch(() => null);
      const embed = info('', 'Image Config').addFields([
        { name: 'Premium Avatar', value: cfg?.premiumAvatar || process.env.PREMIUM_AVATAR_URL || 'none', inline: true },
        { name: 'Premium Banner', value: cfg?.premiumBanner || process.env.PREMIUM_BANNER_URL || 'none', inline: true },
        { name: 'Default Avatar', value: cfg?.defaultAvatar || process.env.DEFAULT_AVATAR_URL || 'none', inline: true },
        { name: 'Default Banner', value: cfg?.defaultBanner || process.env.DEFAULT_BANNER_URL || 'none', inline: true }
      ]);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (sub === 'set') {
      const scope = interaction.options.getString('scope');
      const type = interaction.options.getString('type');
      const url = interaction.options.getString('url');
      const update = {};
      update[`${scope}${type.charAt(0).toUpperCase() + type.slice(1)}`] = url;
      update.updatedAt = new Date();
      try {
        await BotConfig.findOneAndUpdate({}, { $set: update }, { upsert: true, new: true });
        return interaction.reply({ embeds: [success(`Updated ${scope} ${type}`)], ephemeral: false });
      } catch (err) {
        console.error(err);
        return interaction.reply({ embeds: [error('Failed to update images config.')], ephemeral: true });
      }
    }

    if (sub === 'clear') {
      const scope = interaction.options.getString('scope');
      const type = interaction.options.getString('type');
      const update = {};
      update[`${scope}${type.charAt(0).toUpperCase() + type.slice(1)}`] = null;
      update.updatedAt = new Date();
      try {
        await BotConfig.findOneAndUpdate({}, { $set: update }, { upsert: true, new: true });
        return interaction.reply({ embeds: [success(`Cleared ${scope} ${type}`)], ephemeral: false });
      } catch (err) {
        console.error(err);
        return interaction.reply({ embeds: [error('Failed to clear images config.')], ephemeral: true });
      }
    }
  }
};
