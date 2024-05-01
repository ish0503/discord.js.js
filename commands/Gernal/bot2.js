const CharacterAI = require('node_characterai');
const characterAI = new CharacterAI();
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

characterAI.authenticateWithToken(process.env.CHARACTERAI);

module.exports = {
    data: new SlashCommandBuilder()

    .setName("챗봇2")
    .setDescription("최첨단된 문명에서 나온 챗봇과 대화해보세요")
    .addStringOption((options) =>
          options
            .setName("내용")
            .setDescription("대화할 내용을 입력해주세요.")
            .setMaxLength(1000)
            .setRequired(true),
        ),
    /**
     * 
     * @param {import(*discord.js*).ChatInputCommandInteraction} interaction
     */
    async execute(interaction){
        await interaction.deferReply()
        const args = interaction.options.getString("내용")
        const characterId = "kZ3_qgkyiYvcRqgwv1WE2WQeME9CZy1yrCnMx98wyfk"
        const chat = await characterAI.createOrContinueChat(characterId);
        
        const response = await chat.sendAndAwaitResponse(args, true)
        const embed = new EmbedBuilder()
            .addFields(
                { name: interaction.user.username, value: args },
                { name: `Bot`, value: response.text },
            )
            .setColor(0xFFFF00)
            .setThumbnail(interaction.user.displayAvatarURL())

            interaction.editReply({ embeds: [embed] })
    }
}
