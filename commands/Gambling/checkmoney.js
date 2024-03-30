const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const gambling_Schema = require("../../models/Money")
const heart_Sechma = require("../../models/level")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("정보확인")
    .setDescription("당신의 정보를 확인할 수 있습니다."),

    /**
     * 
     * @param {import(*discord.js*).ChatInputCommandInteraction} interaction
     */
    async execute(interaction){
        const gambling_find = await gambling_Schema.findOne({
            userid:interaction.user.id
        })

        const heart_find = await heart_Sechma.findOne({
            userid:interaction.user.id
        })

            const embed = new EmbedBuilder().setDescription(
            `**${
                interaction.user
            }님의 재화는 총 ${Number((gambling_find?.money || 0)).toLocaleString()}입니다.\n
            lv: ${Number(heart_find?.level || 0).toLocaleString()}**`
        ).setColor("Green")

        interaction.reply({embeds: [embed]})
    }
}
