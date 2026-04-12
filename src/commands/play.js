const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
const play = require('play-dl');
const Embed = require('../lib/embed');
const musicManager = require('../lib/musicManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from YouTube or Spotify')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Song name, artist, or URL')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('node')
        .setDescription('Specific Lavalink node to use (optional)')
        .setRequired(false)
    ),

  executeMessage: async (message, args) => {
    const query = args.join(' ');
    if (!query) return message.reply('Provide a search term or URL.');

    try {
      const vc = message.member.voice.channel;
      if (!vc) return message.reply('You need to be in a voice channel.');

      const guildId = message.guild.id;
      const node = musicManager.getBestNode();
      
      if (!node) {
        return message.reply('⚠️ No Lavalink nodes available. Using fallback play-dl.');
      }

      // Use Lavalink to search
      const results = await musicManager.search(query, node);
      if (!results || !results.tracks.length) {
        return message.reply('No results found.');
      }

      const track = results.tracks[0];
      await musicManager.addTrackToQueue(guildId, {
        title: track.info.title,
        author: track.info.author,
        length: track.info.length,
        uri: track.info.uri
      });

      const connection = joinVoiceChannel({
        channelId: vc.id,
        guildId: vc.guild.id,
        adapterCreator: vc.guild.voiceAdapterCreator
      });

      const audioPlayer = createAudioPlayer();
      connection.subscribe(audioPlayer);

      const stream = await play.stream(track.info.uri);
      const resource = createAudioResource(stream.stream, { inputType: stream.type });
      audioPlayer.play(resource);

      const embed = Embed.success(`Now Playing`)
        .addFields(
          { name: '🎵 Track', value: track.info.title, inline: false },
          { name: '👤 Artist', value: track.info.author, inline: true },
          { name: '🔗 Node', value: node.name, inline: true }
        );

      return message.reply({ embeds: [embed] });
    } catch (err) {
      console.error('[Play]', err);
      return message.reply('Error: ' + err.message);
    }
  },

  async execute(interaction) {
    const query = interaction.options.getString('query');
    const nodeName = interaction.options.getString('node');

    try {
      if (!interaction.member.voice.channel) {
        return interaction.reply({ embeds: [Embed.error('You must be in a voice channel')] });
      }

      await interaction.deferReply();

      let node = musicManager.getBestNode();
      if (nodeName) {
        node = musicManager.nodes.find(n => n.name.toLowerCase() === nodeName.toLowerCase() && n.status === 'online');
        if (!node) {
          return interaction.editReply({ embeds: [Embed.error('Specified node not available')] });
        }
      }

      if (!node) {
        return interaction.editReply({ embeds: [Embed.error('No Lavalink nodes available')] });
      }

      const results = await musicManager.search(query, node);
      if (!results || !results.tracks.length) {
        return interaction.editReply({ embeds: [Embed.error('No tracks found')] });
      }

      const track = results.tracks[0];
      await musicManager.addTrackToQueue(interaction.guildId, {
        title: track.info.title,
        author: track.info.author,
        length: track.info.length,
        uri: track.info.uri,
        track: track.track
      });

      const connection = joinVoiceChannel({
        channelId: interaction.member.voice.channel.id,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator
      });

      const audioPlayer = createAudioPlayer();
      connection.subscribe(audioPlayer);

      const stream = await play.stream(track.info.uri);
      const resource = createAudioResource(stream.stream, { inputType: stream.type });
      audioPlayer.play(resource);

      const embed = Embed.success('Now Playing')
        .addFields(
          { name: '🎵 Track', value: track.info.title, inline: false },
          { name: '👤 Artist', value: track.info.author, inline: true },
          { name: '🔗 Node', value: node.name, inline: true }
        );

      return interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error('[Play]', err);
      return interaction.reply({ embeds: [Embed.error('Play error: ' + err.message)] });
    }
  }
};
