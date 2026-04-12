const { SlashCommandBuilder } = require('discord.js');
const WordFilter = require('../models/WordFilter');
const PremiumGuild = require('../models/PremiumGuild');
const { success, error, info } = require('../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('filter')
    .setDescription('PREMIUM: Manage word filter')
    .addSubcommand(s => s.setName('add').setDescription('Add word to filter').addStringOption(o => o.setName('word').setDescription('Word to block').setRequired(true)))
    .addSubcommand(s => s.setName('remove').setDescription('Remove word from filter').addStringOption(o => o.setName('word').setDescription('Word to unblock').setRequired(true)))
    .addSubcommand(s => s.setName('toggle').setDescription('Enable/disable filter'))
    .addSubcommand(s => s.setName('action').setDescription('Set filter action (delete/warn/mute)').addStringOption(o => o.setName('action').setDescription('Action').addChoices({name: 'delete', value: 'delete'}, {name: 'warn', value: 'warn'}, {name: 'mute', value: 'mute'}).setRequired(true)))
    .addSubcommand(s => s.setName('show').setDescription('Show filtered words')),

  executeMessage: async (message, args) => {
    if (!message.member || !message.member.permissions.has('Administrator')) return message.reply({ embeds: [error('You need Administrator permission.')] });
    const isPremium = await PremiumGuild.findOne({ guildId: message.guild.id });
    if (!isPremium) return message.reply({ embeds: [error('This is a premium feature.')] });

    const sub = (args[0] || '').toLowerCase();
    const word = args[1];

    if (sub === 'add') {
      if (!word) return message.reply({ embeds: [error('Usage: !filter add <word>')] });
      try {
        let cfg = await WordFilter.findOne({ guildId: message.guild.id });
        if (!cfg) cfg = new WordFilter({ guildId: message.guild.id });
        if (cfg.words.includes(word.toLowerCase())) return message.reply({ embeds: [info('Word already in filter.')] });
        cfg.words.push(word.toLowerCase());
        await cfg.save();
        return message.reply({ embeds: [success(`Added "${word}" to filter`)] });
      } catch (err) {
        console.error(err);
        return message.reply({ embeds: [error('Failed to add word.')] });
      }
    }

    if (sub === 'show') {
      try {
        const cfg = await WordFilter.findOne({ guildId: message.guild.id });
        if (!cfg || !cfg.words.length) return message.reply({ embeds: [info('No filtered words.')] });
        return message.reply({ embeds: [info(cfg.words.join(', '), 'Filtered Words')] });
      } catch (err) {
        console.error(err);
        return message.reply({ embeds: [error('Failed to fetch filter.')] });
      }
    }

    return message.reply({ embeds: [info('Usage: !filter add|remove|toggle|action|show')] });
  },

  executeInteraction: async (interaction) => {
    if (!interaction.member || !interaction.member.permissions.has('Administrator')) return interaction.reply({ embeds: [error('You need Administrator permission.')], ephemeral: true });
    const isPremium = await PremiumGuild.findOne({ guildId: interaction.guild.id });
    if (!isPremium) return interaction.reply({ embeds: [error('This is a premium feature.')], ephemeral: true });

    const sub = interaction.options.getSubcommand();

    if (sub === 'add') {
      const word = interaction.options.getString('word');
      try {
        let cfg = await WordFilter.findOne({ guildId: interaction.guild.id });
        if (!cfg) cfg = new WordFilter({ guildId: interaction.guild.id });
        if (cfg.words.includes(word.toLowerCase())) return interaction.reply({ embeds: [info('Word already in filter.')], ephemeral: true });
        cfg.words.push(word.toLowerCase());
        await cfg.save();
        return interaction.reply({ embeds: [success(`Added "${word}" to filter`)], ephemeral: false });
      } catch (err) {
        console.error(err);
        return interaction.reply({ embeds: [error('Failed to add word.')], ephemeral: true });
      }
    }

    if (sub === 'remove') {
      const word = interaction.options.getString('word');
      try {
        const cfg = await WordFilter.findOne({ guildId: interaction.guild.id });
        if (!cfg) return interaction.reply({ embeds: [info('No filter config.')], ephemeral: true });
        cfg.words = cfg.words.filter(w => w !== word.toLowerCase());
        await cfg.save();
        return interaction.reply({ embeds: [success(`Removed "${word}" from filter`)], ephemeral: false });
      } catch (err) {
        console.error(err);
        return interaction.reply({ embeds: [error('Failed to remove word.')], ephemeral: true });
      }
    }

    if (sub === 'toggle') {
      try {
        let cfg = await WordFilter.findOne({ guildId: interaction.guild.id });
        if (!cfg) cfg = new WordFilter({ guildId: interaction.guild.id });
        cfg.enabled = !cfg.enabled;
        await cfg.save();
        return interaction.reply({ embeds: [success(`Filter ${cfg.enabled ? 'enabled' : 'disabled'}`)], ephemeral: false });
      } catch (err) {
        console.error(err);
        return interaction.reply({ embeds: [error('Failed to toggle filter.')], ephemeral: true });
      }
    }

    if (sub === 'action') {
      const action = interaction.options.getString('action');
      try {
        let cfg = await WordFilter.findOne({ guildId: interaction.guild.id });
        if (!cfg) cfg = new WordFilter({ guildId: interaction.guild.id });
        cfg.action = action;
        await cfg.save();
        return interaction.reply({ embeds: [success(`Filter action set to "${action}"`)], ephemeral: false });
      } catch (err) {
        console.error(err);
        return interaction.reply({ embeds: [error('Failed to set action.')], ephemeral: true });
      }
    }

    if (sub === 'show') {
      try {
        const cfg = await WordFilter.findOne({ guildId: interaction.guild.id });
        if (!cfg || !cfg.words.length) return interaction.reply({ embeds: [info('No filtered words.')], ephemeral: true });
        return interaction.reply({ embeds: [info(cfg.words.join(', '), 'Filtered Words')], ephemeral: true });
      } catch (err) {
        console.error(err);
        return interaction.reply({ embeds: [error('Failed to fetch filter.')], ephemeral: true });
      }
    }
  }
};
