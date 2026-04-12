const { SlashCommandBuilder } = require('discord.js');
const { info } = require('../lib/embed');
const { botName } = require('../assets/constants');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all available commands'),

  // message-based command: !help
  executeMessage: async (message) => {
    const client = message.client;
    const commands = Array.from(client.commands.values());
    const slashCmds = commands.filter(cmd => cmd.data && typeof cmd.data.toJSON === 'function').length;
    
    const fields = commands.map(cmd => ({
      name: `/${cmd.data.name || cmd.data.getName?.()}`,
      value: cmd.data.description || cmd.data.getDescription?.() || 'No description',
      inline: false
    }));

    const embed = info(`Use \`/\` or \`!\` prefix for commands`, `🤖 ${botName} - Help Menu`)
      .addFields(
        { name: '📊 Bot Overview', value: `Total Commands: **${commands.length}** | Slash: **${slashCmds}**`, inline: false },
        ...fields
      );
    return message.reply({ embeds: [embed] });
  },

  execute: async (interaction) => {
    const client = interaction.client;
    const commands = Array.from(client.commands.values());
    const slashCmds = commands.filter(cmd => cmd.data && typeof cmd.data.toJSON === 'function').length;
    
    // Split commands into pages (10 per page)
    const perPage = 10;
    const pages = [];
    
    for (let i = 0; i < commands.length; i += perPage) {
      pages.push(commands.slice(i, i + perPage));
    }

    if (pages.length === 0) pages.push([]);

    const fields = commands.map(cmd => ({
      name: `/${cmd.data.name || cmd.data.getName?.()}`,
      value: cmd.data.description || cmd.data.getDescription?.() || 'No description',
      inline: false
    }));

    const embed = info(`Use \`/\` or \`!\` prefix for commands. Total: **${commands.length}** commands`, `🤖 ${botName} - Help Menu`)
      .addFields(
        { name: '📊 Bot Overview', value: `Total Commands: **${commands.length}** | Slash: **${slashCmds}**`, inline: false },
        ...fields.slice(0, 20)  // Show first 20 on page 1
      );
    
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
