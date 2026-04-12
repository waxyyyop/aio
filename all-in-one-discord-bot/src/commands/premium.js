const { SlashCommandBuilder } = require('discord.js');
const PremiumGuild = require('../models/PremiumGuild');
const BotConfig = require('../models/BotConfig');
const { success, error, info } = require('../lib/embed');

async function resolveImages() {
  const cfg = await BotConfig.findOne().lean().exec().catch(() => null);
  return {
    premiumAvatar: (cfg && cfg.premiumAvatar) || process.env.PREMIUM_AVATAR_URL,
    premiumBanner: (cfg && cfg.premiumBanner) || process.env.PREMIUM_BANNER_URL,
    defaultAvatar: (cfg && cfg.defaultAvatar) || process.env.DEFAULT_AVATAR_URL,
    defaultBanner: (cfg && cfg.defaultBanner) || process.env.DEFAULT_BANNER_URL
  };
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('premium')
    .setDescription('Manage premium status for this guild')
    .addSubcommand(s => s.setName('add').setDescription('Enable premium for this guild').addStringOption(o => o.setName('avatar').setDescription('One-shot avatar URL').setRequired(false)).addStringOption(o => o.setName('banner').setDescription('One-shot banner URL').setRequired(false)))
    .addSubcommand(s => s.setName('remove').setDescription('Remove premium from this guild'))
    .addSubcommand(s => s.setName('status').setDescription('Show premium status')),

  executeMessage: async (message, args) => {
    const sub = (args[0] || '').toLowerCase();
    const client = message.client;
    const isOwner = client.isOwner && client.isOwner(message.author.id);
    const isAdmin = message.member && message.member.permissions.has && message.member.permissions.has('Administrator');
    if (!isOwner && !isAdmin) return message.reply({ embeds: [error('You need to be the bot owner or a server administrator to manage premium.')] });

    if (sub === 'add') {
      try {
        const existing = await PremiumGuild.findOne({ guildId: message.guild.id });
        if (existing) return message.reply({ embeds: [info('This guild already has premium.')] });

        const avatarUrl = args[1] || null;
        const bannerUrl = args[2] || null;
        if (avatarUrl || bannerUrl) {
          const update = {};
          if (avatarUrl) update.premiumAvatar = avatarUrl;
          if (bannerUrl) update.premiumBanner = bannerUrl;
          update.updatedAt = new Date();
          await BotConfig.findOneAndUpdate({}, { $set: update }, { upsert: true });
        }

        const pg = new PremiumGuild({ guildId: message.guild.id, addedBy: message.author.id });
        await pg.save();

        if (client.user) {
          try {
            const imgs = await resolveImages();
            if (imgs.premiumAvatar) await client.user.setAvatar(imgs.premiumAvatar);
            if (imgs.premiumBanner && typeof client.user.setBanner === 'function') await client.user.setBanner(imgs.premiumBanner);
          } catch (err) {
            console.error('Failed to set premium avatar/banner:', err);
            return message.reply({ embeds: [success('Premium enabled for this guild, but failed to update bot avatar/banner.')] });
          }
        }

        return message.reply({ embeds: [success('Premium enabled for this guild.')] });
      } catch (err) {
        console.error(err);
        return message.reply({ embeds: [error('Failed to add premium.')] });
      }
    }

    if (sub === 'remove' || sub === 'revoke') {
      try {
        const res = await PremiumGuild.findOneAndDelete({ guildId: message.guild.id });
        if (!res) return message.reply({ embeds: [info('This guild does not have premium.')] });

        if (client.user) {
          try {
            const imgs = await resolveImages();
            if (imgs.defaultAvatar) await client.user.setAvatar(imgs.defaultAvatar);
            if (imgs.defaultBanner && typeof client.user.setBanner === 'function') await client.user.setBanner(imgs.defaultBanner);
          } catch (err) {
            console.error('Failed to revert avatar/banner:', err);
            return message.reply({ embeds: [success('Premium removed for this guild, but failed to revert bot avatar/banner.')] });
          }
        }

        return message.reply({ embeds: [success('Premium removed for this guild.')] });
      } catch (err) {
        console.error(err);
        return message.reply({ embeds: [error('Failed to remove premium.')] });
      }
    }

    if (sub === 'status' || !sub) {
      try {
        const existing = await PremiumGuild.findOne({ guildId: message.guild.id });
        if (!existing) return message.reply({ embeds: [info('This guild does not have premium.')] });
        return message.reply({ embeds: [info(`Premium active since ${existing.premiumSince.toUTCString()}`)] });
      } catch (err) {
        console.error(err);
        return message.reply({ embeds: [error('Failed to fetch premium status.')] });
      }
    }

    return message.reply({ embeds: [info('Usage: !premium add|remove|status')] });
  },

  executeInteraction: async (interaction) => {
    const sub = interaction.options.getSubcommand();
    const client = interaction.client;
    const isOwner = client.isOwner && client.isOwner(interaction.user.id);
    const isAdmin = interaction.member && interaction.member.permissions && interaction.member.permissions.has('Administrator');
    if (!isOwner && !isAdmin) return interaction.reply({ embeds: [error('You need to be the bot owner or a server administrator to manage premium.')], ephemeral: true });

    if (sub === 'add') {
      try {
        const existing = await PremiumGuild.findOne({ guildId: interaction.guildId });
        if (existing) return interaction.reply({ embeds: [info('This guild already has premium.')], ephemeral: true });

        const avatar = interaction.options.getString('avatar');
        const banner = interaction.options.getString('banner');
        if (avatar || banner) {
          const update = {};
          if (avatar) update.premiumAvatar = avatar;
          if (banner) update.premiumBanner = banner;
          update.updatedAt = new Date();
          await BotConfig.findOneAndUpdate({}, { $set: update }, { upsert: true });
        }

        const pg = new PremiumGuild({ guildId: interaction.guildId, addedBy: interaction.user.id });
        await pg.save();

        if (client.user) {
          try {
            const imgs = await resolveImages();
            if (imgs.premiumAvatar) await client.user.setAvatar(imgs.premiumAvatar);
            if (imgs.premiumBanner && typeof client.user.setBanner === 'function') await client.user.setBanner(imgs.premiumBanner);
          } catch (err) {
            console.error('Failed to set premium avatar/banner:', err);
            return interaction.reply({ embeds: [success('Premium enabled, but failed to update bot avatar/banner.')], ephemeral: false });
          }
        }

        return interaction.reply({ embeds: [success('Premium enabled for this guild.')], ephemeral: false });
      } catch (err) {
        console.error(err);
        return interaction.reply({ embeds: [error('Failed to add premium.')], ephemeral: true });
      }
    }

    if (sub === 'remove') {
      try {
        const res = await PremiumGuild.findOneAndDelete({ guildId: interaction.guildId });
        if (!res) return interaction.reply({ embeds: [info('This guild does not have premium.')], ephemeral: true });

        if (client.user) {
          try {
            const imgs = await resolveImages();
            if (imgs.defaultAvatar) await client.user.setAvatar(imgs.defaultAvatar);
            if (imgs.defaultBanner && typeof client.user.setBanner === 'function') await client.user.setBanner(imgs.defaultBanner);
          } catch (err) {
            console.error('Failed to revert avatar/banner:', err);
            return interaction.reply({ embeds: [success('Premium removed, but failed to revert bot avatar/banner.')], ephemeral: false });
          }
        }

        return interaction.reply({ embeds: [success('Premium removed for this guild.')], ephemeral: false });
      } catch (err) {
        console.error(err);
        return interaction.reply({ embeds: [error('Failed to remove premium.')], ephemeral: true });
      }
    }

    if (sub === 'status') {
      try {
        const existing = await PremiumGuild.findOne({ guildId: interaction.guildId });
        if (!existing) return interaction.reply({ embeds: [info('This guild does not have premium.')], ephemeral: true });
        return interaction.reply({ embeds: [info(`Premium active since ${existing.premiumSince.toUTCString()}`)], ephemeral: true });
      } catch (err) {
        console.error(err);
        return interaction.reply({ embeds: [error('Failed to fetch premium status.')], ephemeral: true });
      }
    }
  }
};
