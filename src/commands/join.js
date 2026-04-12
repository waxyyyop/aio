const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const Embed = require('../lib/embed');
const musicManager = require('../lib/musicManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Join your voice channel'),

  executeMessage: async (message) => {
    const vc = message.member.voice.channel;
    if (!vc) return message.reply('You need to be in a voice channel.');

    const connection = joinVoiceChannel({
      channelId: vc.id,
      guildId: vc.guild.id,
      adapterCreator: vc.guild.voiceAdapterCreator
    });

    musicManager.createPlayer(message.guildId);

    return message.reply(`✅ Joined ${vc.name}`);
  },

  async execute(interaction) {
    const vc = interaction.member.voice.channel;
    
    if (!vc) {
      return interaction.reply({ embeds: [Embed.error('You need to be in a voice channel')] });
    }

    const connection = joinVoiceChannel({
      channelId: vc.id,
      guildId: vc.guild.id,
      adapterCreator: vc.guild.voiceAdapterCreator
    });

    musicManager.createPlayer(interaction.guildId);

    const embed = Embed.success('Connected')
      .setDescription(`Joined **${vc.name}** voice channel`);

    return interaction.reply({ embeds: [embed] });
  }
};
