module.exports = {
  data: { name: 'ping', description: 'Replies with Pong!' },
  executeInteraction: async (interaction) => {
    await interaction.reply(`Pong! ${Date.now() - interaction.createdTimestamp}ms`);
  },
  executeMessage: async (message) => {
    await message.reply(`Pong! ${Date.now() - message.createdTimestamp}ms`);
  }
};
