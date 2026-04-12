const { SlashCommandBuilder } = require('discord.js');
const Embed = require('../lib/embed');
const AntinukeConfig = require('../models/AntinukeConfig');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('extraowner')
    .setDescription('Manage extra owners for the guild')
    .addSubcommand(sub =>
      sub.setName('add')
        .setDescription('Add an extra owner')
        .addUserOption(opt => opt.setName('user').setDescription('User to add').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('remove')
        .setDescription('Remove an extra owner')
        .addUserOption(opt => opt.setName('user').setDescription('User to remove').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('view')
        .setDescription('View all extra owners')
    ),

  async execute(interaction) {
    // Admin only
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({ embeds: [Embed.error('You need **Administrator** permission')] });
    }

    const subcommand = interaction.options.getSubcommand();
    let config = await AntinukeConfig.findOne({ guildId: interaction.guildId });

    if (subcommand === 'add') {
      const user = interaction.options.getUser('user');

      if (!config) {
        config = new AntinukeConfig({ guildId: interaction.guildId, extraOwners: [user.id] });
      } else {
        if (config.extraOwners.includes(user.id)) {
          return interaction.reply({ embeds: [Embed.error(`${user.tag} is already an extra owner`)] });
        }
        config.extraOwners.push(user.id);
      }

      await config.save();
      return interaction.reply({ embeds: [Embed.success(`Added ${user.tag} as extra owner`)] });
    }

    if (subcommand === 'remove') {
      const user = interaction.options.getUser('user');

      if (!config || !config.extraOwners.includes(user.id)) {
        return interaction.reply({ embeds: [Embed.error(`${user.tag} is not an extra owner`)] });
      }

      config.extraOwners = config.extraOwners.filter(id => id !== user.id);
      await config.save();

      return interaction.reply({ embeds: [Embed.success(`Removed ${user.tag} from extra owners`)] });
    }

    if (subcommand === 'view') {
      if (!config || config.extraOwners.length === 0) {
        return interaction.reply({ embeds: [Embed.info('No extra owners set')] });
      }

      const ownerList = config.extraOwners.map((id, i) => `${i + 1}. <@${id}> (${id})`).join('\n');

      const embed = Embed.info(ownerList, 'Extra Owners')
        .addFields({
          name: 'Total',
          value: config.extraOwners.length.toString(),
          inline: true
        });

      return interaction.reply({ embeds: [embed] });
    }
  }
};
