const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const PremiumGuild = require('./models/PremiumGuild');
const WelcomeMessage = require('./models/WelcomeMessage');
const WordFilter = require('./models/WordFilter');
const ReactionRole = require('./models/ReactionRole');
const Case = require('./models/Case');

const TOKEN = process.env.TOKEN;
const PREFIX = process.env.PREFIX || '!';
const DEV_GUILD_ID = process.env.DEV_GUILD_ID;
const OWNER = process.env.OWNER;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });

// Attach owner info/helpers to the client for owner-only checks
client.ownerId = OWNER;
client.isOwner = id => id === OWNER;

client.commands = new Map();
client.music = new Map();
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
    const cmd = require(path.join(commandsPath, file));
    if (cmd.data && (cmd.executeInteraction || cmd.executeMessage)) {
      client.commands.set(cmd.data.name, cmd);
    }
  }
}

client.once('ready', async () => {
  console.log(`Ready as ${client.user.tag}`);

  const slashCommands = Array.from(client.commands.values()).map(c => {
    if (c.data && typeof c.data.toJSON === 'function') return c.data.toJSON();
    return { name: c.data.name, description: c.data.description || 'No description' };
  });
  if (DEV_GUILD_ID) {
    try {
      const guild = await client.guilds.fetch(DEV_GUILD_ID);
      await guild.commands.set(slashCommands);
      console.log('Registered slash commands to dev guild');
    } catch (err) {
      console.error('Failed to register guild commands:', err);
    }
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const cmd = client.commands.get(interaction.commandName);
  if (!cmd || !cmd.executeInteraction) return;
  try {
    await cmd.executeInteraction(interaction);
  } catch (err) {
    console.error(err);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command.', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
    }
  }
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  
  // Handle word filter for premium guilds
  if (message.guild) {
    try {
      const filter = await WordFilter.findOne({ guildId: message.guild.id });
      if (filter && filter.enabled && filter.words.length) {
        const msgLower = message.content.toLowerCase();
        const hasFilteredWord = filter.words.some(word => msgLower.includes(word));
        if (hasFilteredWord) {
          if (filter.action === 'delete') {
            await message.delete().catch(() => {});
            return message.author.send(`Your message in ${message.guild.name} was deleted for violating chat filter.`).catch(() => {});
          }
          if (filter.action === 'warn') {
            const c = new Case({ guildId: message.guild.id, userId: message.author.id, moderatorId: client.user.id, type: 'warn', reason: 'Chat filter violation' });
            await c.save();
          }
        }
      }
    } catch (err) {
      console.error('Error checking word filter:', err);
    }
  }

  // Check if guild has no-prefix mode enabled
  let hasNoPrefix = false;
  if (message.guild) {
    try {
      const premium = await PremiumGuild.findOne({ guildId: message.guild.id }).lean().exec();
      hasNoPrefix = premium && premium.noPrefix === true;
    } catch (err) {
      console.error('Error checking no-prefix mode:', err);
    }
  }

  // Parse command
  let cmdName, args;
  if (hasNoPrefix) {
    // No-prefix mode: any first word is a command attempt
    args = message.content.trim().split(/\s+/);
    cmdName = args.shift().toLowerCase();
  } else {
    // Standard prefix mode
    if (!message.content.startsWith(PREFIX)) return;
    args = message.content.slice(PREFIX.length).trim().split(/\s+/);
    cmdName = args.shift().toLowerCase();
  }

  const cmd = client.commands.get(cmdName);
  if (!cmd || !cmd.executeMessage) return;
  try {
    await cmd.executeMessage(message, args);
  } catch (err) {
    console.error(err);
    message.reply('There was an error executing that command.');
  }
});

if (!TOKEN) {
  console.error('Missing TOKEN in .env');
  process.exit(1);
}

// Premium Feature: Welcome Messages
client.on('guildMemberAdd', async member => {
  try {
    const welcome = await WelcomeMessage.findOne({ guildId: member.guild.id });
    if (welcome && welcome.enabled) {
      const channel = member.guild.channels.cache.get(welcome.channelId);
      if (channel) {
        const msg = welcome.message
          .replace('{user}', member.user.username)
          .replace('{guild}', member.guild.name)
          .replace('{count}', member.guild.memberCount);
        await channel.send(msg).catch(() => {});
      }
    }
  } catch (err) {
    console.error('Error sending welcome message:', err);
  }
});

// Premium Feature: Reaction Roles
client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return;
  try {
    const rr = await ReactionRole.findOne({
      guildId: reaction.message.guildId,
      messageId: reaction.message.id,
      emoji: reaction.emoji.name || reaction.emoji.id
    });
    if (rr) {
      const member = await reaction.message.guild.members.fetch(user.id);
      const role = await reaction.message.guild.roles.fetch(rr.roleId);
      if (member && role) await member.roles.add(role).catch(() => {});
    }
  } catch (err) {
    console.error('Error adding reaction role:', err);
  }
});

client.on('messageReactionRemove', async (reaction, user) => {
  if (user.bot) return;
  try {
    const rr = await ReactionRole.findOne({
      guildId: reaction.message.guildId,
      messageId: reaction.message.id,
      emoji: reaction.emoji.name || reaction.emoji.id
    });
    if (rr) {
      const member = await reaction.message.guild.members.fetch(user.id);
      const role = await reaction.message.guild.roles.fetch(rr.roleId);
      if (member && role) await member.roles.remove(role).catch(() => {});
    }
  } catch (err) {
    console.error('Error removing reaction role:', err);
  }
});

// Connect to DB and login
(async () => {
  const db = require('./lib/db');
  await db.connect();
  client.login(TOKEN);
})();
