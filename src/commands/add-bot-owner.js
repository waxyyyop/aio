const { SlashCommandBuilder } = require('discord.js');
const PremiumGuild = require('../models/PremiumGuild');
const { success, error, info } = require('../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add-bot-owner')
    .setDescription('Grant premium + no-prefix mode to a guild (OWNER ONLY)')
    .addStringOption(o => o.setName('guild_id').setDescription('Guild ID to grant premium').setRequired(true)),

  executeMessage: async (message, args) => {
    const client = message.client;
    const isOwner = client.isOwner && client.isOwner(message.author.id);
    if (!isOwner) return message.reply({ embeds: [error('Only the bot owner can use this command.', 'Access Denied')] });

    const guildId = args[0];
    if (!guildId) return message.reply({ embeds: [error('Usage: !add-bot-owner <guild_id>')] });

    try {
      const existing = await PremiumGuild.findOne({ guildId });
      if (existing) {
        existing.noPrefix = true;
        await existing.save();
        return message.reply({ embeds: [success(`Guild \`${guildId}\` already premium. Enabled no-prefix mode.`)] });
      }

      const pg = new PremiumGuild({ guildId, addedBy: message.author.id, noPrefix: true });
      await pg.save();
      return message.reply({ embeds: [success(`Granted premium + no-prefix to guild \`${guildId}\`.`)] });
    } catch (err) {
      console.error(err);
      return message.reply({ embeds: [error('Failed to grant premium.')] });
    }
  },

  executeInteraction: async (interaction) => {
    const client = interaction.client;
    const isOwner = client.isOwner && client.isOwner(interaction.user.id);
    if (!isOwner) return interaction.reply({ embeds: [error('Only the bot owner can use this command.', 'Access Denied')], ephemeral: true });

    const guildId = interaction.options.getString('guild_id');

    try {
      const existing = await PremiumGuild.findOne({ guildId });
      if (existing) {
        existing.noPrefix = true;
        await existing.save();
        return interaction.reply({ embeds: [success(`Guild \`${guildId}\` already premium. Enabled no-prefix mode.`)], ephemeral: false });
      }

      const pg = new PremiumGuild({ guildId, addedBy: interaction.user.id, noPrefix: true });
      await pg.save();
      return interaction.reply({ embeds: [success(`Granted premium + no-prefix to guild \`${guildId}\`.`)], ephemeral: false });
    } catch (err) {
      console.error(err);
      return interaction.reply({ embeds: [error('Failed to grant premium.')], ephemeral: true });
    }
  }
};
