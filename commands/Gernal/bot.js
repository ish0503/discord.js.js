const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")
const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");

const client = require("../../index")

const translatte = require('translatte');
const fs = require('fs');
const request = require('request');

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

const safe = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_UNSPECIFIED,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
];

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
        .setName("이미지")
        .setDescription("이미지 해석")
        .addStringOption((options) =>
            options
              .setName("내용")
              .setDescription("해석할 내용을 입력해주세요.")
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
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro", safe})

            if (args == "delete_history" && interaction.user.username == "birdnoob"){
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
            }else if (args == "back_history" && interaction.user.username == "birdnoob"){
                history.pop()
                history.pop()
                interaction.editReply(`성공적 기억 되돌리기`)
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
        }else if(interaction.options.getSubcommand() === "이미지"){
            await interaction.editReply("이미지를 보내주세요.")

            var event = async function (message) {
                console.log("이벤트 받음")
                try{
                    if (Array.from(message.attachments.values()).length <= 0 || Array.from(message.attachments.values()).length != 1) {
                        client.removeListener('messageCreate',event)
                        interaction.editReply("인식 실패. 이미지 하나를 보내주세요. event 취소되었습니다. 명령어를 다시 실행해주세요.") 
                        return
                    }
                    client.removeListener('messageCreate',event)
                    message.reply("인식되었습니다.")
                    let messageAttachment = Array.from(message.attachments.values())[0].url
                    var download = async function(uri, filename, callback){
                        request.head(uri, function(err, res, body){
                            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                        });
                    };
                    
                    await download(messageAttachment, "file.png", async function(){
                        try{
                            const prompt = interaction.options.getString("내용");
                            const image = {
                                inlineData: {
                                data: Buffer.from(fs.readFileSync("file.png")).toString("base64"),
                                mimeType: "image/png",
                                },
                            };
                            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safe})
                            
                            result = await model.generateContent([prompt, image])
                            const embed = new EmbedBuilder()
                            .addFields(
                                { name: interaction.user.username, value: prompt },
                                { name: `Bot`, value: result.response.text() },
                            )
                            if (result.response.candidates){
                                embed.addFields(
                                    { name: '\u200B', value: '\u200B' },
                                    { name: '음란물 정도', value: result.response.candidates[0].safetyRatings[0].probability, inline: true },
                                    { name: '증오심 표현정도', value: result.response.candidates[0].safetyRatings[1].probability, inline: true },
                                    { name: '괴롭힘 정도', value: result.response.candidates[0].safetyRatings[2].probability, inline: true },
                                    { name: '위험 정도', value: result.response.candidates[0].safetyRatings[3].probability, inline: true },
                                )
                                console.log(result.response.candidates[0].safetyRatings[0].probability) //HARM_CATEGORY_SEXUALLY_EXPLICIT
                                console.log(result.response.candidates[0].safetyRatings[1].probability) //HARM_CATEGORY_HATE_SPEECH
                                console.log(result.response.candidates[0].safetyRatings[2].probability) //HARM_CATEGORY_HARASSMENT
                                console.log(result.response.candidates[0].safetyRatings[3].probability) //HARM_CATEGORY_DANGEROUS_CONTENT
                            }
                            interaction.channel.send({ embeds: [embed] }) 
                        }catch(err){
                            console.log(err)

                            if (err.message == "[GoogleGenerativeAI Error]: Candidate was blocked due to SAFETY"){
                                interaction.editReply(`에러: 부적절한 이미지를 감지했습니다.\n\n**사용된 토큰: ${err.response.usageMetadata.candidatesTokenCount}**\n총 사용된 토큰: ${err.response.usageMetadata.totalTokenCount}`)
                            }else if(err.message == "Received one or more errors"){
                                interaction.editReply(`에러: 말의 길이가 1024글자를 넘어섰습니다.`)
                            }else if (result.response.promptFeedback.blockReason == 'OTHER'){
                                interaction.editReply(`에러: 검열되었습니다.`)
                            }else{
                                interaction.editReply(`에러: ${err}`)
                            }
                        }
                    });
                }catch(err){
                    console.log(err)

                    if (err.message == "[GoogleGenerativeAI Error]: Candidate was blocked due to SAFETY"){
                        interaction.editReply(`에러: 부적절한 이미지를 감지했습니다.\n\n**사용된 토큰: ${err.response.usageMetadata.candidatesTokenCount}**\n총 사용된 토큰: ${err.response.usageMetadata.totalTokenCount}`)
                    }else if(err.message == "Received one or more errors"){
                        interaction.editReply(`에러: 말의 길이가 1024글자를 넘어섰습니다.`)
                    }else{
                        interaction.editReply(`에러: ${err}`)
                    }
                }
            }

            client.on('messageCreate', event)
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
