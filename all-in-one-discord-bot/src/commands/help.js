const { SlashCommandBuilder } = require('discord.js');
const { info } = require('../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all available commands'),

  // message-based command: !help
  executeMessage: async (message) => {
    const client = message.client;
    const commands = Array.from(client.commands.values());
    
    const fields = commands.map(cmd => ({
      name: `/${cmd.data.name || cmd.data.getName?.()}`,
      value: cmd.data.description || cmd.data.getDescription?.() || 'No description',
      inline: false
    }));

    const embed = info(`View all available commands below`, `📚 Help`).addFields(fields);
    return message.reply({ embeds: [embed] });
  },

  executeInteraction: async (interaction) => {
    const client = interaction.client;
    const commands = Array.from(client.commands.values());
    
    const fields = commands.map(cmd => ({
      name: `/${cmd.data.name || cmd.data.getName?.()}`,
      value: cmd.data.description || cmd.data.getDescription?.() || 'No description',
      inline: false
    }));

    const embed = info(`View all available commands below`, `📚 Help`).addFields(fields);
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
