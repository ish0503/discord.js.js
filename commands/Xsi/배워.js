const Schema = require("../../models/learning")
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("배우기")
    .setDescription("봇이 낱말을 학습합니다")
    .addStringOption(options => options
        .setName("낱말")
        .setDescription("봇이 학습할 낱말을 입력해 주세요")
        .setRequired(true)
        .setMaxLength(30)
    )
    .addStringOption(options => options
        .setName("뜻")
        .setDescription("봇이 학습할 낱말의 뜻을 입력해 주세요")
        .setRequired(true)
        .setMaxLength(300)
    ),
    /**
     * 
     * @param {import(*discord.js*).ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        function randomDigitCharactersSpecialCharacterslength(lenth){
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`{}[]:;<>?,./|";
            for( var i=0; i < lenth; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        }
        await interaction.deferReply();
        const text1 = interaction.options.getString("낱말")
        const text2 = interaction.options.getString("뜻")
        console.log(text1)
        const find = await Schema.findOne({ word: text1.trim() })
        if (find) {
            interaction.editReply({ content: "이미 저장되어 있는 단어입니다", ephemeral: true }) 
            return
        }
        var datam = randomDigitCharactersSpecialCharacterslength(15)
        const isfind = await Schema.findOne({ data: datam })
        console.log(isfind)
        while (isfind){
            console.log(isfind)
            datam = randomDigitCharactersSpecialCharacterslength(15)
        }
        await Schema.updateOne(
            {data: datam},
            {userid: interaction.member.id, word: text1.trim(), meaning: text2.trim()},
            {upsert:true},
        );
        const embed = new EmbedBuilder()
            .setTitle("봇이 단어를 학습했어요!")
            .setColor("Green")
            //.setTimestamp()
            embed.addFields({name: `단어 : ${text1.trim()}, 뜻 : ${text2.trim()}`, value: `이렇게 입력해 보세요 !, 야 ${text1}`})
            .setThumbnail(interaction.member.displayAvatarURL())
        interaction.editReply({ embeds: [embed] })
    }
}
