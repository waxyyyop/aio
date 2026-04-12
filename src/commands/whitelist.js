const { SlashCommandBuilder } = require('discord.js');
const Embed = require('../lib/embed');
const AntinukeConfig = require('../models/AntinukeConfig');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('whitelist')
    .setDescription('Manage antinuke whitelist')
    .addSubcommand(sub =>
      sub.setName('add')
        .setDescription('Add user to antinuke whitelist')
        .addUserOption(opt => opt.setName('user').setDescription('User to whitelist').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('remove')
        .setDescription('Remove user from antinuke whitelist')
        .addUserOption(opt => opt.setName('user').setDescription('User to unwhitelist').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('view')
        .setDescription('View all whitelisted users')
    )
    .addSubcommand(sub =>
      sub.setName('reset')
        .setDescription('Clear all whitelisted users')
    ),

  async execute(interaction) {
    // Admin only
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({ embeds: [Embed.error('You need **Administrator** permission')] });
    }

    const subcommand = interaction.options.getSubcommand();
    let config = await AntinukeConfig.findOne({ guildId: interaction.guildId });

    if (!config) {
      config = new AntinukeConfig({ guildId: interaction.guildId, whitelist: [] });
    }

    if (subcommand === 'add') {
      const user = interaction.options.getUser('user');

      if (config.whitelist.includes(user.id)) {
        return interaction.reply({ embeds: [Embed.error(`${user.tag} is already whitelisted`)] });
      }

      config.whitelist.push(user.id);
      await config.save();

      return interaction.reply({ embeds: [Embed.success(`Added ${user.tag} to whitelist`)] });
    }

    if (subcommand === 'remove') {
      const user = interaction.options.getUser('user');

      if (!config.whitelist.includes(user.id)) {
        return interaction.reply({ embeds: [Embed.error(`${user.tag} is not whitelisted`)] });
      }

      config.whitelist = config.whitelist.filter(id => id !== user.id);
      await config.save();

      return interaction.reply({ embeds: [Embed.success(`Removed ${user.tag} from whitelist`)] });
    }

    if (subcommand === 'view') {
      if (config.whitelist.length === 0) {
        return interaction.reply({ embeds: [Embed.info('No whitelisted users')] });
      }

      const list = config.whitelist.map((id, i) => `${i + 1}. <@${id}>`).join('\n');

      const embed = Embed.info(list, 'Whitelisted Users')
        .addFields({
          name: 'Total',
          value: config.whitelist.length.toString(),
          inline: true
        });

      return interaction.reply({ embeds: [embed] });
    }

    if (subcommand === 'reset') {
      config.whitelist = [];
      await config.save();

      return interaction.reply({ embeds: [Embed.success('Whitelist cleared')] });
    }
  }
};
