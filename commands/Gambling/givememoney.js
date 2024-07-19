const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const gambling_Schema = require("../../models/Money")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("지원금")
    .setDescription("공짜로! 당신께 돈을 줄 수 있습니다."),

    /**
     * 
     * @param {import(*discord.js*).ChatInputCommandInteraction} interaction
     */
    async execute(interaction){
        const 지원금 = 30000
        const gambling_find = await gambling_Schema.findOne({
            userid:interaction.user.id
        })

        if (gambling_find){
            const canGiveTime = Number(gambling_find.cooltime) + (30 * 60 * 1000)
            if (canGiveTime && canGiveTime > Date.now()){
                interaction.reply({
                    content: `**나도 돈 열심히 모으고 있으니까...\n<t:${Math.round(
                        canGiveTime / 1000
                    )}> (<t:${Math.round(canGiveTime / 1000)}:R>)에 받아!**`,
                });
                return;
            }
        }

        await gambling_Schema.updateOne(
            {userid: interaction.user.id},
            { money: Number(gambling_find?.money || 0) + 지원금, cooltime: Date.now()},
            {upsert:true}
        );

        const moneyvalue = Number(gambling_find?.money || 0) + 지원금

        const embed = new EmbedBuilder()
            .setDescription(
                `**💰 여기 돈! 지갑에 총 ${
                    moneyvalue.toLocaleString()
                }엔이 있네! +${지원금}¥**`
            )
            .setColor("Green");
        
        interaction.reply({embeds: [embed]});
            
    }
}