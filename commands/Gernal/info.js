const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("도움")
    .setDescription("이 봇은 어떤 봇인가요?"),

    /**
     * 
     * @param {import(*discord.js*).ChatInputCommandInteraction} interaction
     */
    async execute(interaction){
        interaction.reply({content: "# > 하나디 월드에 오신것을 환영합니다!"})
        interaction.channel.send({content: "* 하나디 월드는 무슨 봇인가요?", ephemeral: true})
        interaction.channel.send({content: "하나디 월드는 전체적으로 하나의 RPG 월드 입니다!", ephemeral: true})
        interaction.channel.send({content: "그리고 여러 컨텐츠를 제공하고 있죠.", ephemeral: true})
        interaction.channel.send({content: "```1. 돈\n이 월드의 가장 주된 화폐가 되는 돈입니다. 지원금, 사냥, PVP 등으로 얻을 수 있습니다.\n\n2. 강화\n돈을 지불하여 자신만의 이름을 가진 아이템을 생성하실 수 있습니다. 아이템은 사냥, PVP에서 사용 할 수 있으며, /아이템 강화로 아이템을 강화 하실 수 있습니다.\n\n3. 은행\n돈이 긴급하게 필요한경우, /은행 대출로 은행에서 돈을 대출 받을 수 있습니다. 대출 최대 금액은 신용 등급에 따라 달라집니다. 또한, /은행 저축으로 은행에서 돈을 저축할 수 있습니다. 각각의 대출금, 저축금은 하루마다 이자가 붙습니다.```", ephemeral: true})
        interaction.channel.send({content: "하나디 월드는 제작자의 기분에 따라 업데이트가 됩니다 하하", ephemeral: true})
    }
}