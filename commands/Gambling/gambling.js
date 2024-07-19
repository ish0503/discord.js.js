const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const gambling_Schema = require("../../models/Money")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("돈베팅")
    .setDescription("대박 혹은 쪽박! 당신의 운을 시험해보세요.")
    .addIntegerOption((f) =>
        f
        .setName("베팅금")
        .setDescription("베팅 금액을 입력해주세요.")
        .setRequired(true)
        .setMinValue(100)
    ),
    /**
     * 
     * @param {import(*discord.js*).ChatInputCommandInteraction} interaction
     */
    async execute(interaction){
        const bettingGold = interaction.options.getInteger("베팅금",true)
        const gambling_find = await gambling_Schema.findOne({
            userid:interaction.user.id
        })

        if (!gambling_find){
            interaction.reply({
                content: `**센세.. 돈 데이터 없으면 못해, 알고 있지?＞﹏＜**`
            })
            return
        }

        if(gambling_find.money < bettingGold){
            interaction.reply({content:`**돈이 업쪄..**`})
            return
        }

        const win_standard = Math.round(Math.random() * 100)
        const random_number = Math.round(Math.random() * 100)

        if (win_standard > random_number){
            //이김
            await gambling_Schema.updateOne(
                {userid:interaction.user.id},
                {money:Number(gambling_find.money) + bettingGold}
            )

            const embed = new EmbedBuilder()
            .setTitle(`승리하였습니다!`)
            .setColor("Green")
            .setDescription(`**와..! 대단해! ${win_standard}% 확률에서 이겼어!\n+${bettingGold.toLocaleString()}**`)

            interaction.reply({embeds:[embed]})
        } else {
            //짐
            await gambling_Schema.updateOne(
                {userid:interaction.user.id},
                {money:Number(gambling_find.money) - bettingGold}
            )

            const embed = new EmbedBuilder()
            .setTitle(`패배하셨습니다..`)
            .setColor("Red")
            .setDescription(`**에.. ${win_standard}% 확률에서 졌어,,\n-${bettingGold.toLocaleString()}**`)

            interaction.reply({embeds:[embed]})
        }
        
    }
}
