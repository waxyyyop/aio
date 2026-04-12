const { SlashCommandBuilder } = require('discord.js');
const AntinukeConfig = require('../models/AntinukeConfig');
const { success, error, info } = require('../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('antinuke')
    .setDescription('Manage antinuke protection')
    .addSubcommand(s => s.setName('enable').setDescription('Enable antinuke protection'))
    .addSubcommand(s => s.setName('disable').setDescription('Disable antinuke protection'))
    .addSubcommand(s => s.setName('config').setDescription('Configure antinuke settings')
      .addNumberOption(o => o.setName('delete_channel_threshold').setDescription('Channels deleted to trigger action (default 5)').setRequired(false))
      .addNumberOption(o => o.setName('delete_role_threshold').setDescription('Roles deleted to trigger action (default 5)').setRequired(false))
      .addNumberOption(o => o.setName('raid_threshold').setDescription('Users joining in 1 min to trigger action (default 10)').setRequired(false))
      .addStringOption(o => o.setName('action').setDescription('Action to take').addChoices({name: 'warn', value: 'warn'}, {name: 'kick', value: 'kick'}, {name: 'ban', value: 'ban'}).setRequired(false))
      .addChannelOption(o => o.setName('log_channel').setDescription('Channel to log antinuke events').setRequired(false)))
    .addSubcommand(s => s.setName('whitelist').setDescription('Manage whitelist')
      .addStringOption(o => o.setName('action').setDescription('add or remove').addChoices({name: 'add', value: 'add'}, {name: 'remove', value: 'remove'}).setRequired(true))
      .addUserOption(o => o.setName('user').setDescription('User to add/remove').setRequired(true)))
    .addSubcommand(s => s.setName('show').setDescription('Show current antinuke config')),

  executeMessage: async (message, args) => {
    if (!message.member || !message.member.permissions.has('Administrator')) return message.reply({ embeds: [error('You need Administrator permission.')] });
    const sub = (args[0] || '').toLowerCase();
    const client = message.client;

    if (sub === 'enable') {
      try {
        let cfg = await AntinukeConfig.findOne({ guildId: message.guild.id });
        if (!cfg) cfg = new AntinukeConfig({ guildId: message.guild.id });
        cfg.enabled = true;
        await cfg.save();
        return message.reply({ embeds: [success('Antinuke protection enabled.')] });
      } catch (err) {
        console.error(err);
        return message.reply({ embeds: [error('Failed to enable antinuke.')] });
      }
    }

    if (sub === 'disable') {
      try {
        let cfg = await AntinukeConfig.findOne({ guildId: message.guild.id });
        if (!cfg) return message.reply({ embeds: [info('Antinuke already disabled.')] });
        cfg.enabled = false;
        await cfg.save();
        return message.reply({ embeds: [success('Antinuke protection disabled.')] });
      } catch (err) {
        console.error(err);
        return message.reply({ embeds: [error('Failed to disable antinuke.')] });
      }
    }

    if (sub === 'show') {
      try {
        const cfg = await AntinukeConfig.findOne({ guildId: message.guild.id });
        if (!cfg) return message.reply({ embeds: [info('No antinuke config. Run `!antinuke enable`.')] });
        const embed = info('', 'Antinuke Config').addFields([
          { name: 'Enabled', value: cfg.enabled ? 'Yes' : 'No', inline: true },
          { name: 'Channel Delete Threshold', value: cfg.deleteChannelThreshold.toString(), inline: true },
          { name: 'Role Delete Threshold', value: cfg.deleteRoleThreshold.toString(), inline: true },
          { name: 'Raid Threshold', value: cfg.raidThreshold.toString(), inline: true },
          { name: 'Action', value: cfg.action, inline: true },
          { name: 'Whitelisted', value: cfg.whitelist.length.toString(), inline: true }
        ]);
        return message.reply({ embeds: [embed] });
      } catch (err) {
        console.error(err);
        return message.reply({ embeds: [error('Failed to fetch antinuke config.')] });
      }
    }

    return message.reply({ embeds: [info('Usage: !antinuke enable|disable|show|config|whitelist')] });
  },

  executeInteraction: async (interaction) => {
    if (!interaction.member || !interaction.member.permissions.has('Administrator')) return interaction.reply({ embeds: [error('You need Administrator permission.')], ephemeral: true });
    const sub = interaction.options.getSubcommand();

    if (sub === 'enable') {
      try {
        let cfg = await AntinukeConfig.findOne({ guildId: interaction.guild.id });
        if (!cfg) cfg = new AntinukeConfig({ guildId: interaction.guild.id });
        cfg.enabled = true;
        await cfg.save();
        return interaction.reply({ embeds: [success('Antinuke protection enabled.')], ephemeral: false });
      } catch (err) {
        console.error(err);
        return interaction.reply({ embeds: [error('Failed to enable antinuke.')], ephemeral: true });
      }
    }

    if (sub === 'disable') {
      try {
        let cfg = await AntinukeConfig.findOne({ guildId: interaction.guild.id });
        if (!cfg) return interaction.reply({ embeds: [info('Antinuke already disabled.')], ephemeral: true });
        cfg.enabled = false;
        await cfg.save();
        return interaction.reply({ embeds: [success('Antinuke protection disabled.')], ephemeral: false });
      } catch (err) {
        console.error(err);
        return interaction.reply({ embeds: [error('Failed to disable antinuke.')], ephemeral: true });
      }
    }

    if (sub === 'config') {
      try {
        let cfg = await AntinukeConfig.findOne({ guildId: interaction.guild.id });
        if (!cfg) cfg = new AntinukeConfig({ guildId: interaction.guild.id });
        
        const chanThresh = interaction.options.getNumber('delete_channel_threshold');
        const roleThresh = interaction.options.getNumber('delete_role_threshold');
        const raidThresh = interaction.options.getNumber('raid_threshold');
        const action = interaction.options.getString('action');
        const logCh = interaction.options.getChannel('log_channel');

        if (chanThresh) cfg.deleteChannelThreshold = chanThresh;
        if (roleThresh) cfg.deleteRoleThreshold = roleThresh;
        if (raidThresh) cfg.raidThreshold = raidThresh;
        if (action) cfg.action = action;
        if (logCh) cfg.logs = logCh.id;

        await cfg.save();
        return interaction.reply({ embeds: [success('Antinuke config updated.')], ephemeral: false });
      } catch (err) {
        console.error(err);
        return interaction.reply({ embeds: [error('Failed to update config.')], ephemeral: true });
      }
    }

    if (sub === 'whitelist') {
      try {
        const action = interaction.options.getString('action');
        const user = interaction.options.getUser('user');
        let cfg = await AntinukeConfig.findOne({ guildId: interaction.guild.id });
        if (!cfg) cfg = new AntinukeConfig({ guildId: interaction.guild.id });

        if (action === 'add') {
          if (cfg.whitelist.includes(user.id)) return interaction.reply({ embeds: [info('User already whitelisted.')], ephemeral: true });
          cfg.whitelist.push(user.id);
          await cfg.save();
          return interaction.reply({ embeds: [success(`Whitelisted ${user.tag}`)], ephemeral: false });
        }

        if (action === 'remove') {
          cfg.whitelist = cfg.whitelist.filter(id => id !== user.id);
          await cfg.save();
          return interaction.reply({ embeds: [success(`Removed ${user.tag} from whitelist`)], ephemeral: false });
        }
      } catch (err) {
        console.error(err);
        return interaction.reply({ embeds: [error('Failed to update whitelist.')], ephemeral: true });
      }
    }

    if (sub === 'show') {
      try {
        const cfg = await AntinukeConfig.findOne({ guildId: interaction.guild.id });
        if (!cfg) return interaction.reply({ embeds: [info('No antinuke config. Run `/antinuke enable`.')], ephemeral: true });
        const embed = info('', 'Antinuke Config').addFields([
          { name: 'Enabled', value: cfg.enabled ? 'Yes' : 'No', inline: true },
          { name: 'Channel Delete Threshold', value: cfg.deleteChannelThreshold.toString(), inline: true },
          { name: 'Role Delete Threshold', value: cfg.deleteRoleThreshold.toString(), inline: true },
          { name: 'Raid Threshold', value: cfg.raidThreshold.toString(), inline: true },
          { name: 'Action', value: cfg.action, inline: true },
          { name: 'Whitelisted', value: cfg.whitelist.length.toString(), inline: true }
        ]);
        return interaction.reply({ embeds: [embed], ephemeral: true });
      } catch (err) {
        console.error(err);
        return interaction.reply({ embeds: [error('Failed to fetch config.')], ephemeral: true });
      }
    }
  }
};
