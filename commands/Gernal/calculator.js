const { SlashCommandBuilder } = require("discord.js");
const simplyDjs = require("simply-djs")
//이거 없으면 오류생기던데 없애지 마라
//계산기 없애긴 해야됨
module.exports = {
    data: new SlashCommandBuilder()
    .setName("계산기")
    .setDescription("봇은 간단한 계산도 잘합니다."),

    /**
     * 
     * @param {import(*discord.js*).ChatInputCommandInteraction} interaction
     */
    async execute(interaction){
        await simplyDjs.calculator(interaction)
    }
}
