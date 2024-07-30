const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const gambling_Schema = require("../../models/Money")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("돈순위")
    .setDescription("돈이 누가 제일 많은지 봅니다."),

    /**
     * 
     * @param {import(*discord.js*).ChatInputCommandInteraction} interaction
     */
    async execute(interaction){
        const gambling_find = await gambling_Schema
        .find()
        .sort([["money","descending"]])
        .limit(10)
        .exec();

        // for (let i = 0; i < gambling_find.length; i++){
        //     gambling_find[i].money = Number(gambling_find[i].money)
        // }
        
        console.log(gambling_find)

        const embed = new EmbedBuilder()
        .setTitle(`${interaction.client.user.username} 재화 순위 💰`)
        .setColor("Green")
        .setThumbnail(interaction.client.user.displayAvatarURL());

        for (let i = 0; i < gambling_find.length; i++){
            const user = await interaction.client.users.fetch(
                gambling_find[i].userid
            )
            embed.addFields({
                name: `${i + 1}. ${user.username}`,
                value: `${interaction.client.user.username} 돈 : ${Number(gambling_find[i].money).toLocaleString()}재화`
            })
        }

        interaction.reply({embeds : [embed]})
    }
}
