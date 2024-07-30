const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const gambling_Schema = require("../../models/Money")
const heart_Sechma = require("../../models/level")
const bank_Schema = require("../../models/bank")
const calculation_Schema = require("../../models/calculation")

const bank = require("../stock/bank")

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

        const bank_find = await bank_Schema.findOne({
            userid:interaction.user.id
        })

        const calculation_find = await calculation_Schema.findOne({
            userid: interaction.user.id
        })

        console.log(bank)
            const embed = new EmbedBuilder().setDescription(
            `**${
                interaction.user
            }님의 재화는 총 ${Number((gambling_find?.money || 0)).toLocaleString()}입니다.\n
            lv: ${Number(heart_find?.level || 0).toLocaleString()}\n저축한 양: ${(bank_find?.bankmoney || 0)} (+${(bank_find?.bankmoney || 0) * (bank.금리 / 100) * (bank_find?.bankmoneycount || 0)})\n대출한 양: ${(bank_find?.interestmoney || 0)} (+${(bank_find?.interestmoney || 0) * (bank.금리 / 100) * (bank_find?.interestcount || 0)})\n연산량: ${(calculation_find?.calculation || 0)}\n경력: ${(calculation_find?.career || 0)}**`
        ).setColor("Green")

        interaction.reply({embeds: [embed]})
    }
}
