const { SlashCommandBuilder } = require('discord.js');
const Embed = require('../lib/embed');
const musicManager = require('../lib/musicManager');
const LavaliinkNode = require('../models/LavaliinkNode');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nodes')
    .setDescription('Manage Lavalink nodes')
    .addSubcommand(sub =>
      sub.setName('list')
        .setDescription('List all Lavalink nodes')
    )
    .addSubcommand(sub =>
      sub.setName('add')
        .setDescription('Add a new Lavalink node')
        .addStringOption(opt => opt.setName('name').setDescription('Node name').setRequired(true))
        .addStringOption(opt => opt.setName('host').setDescription('Host/IP').setRequired(true))
        .addNumberOption(opt => opt.setName('port').setDescription('Port number').setRequired(true))
        .addStringOption(opt => opt.setName('password').setDescription('Node password').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('remove')
        .setDescription('Remove a Lavalink node')
        .addStringOption(opt => opt.setName('name').setDescription('Node name').setRequired(true).setAutocomplete(true))
    )
    .addSubcommand(sub =>
      sub.setName('check')
        .setDescription('Check all node status')
    ),

  async execute(interaction) {
    // Owner-only check
    if (interaction.user.id !== process.env.OWNER) {
      return interaction.reply({ embeds: [Embed.error('You must be the bot owner')] });
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'list') {
      const nodes = musicManager.nodes;
      
      if (nodes.length === 0) {
        return interaction.reply({ embeds: [Embed.info('No nodes configured')] });
      }

      const list = nodes.map(n => 
        `• **${n.name}** (${n.status})\n  ${n.host}:${n.port} | Priority: ${n.priority}`
      ).join('\n');

      const embed = Embed.success('Lavalink Nodes')
        .setDescription(list)
        .addFields({ name: 'Active Nodes', value: nodes.filter(n => n.status === 'online').length.toString() });

      return interaction.reply({ embeds: [embed] });
    }

    if (subcommand === 'add') {
      const name = interaction.options.getString('name');
      const host = interaction.options.getString('host');
      const port = interaction.options.getNumber('port');
      const password = interaction.options.getString('password');

      try {
        const node = new LavaliinkNode({ name, host, port, password });
        await node.save();
        musicManager.nodes.push({ name, host, port, password, status: 'offline', priority: 0, id: node._id });

        const embed = Embed.success('Node Added')
          .addFields(
            { name: 'Name', value: name, inline: true },
            { name: 'Address', value: `${host}:${port}`, inline: true },
            { name: 'Status', value: 'offline (checking...)', inline: true }
          );

        // Check health
        setTimeout(() => musicManager.checkAllNodes(), 1000);

        return interaction.reply({ embeds: [embed] });
      } catch (err) {
        return interaction.reply({ embeds: [Embed.error('Failed to add node: ' + err.message)] });
      }
    }

    if (subcommand === 'remove') {
      const name = interaction.options.getString('name');

      try {
        await LavaliinkNode.findOneAndDelete({ name });
        musicManager.nodes = musicManager.nodes.filter(n => n.name !== name);

        const embed = Embed.success('Node Removed')
          .setDescription(`Removed node: **${name}**`);

        return interaction.reply({ embeds: [embed] });
      } catch (err) {
        return interaction.reply({ embeds: [Embed.error('Failed to remove node: ' + err.message)] });
      }
    }

    if (subcommand === 'check') {
      await interaction.deferReply();
      await musicManager.checkAllNodes();

      const nodes = musicManager.nodes;
      const online = nodes.filter(n => n.status === 'online').length;
      const list = nodes.map(n => 
        `${n.status === 'online' ? '✅' : '❌'} ${n.name}`
      ).join('\n');

      const embed = Embed.success('Node Status Check')
        .setDescription(list)
        .addFields(
          { name: 'Online', value: online + '/' + nodes.length, inline: true }
        );

      return interaction.editReply({ embeds: [embed] });
    }
  }
};
