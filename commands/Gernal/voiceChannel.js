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
    .setName("사운드")
    .setDescription("사운드 관련 명령어야!")
    .addSubcommand((subcommand) =>
        subcommand
          .setName("play")
          .setDescription("test")
          .addStringOption(option =>
            option
            .setName('종류')
            .setDescription('들을 사운드 종류 선택!')
            .setRequired(true)
            .addChoices(
                {
                    name: 'Ibuki_Cafe_monolog_1', 
                    value: 'Ibuki_Cafe_monolog_1'
                },
                {
                    name: 'Ibuki_Cafe_monolog_2', 
                    value: 'Ibuki_Cafe_monolog_2'
                },
                {
                    name: 'Ibuki_Cafe_monolog_3', 
                    value: 'Ibuki_Cafe_monolog_3'
                },
                {
                    name: 'Ibuki_Cafe_monolog_4', 
                    value: 'Ibuki_Cafe_monolog_4'
                },
                {
                    name: 'Ibuki_Cafe_monolog_5', 
                    value: 'Ibuki_Cafe_monolog_5'
                },
                {
                    name: 'Ibuki_Gachaget', 
                    value: 'Ibuki_Gachaget'
                },
                {
                    name: 'Ibuki_LogIn_1', 
                    value: 'Ibuki_LogIn_1'
                },
                {
                    name: 'Ibuki_LogIn_2', 
                    value: 'Ibuki_LogIn_2'
                },
                {
                    name: 'Ibuki_Title', 
                    value: 'Ibuki_Title'
                },
                {
                    name: 'Shiroko', 
                    value: 'Shiroko'
                },
                {
                    name: 'UnwelcomeSchool', 
                    value: 'UnwelcomeSchool'
                },
            )
        ),
    )
    .addSubcommand((subcommand) =>
        subcommand
          .setName("stop")
          .setDescription("test")
    ),
    /**
     * 
     * @param {import(*discord.js*).ChatInputCommandInteraction} interaction
     */
    async execute(interaction){
        const player = createAudioPlayer();
        if (interaction.options.getSubcommand() === "play") {
            const string = interaction.options.getString('종류');
            async function probeAndCreateResource(readableStream) {
                const { stream, type } = await demuxProbe(readableStream);
                return createAudioResource(stream, { inputType: type });
            }
    
            await interaction.deferReply({ephemeral: true})
    
            if (!interaction.member.voice.channelId) 
                return interaction.editReply({content: "보이스 채널에 입장해줘!"})
    
            const connection = joinVoiceChannel({
                channelId: interaction.member.voice.channelId,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator
            })
    
            const resource = await probeAndCreateResource(createReadStream(`music/${string}.ogg`));
            
            connection.subscribe(player)
            player.play(resource)
    
            // player.on('error', error => {
            //     console.error('Error:', error.message, 'with track', error.resource.metadata.title);
            // });
            // player.on(AudioPlayerStatus.Playing, () => {
            //     console.log("The audio player has started playing!");
            // });
            // player.on(AudioPlayerStatus.AutoPaused, () => {
            //     console.log("The audio player End!");
            // });
    
            interaction.editReply({content: "음악 실행할게."})
        }else if(interaction.options.getSubcommand() === "stop"){
            player.stop();
        }
    }
}
