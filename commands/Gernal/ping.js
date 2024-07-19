const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()

    .setName("핑")
    .setDescription("봇과 자신의 핑 확인"),
    /**
     * 
     * @param {import(*discord.js*).ChatInputCommandInteraction} interaction
     */
    async execute(interaction){

        const msg = await interaction.deferReply()
        
        const embed = new EmbedBuilder()
        .setTitle(`🏓퐁!`)
        .setDescription(`🏓 커맨드 핑: ${msg.createdTimestamp - interaction.createdTimestamp}ms\n🏓 Api 핑 : ${interaction.client.ws.ping}ms`)
        .setColor(0xFFFF00)

        interaction.editReply({ embeds: [embed] })
    }
}
