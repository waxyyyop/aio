const axios = require('axios');
const LavaliinkNode = require('../models/LavaliinkNode');

class MusicManager {
  constructor() {
    this.nodes = [];
    this.players = new Map();
  }

  async initialize() {
    try {
      const dbNodes = await LavaliinkNode.find().sort({ priority: -1 });
      this.nodes = dbNodes.map(node => ({
        name: node.name,
        host: node.host,
        port: node.port,
        password: node.password,
        secure: node.secure,
        priority: node.priority,
        status: node.status,
        id: node._id
      }));
      console.log(`[Music] Loaded ${this.nodes.length} nodes from database`);
      await this.checkAllNodes();
    } catch (err) {
      console.error('[Music] Failed to initialize nodes:', err.message);
    }
  }

  getBaseUrl(node) {
    const protocol = node.secure ? 'https' : 'http';
    return `${protocol}://${node.host}:${node.port}`;
  }

  async checkNodeHealth(node) {
    try {
      const response = await axios.get(`${this.getBaseUrl(node)}/info`, {
        headers: { 'Authorization': node.password },
        timeout: 5000
      });
      return { status: 'online', version: response.data.version };
    } catch (err) {
      return { status: 'offline', error: err.message };
    }
  }

  async checkAllNodes() {
    for (const node of this.nodes) {
      const health = await this.checkNodeHealth(node);
      node.status = health.status;
      
      await LavaliinkNode.updateOne(
        { _id: node.id },
        { status: health.status, lastCheck: new Date() }
      ).catch(() => {});
    }
  }

  getActiveNodes() {
    return this.nodes.filter(n => n.status === 'online').sort((a, b) => b.priority - a.priority);
  }

  getBestNode() {
    const active = this.getActiveNodes();
    return active.length > 0 ? active[0] : null;
  }

  async search(query, node) {
    if (!node) return null;
    try {
      const response = await axios.get(`${this.getBaseUrl(node)}/loadtracks`, {
        params: { identifier: query },
        headers: { 'Authorization': node.password },
        timeout: 10000
      });
      return response.data;
    } catch (err) {
      console.error('[Music] Search failed:', err.message);
      return null;
    }
  }

  async loadTrackData(track, node) {
    try {
      const response = await axios.post(`${this.getBaseUrl(node)}/loadtrack`, 
        { identifier: track },
        { headers: { 'Authorization': node.password }, timeout: 10000 }
      );
      return response.data;
    } catch (err) {
      console.error('[Music] Track load failed:', err.message);
      return null;
    }
  }

  createPlayer(guildId) {
    if (!this.players.has(guildId)) {
      this.players.set(guildId, {
        guildId,
        queue: [],
        current: null,
        playing: false,
        paused: false,
        node: this.getBestNode(),
        volume: 100,
        loop: 'none'
      });
    }
    return this.players.get(guildId);
  }

  getPlayer(guildId) {
    return this.players.get(guildId) || null;
  }

  deletePlayer(guildId) {
    return this.players.delete(guildId);
  }

  async addTrackToQueue(guildId, track) {
    const player = this.createPlayer(guildId);
    player.queue.push(track);
    return player;
  }

  skipTrack(guildId) {
    const player = this.getPlayer(guildId);
    if (!player) return null;
    
    if (player.queue.length > 0) {
      player.current = player.queue.shift();
      return player.current;
    }
    player.current = null;
    return null;
  }

  getQueue(guildId) {
    const player = this.getPlayer(guildId);
    return player ? player.queue : [];
  }

  clearQueue(guildId) {
    const player = this.getPlayer(guildId);
    if (player) {
      player.queue = [];
      return true;
    }
    return false;
  }

  setVolume(guildId, volume) {
    const player = this.getPlayer(guildId);
    if (player) {
      player.volume = Math.min(200, Math.max(0, volume));
      return player.volume;
    }
    return null;
  }

  setLoop(guildId, mode) {
    const player = this.getPlayer(guildId);
    if (player) {
      player.loop = mode; // 'none', 'track', 'queue'
      return player.loop;
    }
    return null;
  }
}

module.exports = new MusicManager();
