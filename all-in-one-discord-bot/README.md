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
│   ├── commands/           # Command files (slash & message)
│   │   ├── help.js         # List all commands
│   │   ├── join.js         # Join voice channel
│   │   ├── leave.js        # Leave voice channel
│   │   ├── ping.js         # Bot latency
│   │   ├── play.js         # Play music
│   │   ├── premium.js      # Premium management
│   │   ├── queue.js        # Show music queue
│   │   ├── setimages.js    # Configure images
│   │   ├── skip.js         # Skip song
│   │   └── stop.js         # Stop playback
│   ├── lib/
│   │   ├── db.js           # MongoDB connection
│   │   └── embed.js        # Embed styling helpers
│   ├── models/             # Mongoose schemas
│   │   ├── BotConfig.js    # Global bot config
│   │   ├── GuildConfig.js  # Per-guild settings
│   │   └── PremiumGuild.js # Premium guild data
│   └── index.js            # Main bot entry point
├── .env.example            # Example environment variables
├── package.json
└── README.md
```

## 💾 Database Models

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

## 💡 Tips & Best Practices

1. **Speed Up Command Testing**: Set `DEV_GUILD_ID` to register commands to one server instantly (instead of waiting 1 hour for global sync).

2. **Customize Embed Styling**: Edit [src/lib/embed.js](src/lib/embed.js) to change colors:
   ```javascript
   function success(description) {
     return build({ ..., color: 0x57F287 }); // Green
   }
   ```

3. **Add New Commands**: 
   - Create `src/commands/mycommand.js`
   - Export: `data` (SlashCommandBuilder), `executeMessage()`, `executeInteraction()`
   - Bot auto-loads commands on startup

4. **Monitor Database**: Use [MongoDB Compass](https://www.mongodb.com/products/compass) to view databases in real-time.

5. **Permission Checks**: Use `client.isOwner()` or check `member.permissions.has('Administrator')`.

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
