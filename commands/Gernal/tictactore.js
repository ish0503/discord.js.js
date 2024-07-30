const { SlashCommandBuilder } = require("discord.js");
const simplyDjs = require("simply-djs")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("틱택토")
    .setDescription("봇과 함께 무조건 비기는 틱택토를..(지면 바보)"),

    /**
     * 
     * @param {import(*discord.js*).ChatInputCommandInteraction} interaction
     */
    async execute(interaction){
        await simplyDjs.tictactoe(interaction, {
            strict: false, 
            hard: true,
        })
    }
}
