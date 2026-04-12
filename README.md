# All-in-One Discord Bot 🤖

A fully-featured, all-in-one Discord bot built with **discord.js** (v14), **Node.js** (v18+), **MongoDB**, and **Mongoose**. Includes slash commands, message commands, premium guild management, custom bot branding, and music functionality.

## 🎯 Features

- ✅ **Slash Commands** — Modern Discord application commands with options & subcommands
- ✅ **Message Commands** — Prefix-based commands (default: `!`)
- ✅ **Premium Guild System** — Grant/revoke premium status and update bot avatar/banner accordingly
- ✅ **Bot Image Management** — Set custom avatar/banner for premium and default bot states
- ✅ **MongoDB Integration** — Persistent data storage via Mongoose
- ✅ **Owner/Admin Checks** — Role-based command permissions
- ✅ **Embedded Responses** — Color-coded embeds (success/error/info)
- ✅ **Music Commands** — Join, leave, play, skip, stop queue control
- ✅ **Help Command** — Dynamically lists all available commands
- ✅ **Modular Architecture** — Easy to extend and customize

## 📋 Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn**
- **MongoDB** instance (local or [Atlas](https://www.mongodb.com/cloud/atlas))
- **Discord Bot Token** (from [Discord Developer Portal](https://discord.com/developers/applications))
- **Discord Server** with admin access (for testing)

## 🚀 Installation

1. **Clone or download the repository:**
   ```bash
   git clone <your-repo-url>
   cd all-in-one-discord-bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file** (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. **Configure `.env` with your values** (see [Environment Variables](#environment-variables) below):
   ```env
   TOKEN=your_discord_bot_token_here
   CLIENT_ID=your_bot_client_id_here
   DEV_GUILD_ID=your_dev_server_id_for_testing
   PREFIX=!
   OWNER=your_discord_user_id_here
   MONGODB_URI=mongodb://localhost:27017/discord-bot
   PREMIUM_AVATAR_URL=https://example.com/premium-avatar.png
   PREMIUM_BANNER_URL=https://example.com/premium-banner.png
   DEFAULT_AVATAR_URL=https://example.com/default-avatar.png
   DEFAULT_BANNER_URL=https://example.com/default-banner.png
   ```

## ⚙️ Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TOKEN` | ✅ Yes | Bot token from Discord Developer Portal |
| `CLIENT_ID` | ✅ Yes | Your bot's Client ID |
| `DEV_GUILD_ID` | ❌ No | Dev server ID for faster slash command registration |
| `PREFIX` | ❌ No | Prefix for message commands (default: `!`) |
| `OWNER` | ✅ Yes | Your Discord user ID (for owner-only commands) |
| `MONGODB_URI` | ✅ Yes | MongoDB connection string (local or Atlas) |
| `PREMIUM_AVATAR_URL` | ❌ No | Avatar URL when guild has premium status |
| `PREMIUM_BANNER_URL` | ❌ No | Banner URL when guild has premium status |
| `DEFAULT_AVATAR_URL` | ❌ No | Default avatar URL |
| `DEFAULT_BANNER_URL` | ❌ No | Default banner URL |

### Get Your IDs

1. **Enable Developer Mode** in Discord (User Settings → Advanced → Developer Mode)
2. **Right-click any user/server** and select "Copy User ID" or "Copy Server ID"
3. **Find Bot Token & Client ID**: [Discord Developer Portal](https://discord.com/developers/applications) → Your App → Bot/General

### MongoDB Setup

- **Local**: Install MongoDB, run `mongod`, then use:
  ```
  MONGODB_URI=mongodb://localhost:27017/discord-bot
  ```
- **Atlas**: Create a cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas), copy the connection string.

## 🎮 Running the Bot

### Development Mode (with auto-reload)

```bash
npm run dev
```

Auto-restarts on file changes (requires `nodemon`).

### Production Mode

```bash
npm start
```

Or with a process manager like **PM2**:
```bash
pm2 start src/index.js --name "discord-bot"
```

## 📦 Commands

### Admin Commands (Require Owner or Server Admin)

#### `/premium`
Manage premium status for your guild:
- **`/premium add [avatar] [banner]`** — Enable premium (optional one-shot avatar/banner URLs)
- **`/premium remove`** — Disable premium
- **`/premium status`** — Show premium status

**Message Command**: `!premium add|remove|status [avatar] [banner]`

#### `/setimages`
Configure bot avatar/banner for premium and default states:
- **`/setimages show`** — Display current image config
- **`/setimages set <scope> <type> <url>`** — Set image (scope: premium/default, type: avatar/banner)
- **`/setimages clear <scope> <type>`** — Clear an image URL

**Message Command**: `!setimages show|set|clear <scope> <type> [url]`

### Public Commands

#### `/help`
List all available commands with descriptions
**Message Command**: `!help`

#### `/ping`
Check bot latency
**Message Command**: `!ping`

#### Music Commands
- **`/play <song>`** — Play a song (query or URL)
- **`/skip`** — Skip current song
- **`/stop`** — Stop playback
- **`/queue`** — Show song queue
- **`/join`** — Join your voice channel
- **`/leave`** — Leave voice channel

**Message Commands**: `!play|skip|stop|queue|join|leave`

## 📂 Project Structure

```
all-in-one-discord-bot/
├── src/
│   ├── assets/             # Styling & configuration
│   │   ├── colors.js       # Color palette (embeds, UI)
│   │   ├── icons.js        # Unicode & emoji icons
│   │   ├── constants.js    # Timeouts, limits, settings
│   │   └── README.md       # Asset documentation
│   ├── commands/           # Command files (slash & message)
│   │   ├── balance.js      # Check user balance
│   │   ├── daily.js        # Daily coin reward
│   │   ├── filter.js       # Word filter management
│   │   ├── help.js         # List all commands
│   │   ├── join.js         # Join voice channel
│   │   ├── leave.js        # Leave voice channel
│   │   ├── loop.js         # Music loop mode
│   │   ├── nodes.js        # Lavalink node management
│   │   ├── ping.js         # Bot latency
│   │   ├── play.js         # Play music (Lavalink)
│   │   ├── premium.js      # Premium management
│   │   ├── queue.js        # Show music queue
│   │   ├── reactionrole.js # Reaction role management
│   │   ├── setimages.js    # Configure bot images
│   │   ├── skip.js         # Skip song
│   │   ├── stop.js         # Stop playback
│   │   ├── volume.js       # Set music volume
│   │   ├── welcome.js      # Welcome message config
│   │   └── [moderation]    # Ban, kick, warn, mute, purge, cases, stats
│   ├── lib/
│   │   ├── db.js           # MongoDB connection
│   │   ├── embed.js        # Embed styling helpers (uses colors.js)
│   │   └── musicManager.js # Lavalink node manager
│   ├── models/             # Mongoose schemas
│   │   ├── BotConfig.js    # Global bot config
│   │   ├── GuildConfig.js  # Per-guild settings
│   │   ├── PremiumGuild.js # Premium guild data
│   │   ├── LavaliinkNode.js # Lavalink node config
│   │   ├── WelcomeMessage.js # Welcome messages
│   │   ├── WordFilter.js   # Word filter rules
│   │   ├── ReactionRole.js # Reaction role mappings
│   │   └── [moderation]    # Case, AntinukeConfig
│   └── index.js            # Main bot entry point
├── .env.example            # Example environment variables
├── package.json
├── LAVALINK_SETUP.md       # Lavalink installation guide
├── LAVALINK_IMPLEMENTATION.md # Technical reference
└── README.md
```

## 💾 Database Models

### LavaliinkNode
Stores Lavalink node configuration and health status.
```javascript
{ name, host, port, password, secure: false, priority: 0, status: 'online|offline|error', lastCheck }
```

### PremiumGuild
Stores guild premium status, who granted it, and when.
```javascript
{ guildId, addedBy, premiumSince, expiresAt }
```

### BotConfig
Stores global bot image URLs for premium/default states.
```javascript
{ premiumAvatar, premiumBanner, defaultAvatar, defaultBanner, updatedAt }
```

### GuildConfig
Stores per-guild settings like custom prefix.
```javascript
{ guildId, prefix, createdAt }
```

## 🎵 Lavalink Multi-Node Music System

The bot integrates **Lavalink**, a professional-grade, Node.js-based audio streaming platform. This enables:
- **High-quality audio streaming** from YouTube, Spotify, SoundCloud, and more
- **Multi-node failover** — Automatic fallback if a node goes down
- **Priority-based load balancing** — Direct traffic to preferred nodes
- **Real-time health checks** — Monitor node status continuously

### Setup Lavalink Nodes

1. **Install Lavalink** (requires Java 11+):
   ```bash
   java -jar Lavalink.jar
   ```
   [Download Lavalink](https://github.com/lavalink-devs/Lavalink/releases)

2. **Configure `application.yml`**:
   ```yaml
   server:
     port: 2333
   
   lavalink:
     server:
       password: "yoursecurepassword"
   ```

3. **Add Node to Bot**:
   - Use `/nodes add`:
     ```
     /nodes add name:us-1 host:localhost port:2333 password:yoursecurepassword
     ```
   - Or message command: `!nodes add name:us-1 host:localhost port:2333 password:yoursecurepassword`

4. **Check Node Status**:
   ```
   /nodes check
   ```

### Node Management Commands

- **`/nodes list`** — Show all configured nodes and their status
- **`/nodes add <name> <host> <port> <password>`** — Add a new Lavalink node
- **`/nodes remove <name>`** — Remove a node from the bot
- **`/nodes check`** — Check health status of all nodes

### Music Commands (Updated)

All music commands now support Lavalink with automatic node selection:
- **`/play <query> [node]`** — Play from YouTube/Spotify; optionally specify a node
  - `!play Never Gonna Give You Up` (uses best available node)
  - `!play https://www.youtube.com/watch?v=... "us-1"` (specific node)
- **`/skip`** — Skip to next track
- **`/stop`** — Stop playback and clear queue
- **`/queue [page]`** — Show music queue (paginated)
- **`/join`** — Join your voice channel
- **`/leave`** — Leave and cleanup
- **`/volume <level>`** — Set volume (0-200)
- **`/loop <mode>`** — Set loop mode (none/track/queue)

### How It Works

1. **Node Selection**: When a music command runs, the bot:
   - Checks all registered Lavalink nodes
   - Selects the highest-priority online node
   - Falls back to secondary nodes if primary is down

2. **Track Search**: Uses selected node's track API to search:
   - YouTube videos & playlists
   - Spotify tracks & playlists
   - SoundCloud tracks
   - Direct URLs (http/https)

3. **Playback**: Streams audio through discord.js voice adapter:
   - Submits track to Lavalink
   - Uses play-dl for fallback/direct streaming
   - Manages queue auto-advance

4. **Health Monitoring**: Bot periodically checks node status:
   - Marks nodes as `online`/`offline`/`error`
   - Updates `lastCheck` timestamp
   - Automatically routes away from failing nodes

### Multi-Node Architecture

Example production setup:
```
Bot
├── Node 1 (us-1) — Priority: 10 [ONLINE] ✅
│   └── host: lavalink-us.example.com:2333
├── Node 2 (eu-1) — Priority: 5 [ONLINE] ✅
│   └── host: lavalink-eu.example.com:2333
└── Node 3 (backup) — Priority: 1 [OFFLINE] ❌
    └── host: lavalink-backup.example.com:2333
```

When playing:
1. Try **Node 1** (highest priority, online) → ✅ Use
2. If Node 1 fails → Try **Node 2** → ✅ Use
3. If Node 2 fails → Try **Node 3** → ❌ Offline, error

## 💡 Tips & Best Practices

1. **Speed Up Command Testing**: Set `DEV_GUILD_ID` to register commands to one server instantly (instead of waiting 1 hour for global sync).

2. **Customize Embed Styling**: Colors, icons, and constants are now centralized in [src/assets/](src/assets/):
   ```javascript
   const colors = require('../assets/colors');
   const icons = require('../assets/icons');
   const Embed = require('../lib/embed');
   
   // Use centralized colors & icons
   Embed.success(`${icons.success} Task completed!`)
     .setColor(colors.success);
   ```

3. **Add New Commands**: 
   - Create `src/commands/mycommand.js`
   - Export: `data` (SlashCommandBuilder), `executeMessage()`, `executeInteraction()`
   - Bot auto-loads commands on startup

4. **Theme Customization**: Change bot theme globally by editing:
   - [src/assets/colors.js](src/assets/colors.js) — 20+ predefined colors
   - [src/assets/icons.js](src/assets/icons.js) — 50+ emoji icons
   - [src/assets/constants.js](src/assets/constants.js) — Timeouts, limits, settings
   
   All embeds automatically use new colors!

5. **Monitor Database**: Use [MongoDB Compass](https://www.mongodb.com/products/compass) to view databases in real-time.

6. **Permission Checks**: Use `client.isOwner()` or check `member.permissions.has('Administrator')`.

## 🎨 Assets & Styling

The bot includes a centralized asset system:

- **[src/assets/colors.js](src/assets/colors.js)** — Feature-specific colors (music, economy, moderation, etc.)
- **[src/assets/icons.js](src/assets/icons.js)** — Unicode & emoji icons organized by category
- **[src/assets/constants.js](src/assets/constants.js)** — Timeouts, limits, economy, music settings
- **[src/assets/README.md](src/assets/README.md)** — Complete asset documentation

**Example: Creating a themed embed**
```javascript
const Embed = require('./lib/embed');
const colors = require('./assets/colors');
const icons = require('./assets/icons');

const embed = Embed.success(`${icons.queue} Queue Updated`)
  .setColor(colors.music)
  .addFields(
    { name: `${icons.play} Now Playing`, value: 'Song Title' }
  );
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Commands not appearing | Set correct `DEV_GUILD_ID` or wait 1 hour for global sync |
| Bot offline | Verify `TOKEN` is correct; check bot is running |
| MongoDB connection errors | Check `MONGODB_URI` is valid; ensure MongoDB is running |
| Avatar/banner not updating | Verify URLs are public HTTP(S) links |
| Permission denied | Ensure your user ID matches `OWNER` or you have Server Admin role |
| Bot can't join voice | Check `@discordjs/voice` and `play-dl` are installed |

## 📖 Resources

- [discord.js Docs](https://discord.js.org/)
- [Discord API Reference](https://discord.com/developers/docs/intro)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [discord.js Voice Guide](https://discordjs.guide/voice/)

## 📄 License

MIT License — Feel free to use, modify, and distribute.

## 🙏 Contributing

Contributions welcome! Feel free to open issues or submit pull requests.

---

**Built with ❤️ using discord.js, Node.js, and MongoDB**
