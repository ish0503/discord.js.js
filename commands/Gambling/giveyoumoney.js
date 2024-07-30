const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const gambling_Schema = require("../../models/Money")
const comma = require("comma-number")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("송금")
    .setDescription("돈을 다른사람에게 주세요.")
    .addUserOption((option) => 
        option
        .setName('유저')
        .setDescription('돈을 받을 유저')
        .setRequired(true)
    )
    .addNumberOption(option => 
        option
        .setName('수치')
        .setDescription('돈을 줄 수치')
        .setRequired(true)
    ),

    /**
     * 
     * @param {import(*discord.js*).ChatInputCommandInteraction} interaction
     */
    async execute(interaction){
        const number = interaction.options.getNumber('수치');
        const user = interaction.options.getUser('유저')
        const id = user?.id
        var userID = interaction.user.id;

        const gambling_find = await gambling_Schema.findOne({
            userid:id
        })

        const gambling_find2 = await gambling_Schema.findOne({
            userid:userID
        })

        if (!(gambling_find && gambling_find2)){
            interaction.reply({
                content: `**두 사람 모두 돈 데이터가 있어야 합니다.**`,
            });
            return;
        }

        if (gambling_find2.money < number){
            interaction.reply({
                content: `**당신에게 없는 돈을 이 사람에게 줄 수 없습니다.**`,
            });
            return;
        }

        if (number <= 0){
            interaction.reply({
                content: `**이 사람 나쁜사람이네 이거 ㅋㅋ**`,
            });
            return;
        }

        await gambling_Schema.updateOne(
            {userid: userID},
            {money: Number(gambling_find2.money) - number, cooltime: gambling_find2.cooltime},
            {upsert:true}
        );

        await gambling_Schema.updateOne(
            {userid: id},
            {money: Number(gambling_find?.money || 0) + number, cooltime: gambling_find.cooltime},
            {upsert:true}
        );

        const embed = new EmbedBuilder()
            .setDescription(
                `**💰 ${
                    number.toLocaleString()
                }재화가 ${user?.tag}님께 전달되었습니다.**`
            )
            .setColor("Green");
        
        interaction.reply({embeds: [embed]});
            
    }
}