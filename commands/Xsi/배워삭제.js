const Schema = require("../../models/learning")
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("까먹기")
    .setDescription("봇이 낱말을 까먹습니다")
    .addStringOption(options => options
        .setName("낱말")
        .setDescription("봇이 까먹을 낱말을 입력해 주세요")
        .setRequired(true)
    ),
    /**
     * 
     * @param {import(*discord.js*).ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        await interaction.deferReply();
        const text1 = interaction.options.getString("낱말")
        console.log(text1)
        const find = await Schema.findOne({ word: text1.trim() })
        console.log(find)
        if (find) {
            if (find.userid == interaction.member.id){
                await Schema.deleteMany(find)

                const embed = new EmbedBuilder()
                    .setTitle("봇이 단어를 잊었어요!")
                    .setColor("Green")
                    embed.addFields({name: `단어 : ${text1.trim()}, 뜻 : `, value: `..뭐더라?`})
                    .setThumbnail(interaction.member.displayAvatarURL())
                interaction.editReply({ embeds: [embed] })
                }else {
                    interaction.editReply({ content: "으에? 님이 가르친 단어만 지울 수 있어요!", ephemeral: true }) 
                }
        }else{
            interaction.editReply({ content: "으에? 전 애초에 그 단어 뜻을 모르는데요?!", ephemeral: true }) 
        }
    }
}