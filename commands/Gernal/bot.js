const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { table } = require("console");

const genAI = new GoogleGenerativeAI(process.env.GEMINI);

const history = []

module.exports = {
    data: new SlashCommandBuilder()

    .setName("챗봇")
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
        const msg = await interaction.deferReply()
        const args = interaction.options.getString("내용")
        const model = genAI.getGenerativeModel({ model: "gemini-pro"})

        try{

            const chat = model.startChat({
                history: history,
                generationConfig: {
                  maxOutputTokens: 2000,
                },
            });
          
            const result = await chat.sendMessageStream(args);
    
            console.log(result)
            console.log(result.stream)

            let text = '';
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                console.log(chunkText);
                text += chunkText;

                const embed = new EmbedBuilder()
                .addFields(
                    { name: interaction.user.username, value: args },
                    { name: `Bot`, value: text },
                )
                .setColor(0xFFFF00)
                .setThumbnail(interaction.user.displayAvatarURL())
    
                interaction.editReply({ embeds: [embed] })
            }
        }catch(err){
            console.log(err)
            interaction.editReply(`에러: ${err}`)
        }
    }
}