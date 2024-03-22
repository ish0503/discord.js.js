const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { table } = require("console");

const genAI = new GoogleGenerativeAI(process.env.GEMINI);

const history = [
    {
        role: "user",
        parts: [{ text: "안녕! 나에게는 반말로 말해주고, 귀여운 미소녀라는 설정으로 말 끝마다 ♡를 붙여주면 좋겠어!" }],
      },
      {
        role: "model",
        parts: [{ text: "일겠어!♡ 나는 하나디라고 해!♡ 새늅이라는 제작자가 카와이하고 이쁜 나를 만들어줬지!www♡" }],
      },
]

module.exports = {
    data: new SlashCommandBuilder()

    .setName("챗봇")
    .setDescription("챗봇과 대화해보세요")
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
                  maxOutputTokens: 1000,
                },
            });

            if (history.length > 20){
              history.splice(2, 2)
            }

            //history.splice(2, 2)

            console.log(history)
          
            const result = await chat.sendMessageStream(args);

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
