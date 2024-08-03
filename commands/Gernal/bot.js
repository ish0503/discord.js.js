const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")
const { GoogleGenerativeAI } = require("@google/generative-ai");

const translatte = require('translatte');
const fs = require('fs');

let botsetting = ""

fs.readFile('botsetting.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    botsetting = data
  });

const genAI = new GoogleGenerativeAI(process.env.GEMINI);

let history = [
    {
        role: "user",
        parts: botsetting.split("+"),
    },
    {
        role: "model",
        parts: [{text: "알겠어!"}, {text: " 난 이제 게헨나 학원의 학생회 만마전의 학생 **탄가 이부키**야!"}]
    }
]

const safe = {
    "HARM_CATEGORY_HARASSMENT": "BLOCK_NONE",
    "HARM_CATEGORY_HATE_SPEECH": "BLOCK_NONE",
    "HARM_CATEGORY_SEXUALLY_EXPLICIT": "BLOCK_NONE",
    "HARM_CATEGORY_DANGEROUS_CONTENT": "BLOCK_NONE",
};

module.exports = {
    data: new SlashCommandBuilder()

    .setName("챗봇")
    .setDescription("최첨단된 문명에서 나온 챗봇")
    .addSubcommand((subcommand) =>
        subcommand
        .setName("대화")
        .setDescription("챗봇과 대화하기")
        .addStringOption((options) =>
            options
              .setName("내용")
              .setDescription("대화할 내용을 입력해주세요.")
              .setMaxLength(1000)
              .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
        subcommand
        .setName("로그")
        .setDescription("챗봇과 대화한 기록 확인하기")
        .addIntegerOption((options) =>
            options
              .setName("수")
              .setDescription("대화 기록 몇개까지?")
              .setMaxValue(25)
              .setMinValue(1)
              .setRequired(true),
        ),
    ),
    /**
     * 
     * @param {import(*discord.js*).ChatInputCommandInteraction} interaction
     */
    async execute(interaction){
        const msg = await interaction.deferReply()
        if (interaction.options.getSubcommand() === "대화") {
            const args = interaction.options.getString("내용")
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safe})

            if (args == "delete_history"){
                history = [
                    {
                        role: "user",
                        parts: botsetting.split("+"),
                    },
                    {
                        role: "model",
                        parts: [{text: "알겠어!"}, {text: "난 이제 만마전의 학생 **탄가 이부키**야!"}]
                    }
                ]
                interaction.editReply(`성공적 기억 삭제`)
                return
            }

            try{
                console.log(history.length)
                if (history.length > 2){
                    history.forEach(element => {
                        if (!element.parts){
                            history.pop()
                            history.pop()
                        }
                    });
                }else{
                    history = [
                        {
                            role: "user",
                            parts: botsetting.split("\n"),
                        },
                        {
                            role: "model",
                            parts: [{text: "알겠어!"}, {text: "난 이제 만마전의 학생 **탄가 이부키**야!"}]
                        }
                    ]
                    let part2 = []
                    history[0].parts.forEach(element => {
                        part2.push({text: element}) 
                    });
                    history[0].parts = part2
                    console.log(history)
                }

                console.log(history)

                const chat = model.startChat({
                    history: history,
                    generationConfig: {
                        maxOutputTokens: 1200,
                        temperature: 1
                    },
                });
            
                const result = await chat.sendMessageStream(args);
        
                // console.log(result)
                // console.log(result.stream)

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

                translatte(text, {to: "ja"}).then(res => {
                    console.log(res.text);
                    const embed = new EmbedBuilder()
                    .addFields(
                        { name: interaction.user.username, value: args },
                        { name: `Bot`, value: res.text },
                    )
                    interaction.channel.send({ embeds: [embed] })

                }).catch(err => {
                    console.error(err);
                });

                
            }catch(err){
                console.log(err)

                if (err.message == "[GoogleGenerativeAI Error]: Candidate was blocked due to SAFETY"){
                    interaction.editReply(`에러: 부적절한 단어를 감지했습니다.\n\n**사용된 토큰: ${err.response.usageMetadata.candidatesTokenCount}**\n총 사용된 토큰: ${err.response.usageMetadata.totalTokenCount}`)
                }else if(err.message == "Received one or more errors"){
                    interaction.editReply(`에러: 말의 길이가 1024글자를 넘어섰습니다.`)
                }else{
                    interaction.editReply(`에러: ${err}`)
                }
            }
        }else if(interaction.options.getSubcommand() === "로그"){
            if (interaction.user.username != "birdnoob") return;
            const args = interaction.options.getInteger("수");
                let history2 = []
                history.forEach(element => {
                    history2.push(element)
                });
                history2.shift()
                history2.shift()
                let repeat = history2.length - args
                let i = 0
                while (i < repeat) {
                    i++
                    history2.shift()
                }
                const embed = new EmbedBuilder()
                history2.forEach(element => {
                    let msg = ""
                    element.parts.forEach(element => {
                        msg += element.text
                    });
                    embed.addFields(
                        { name: element.role, value: msg },
                    )
                });
                interaction.editReply({ embeds: [embed] })
                return
        }
    }
}
