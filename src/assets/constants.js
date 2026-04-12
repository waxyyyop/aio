/**
 * Bot Theme and Style Constants
 * Centralized configuration for bot appearance and behavior
 */

const colors = require('./colors');
const icons = require('./icons');

module.exports = {
  colors,
  icons,

  // Bot branding
  botName: 'ZoRo',
  botVersion: '1.0.0',
  botAuthor: 'Your Name',

  // Embed styling
  embedStyle: {
    defaultColor: colors.info,
    successColor: colors.success,
    errorColor: colors.error,
    warningColor: colors.warning,
    loadingColor: colors.loading,
  },

  // Timeout settings
  timeout: {
    commandResponseTimeout: 10000,    // 10 seconds
    musicTimeout: 300000,             // 5 minutes
    healthCheckInterval: 60000,       // 1 minute
    guildCacheExpiry: 3600000,        // 1 hour
  },

  // Limits
  limits: {
    maxQueueSize: 1000,
    maxWarningsBeforeMute: 3,
    maxPlaylistTracks: 500,
    maxFilterWords: 100,
    maxReactionRoles: 50,
    maxWelcomeMessages: 10,
  },

  // Economy
  economy: {
    defaultBalance: 0,
    dailyReward: { min: 50, max: 150 },
    currency: 'coins',
  },

  // Music
  music: {
    defaultVolume: 100,
    maxVolume: 200,
    minVolume: 0,
  },

  // Moderation
  moderation: {
    caseSoftcap: 10,                 // Warning count before auto-action
    muteRoleName: 'Muted',
    auditLogReason: 'All-in-One Bot Moderation',
  },

  // Antinuke
  antinuke: {
    defaultDeleteChannelThreshold: 5,
    defaultDeleteRoleThreshold: 5,
    defaultRaidThreshold: 10,        // Members joining in 10s
    raidTimeWindow: 10000,           // 10 seconds
  },

  // Message settings
  messages: {
    pagination: {
      itemsPerPage: 10,
      timeout: 60000,                // 1 minute
    },
    deleteAfterMs: 0,                // Don't auto-delete (0 = disabled)
  },

  // Permissions
  permissions: {
    ownerOnly: [],                   // Filled by checking OWNER env var
    adminOnly: ['ADMINISTRATOR'],
    modOnly: ['MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'],
  },
};
