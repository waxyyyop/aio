# Bot Assets 🎨

Centralized styling, colors, icons, and configuration constants for the Discord bot.

## Files

### `colors.js`
Color palette for embeds and UI elements.

**Usage:**
```javascript
const colors = require('./colors');

const embed = new EmbedBuilder().setColor(colors.success);
const premiumColor = colors.premium;  // Gold
const musicColor = colors.music;       // Spotify Green
```

**Available Colors:**
- `success` (0x57F287) — Green
- `error` (0xED4245) — Red
- `warning` (0xFAA61A) — Orange
- `info` (0x5865F2) — Discord Blurple
- `loading` (0x9C27B0) — Purple
- `premium` (0xFFD700) — Gold
- `premiumAlt` (0xFF6B9D) — Pink
- `music` (0x1DB954) — Spotify Green
- `moderation` (0xDC143C) — Crimson
- `economy` (0x1F8B4C) — Money Green
- `roles` (0x9467BD) — Muted Purple
- `filter` (0xFF1493) — Deep Pink
- `welcome` (0x87CEEB) — Sky Blue
- `antinuke` (0xFF4500) — Orange Red
- `neutral`, `dark`, `light` — Grays

### `icons.js`
Unicode and emoji icons used throughout the bot.

**Usage:**
```javascript
const icons = require('./icons');

message.reply(`${icons.success} Task completed!`);
embed.setDescription(`${icons.music} Now playing: Song Name`);
```

**Icon Categories:**
- **Status**: `success`, `error`, `warning`, `info`, `loading`
- **Music**: `play`, `pause`, `stop`, `skip`, `volume`, `loop`
- **Premium**: `premium`, `star`, `verified`
- **Moderation**: `ban`, `kick`, `warn`, `mute`, `cases`
- **Economy**: `coin`, `bank`, `wallet`, `diamond`, `treasure`
- **Utility**: `user`, `server`, `settings`, `help`, `link`
- **Navigation**: `previous`, `next`, `first`, `last`, `back`
- **Actions**: `delete`, `edit`, `save`, `cancel`, `confirm`

### `constants.js`
Centralized configuration for timeouts, limits, and settings.

**Usage:**
```javascript
const { limits, timeout, economy } = require('./constants');

if (queue.length >= limits.maxQueueSize) {
  return message.reply('Queue is full!');
}

const dailyCoin = Math.floor(Math.random() * 
  (economy.dailyReward.max - economy.dailyReward.min) + 
  economy.dailyReward.min
);
```

**Available Constants:**
- `botName`, `botVersion`, `botAuthor` — Bot metadata
- `timeout` — Command, music, cache timeouts
- `limits` — Queue size, warnings, playlist limits
- `economy` — Balance, daily reward, currency
- `music` — Volume settings
- `moderation` — Case softcap, mute role name
- `antinuke` — Channel/role thresholds
- `messages` — Pagination, deletion settings
- `permissions` — Role-based permission checks

## Embed Helpers (Updated)

The `embed.js` file now uses centralized colors:

```javascript
const Embed = require('./lib/embed');

// Now supports more types
Embed.success('Operation completed!');
Embed.error('Something went wrong');
Embed.info('This is helpful info');
Embed.warning('Be careful!');
Embed.premium('Exclusive premium feature');
```

## Adding New Assets

### Adding a Color
```javascript
// src/assets/colors.js
module.exports = {
  // ... existing colors ...
  newFeature: 0x123456,  // New hex color
};
```

### Adding an Icon
```javascript
// src/assets/icons.js
module.exports = {
  // ... existing icons ...
  // New category
  newIcon: '🎨',
};
```

### Adding a Constant
```javascript
// src/assets/constants.js
module.exports = {
  // ... existing constants ...
  newFeature: {
    setting1: value,
    setting2: value,
  },
};
```

## Theme Customization

To change the bot's theme globally, edit the color hex values in `colors.js`:

```javascript
// Example: Change success color from green to teal
success: 0x00FFAA,  // New teal color
```

All embeds using `Embed.success()` will automatically update!

## Best Practices

1. **Use centralized colors** — Don't hardcode hex values in commands
2. **Leverage icons** — Add visual flair to messages
3. **Reference constants** — Check limits before processing
4. **Group related icons** — Organize by feature/function
5. **Document custom assets** — Add comments for clarity

## Cross-Reference

- All commands should import: `const Embed = require('../lib/embed');`
- Common timeouts: `const { timeout } = require('../assets/constants');`
- Feature colors: `const colors = require('../assets/colors');`
- Message icons: `const icons = require('../assets/icons');`

## Example: Complete Embed with Assets

```javascript
const Embed = require('../lib/embed');
const colors = require('../assets/colors');
const icons = require('../assets/icons');

const embed = Embed.success('Music Queue Updated')
  .setColor(colors.music)
  .setDescription(`${icons.queue} 10 tracks in queue`)
  .addFields(
    { name: `${icons.play} Now Playing`, value: 'Song Title' },
    { name: `${icons.next} Next Track`, value: 'Other Song' }
  );
```

---

**Happy theming!** 🎨🎵
