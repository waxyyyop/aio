const { SlashCommandBuilder } = require('discord.js');
const WelcomeMessage = require('../models/WelcomeMessage');
const PremiumGuild = require('../models/PremiumGuild');
const { success, error, info } = require('../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('PREMIUM: Configure welcome messages')
    .addSubcommand(s => s.setName('set').setDescription('Set welcome message').addChannelOption(o => o.setName('channel').setDescription('Welcome channel').setRequired(true)).addStringOption(o => o.setName('message').setDescription('Welcome text (use {user} for name, {guild} for server name)').setRequired(true)))
    .addSubcommand(s => s.setName('toggle').setDescription('Enable/disable welcome messages'))
    .addSubcommand(s => s.setName('show').setDescription('Show current welcome config')),

  executeMessage: async (message, args) => {
    if (!message.member || !message.member.permissions.has('Administrator')) return message.reply({ embeds: [error('You need Administrator permission.')] });
    const isPremium = await PremiumGuild.findOne({ guildId: message.guild.id });
    if (!isPremium) return message.reply({ embeds: [error('This is a premium feature. Get premium with !premium add')] });

    const sub = (args[0] || '').toLowerCase();
    
    if (sub === 'show') {
      const cfg = await WelcomeMessage.findOne({ guildId: message.guild.id });
      if (!cfg) return message.reply({ embeds: [info('No welcome config set.')] });
      const embed = info(`Channel: <#${cfg.channelId}>\n\`\`\`${cfg.message}\`\`\``, 'Welcome Config').addFields([{ name: 'Enabled', value: cfg.enabled ? 'Yes' : 'No', inline: true }]);
      return message.reply({ embeds: [embed] });
    }

    return message.reply({ embeds: [info('Usage: !welcome set|toggle|show')] });
  },

  executeInteraction: async (interaction) => {
    if (!interaction.member || !interaction.member.permissions.has('Administrator')) return interaction.reply({ embeds: [error('You need Administrator permission.')], ephemeral: true });
    const isPremium = await PremiumGuild.findOne({ guildId: interaction.guild.id });
    if (!isPremium) return interaction.reply({ embeds: [error('This is a premium feature. Get premium with /premium add')], ephemeral: true });

    const sub = interaction.options.getSubcommand();

    if (sub === 'set') {
      const channel = interaction.options.getChannel('channel');
      const message = interaction.options.getString('message');
      try {
        let cfg = await WelcomeMessage.findOne({ guildId: interaction.guild.id });
        if (!cfg) cfg = new WelcomeMessage({ guildId: interaction.guild.id });
        cfg.message = message;
        cfg.channelId = channel.id;
        cfg.enabled = true;
        await cfg.save();
        return interaction.reply({ embeds: [success('Welcome message set!')], ephemeral: false });
      } catch (err) {
        console.error(err);
        return interaction.reply({ embeds: [error('Failed to set welcome message.')], ephemeral: true });
      }
    }

    if (sub === 'toggle') {
      try {
        let cfg = await WelcomeMessage.findOne({ guildId: interaction.guild.id });
        if (!cfg) return interaction.reply({ embeds: [error('No welcome config found. Use /welcome set first.')], ephemeral: true });
        cfg.enabled = !cfg.enabled;
        await cfg.save();
        return interaction.reply({ embeds: [success(`Welcome messages ${cfg.enabled ? 'enabled' : 'disabled'}`)], ephemeral: false });
      } catch (err) {
        console.error(err);
        return interaction.reply({ embeds: [error('Failed to toggle welcome.')], ephemeral: true });
      }
    }

    if (sub === 'show') {
      try {
        const cfg = await WelcomeMessage.findOne({ guildId: interaction.guild.id });
        if (!cfg) return interaction.reply({ embeds: [info('No welcome config set.')], ephemeral: true });
        const embed = info(`Channel: <#${cfg.channelId}>\n\`\`\`${cfg.message}\`\`\``, 'Welcome Config').addFields([{ name: 'Enabled', value: cfg.enabled ? 'Yes' : 'No', inline: true }]);
        return interaction.reply({ embeds: [embed], ephemeral: true });
      } catch (err) {
        console.error(err);
        return interaction.reply({ embeds: [error('Failed to fetch welcome config.')], ephemeral: true });
      }
    }
  }
};
