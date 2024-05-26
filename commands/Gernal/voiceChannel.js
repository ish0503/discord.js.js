const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    demuxProbe
} = require("@discordjs/voice")
const { createReadStream } = require('fs');
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("test"),
    /**
     * 
     * @param {import(*discord.js*).ChatInputCommandInteraction} interaction
     */
    async execute(interaction){
        async function probeAndCreateResource(readableStream) {
            const { stream, type } = await demuxProbe(readableStream);
            return createAudioResource(stream, { inputType: type });
        }

        await interaction.deferReply({ephemeral: true})

        if (!interaction.member.voice.channelId) 
            return interaction.editReply({content: "보이스 채널에 입장해주세요."})

        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channelId,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator
        })
        const player = createAudioPlayer();

        const resource = await probeAndCreateResource(createReadStream('music/Shiroko.mp3'));
        
        connection.subscribe(player)
        player.play(resource)

        player.on('error', error => {
            console.error('Error:', error.message, 'with track', error.resource.metadata.title);
        });
        player.on(AudioPlayerStatus.Playing, () => {
            console.log("The audio player has started playing!");
        });
        player.on(AudioPlayerStatus.AutoPaused, () => {
            console.log("The audio player End!");
        });

        interaction.editReply({content: "음악 실행할게."})
        console.log("ok");
    }
}
