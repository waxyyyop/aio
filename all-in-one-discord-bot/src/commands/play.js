module.exports = {
  data: { name: 'play', description: 'Play audio from YouTube (search or url)' },
  executeMessage: async (message, args) => {
    const query = args.join(' ');
    if (!query) return message.reply('Provide a search term or URL.');
    const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
    const play = require('play-dl');

    const vc = message.member.voice.channel;
    if (!vc) return message.reply('You need to be in a voice channel.');

    const guildId = message.guild.id;
    let state = message.client.music.get(guildId);
    if (!state) {
      const connection = joinVoiceChannel({ channelId: vc.id, guildId: vc.guild.id, adapterCreator: vc.guild.voiceAdapterCreator });
      state = { connection, player: createAudioPlayer(), queue: [], playing: false };
      message.client.music.set(guildId, state);
      state.connection.subscribe(state.player);
    }

    // resolve stream
    let streamInfo;
    if (play.yt_validate(query) === 'video') {
      streamInfo = await play.stream(query, { quality: 2 });
      streamInfo.title = (await play.video_info(query)).video_details.title;
      streamInfo.url = query;
    } else {
      const search = await play.search(query, { source: 'yt', limit: 1 });
      if (!search || search.length === 0) return message.reply('No results found.');
      streamInfo = await play.stream(search[0].url, { quality: 2 });
      streamInfo.title = search[0].title;
      streamInfo.url = search[0].url;
    }

    const resource = createAudioResource(streamInfo.stream, { inputType: streamInfo.type });

    // enqueue or play
    if (state.playing) {
      state.queue.push({ resource, title: streamInfo.title, url: streamInfo.url });
      return message.reply(`Queued: ${streamInfo.title}`);
    }

    state.playing = true;
    state.player.play(resource);
    await message.reply(`Now playing: ${streamInfo.title}`);

    state.player.on('stateChange', async (oldState, newState) => {
      if (newState.status === AudioPlayerStatus.Idle) {
        const next = state.queue.shift();
        if (next) {
          state.player.play(next.resource);
          message.channel.send(`Now playing: ${next.title}`);
        } else {
          state.playing = false;
        }
      }
    });
  }
};
