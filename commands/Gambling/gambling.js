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

        interaction.reply("이부키가 센세를 위한 옵션을 찾고 있어..")

        const confirm = new ButtonBuilder()
        .setCustomId(`옵션1`)
        .setLabel(`확률 45~50%, 보상 2배!`)
        .setStyle(ButtonStyle.Success)
        .setEmoji('1113784802127126548');

        const confirm2 = new ButtonBuilder()
        .setCustomId(`옵션2`)
        .setLabel(`확률 23~25%, 보상 4배!!`)
        .setStyle(ButtonStyle.Primary)
        .setEmoji('1204059769380282368');

        const confirm3 = new ButtonBuilder()
        .setCustomId(`옵션3`)
        .setLabel(`확률 9~10%, 보상 10배!!!`)
        .setStyle(ButtonStyle.Danger)
        .setEmoji('1182871316181827634');
    
        const row = new ActionRowBuilder()
            .addComponents(confirm, confirm2, confirm3);
    
        const msg = await interaction.editReply({
            content: `큰 판 해볼랭?`,
            components: [row],
        });

        const collector = msg.createMessageComponentCollector({
            time: 30_000,
            max: 1
        })
    
        collector.on("collect", async (inter) => {
        console.log(inter.user)
        console.log(inter)
        console.log(inter.customId)
        try{
            
        }catch (error){
            console.log(error);
            interaction.editReply({
                content: "error: "+error
            })
        }
        })

        collector.on('end', collected => {
            console.log(`센세의 도박 시간 ${collected.size} 이 끝났어`);
        });

        const win_standard = Math.round(Math.random() * 100)
        const random_number = Math.round(Math.random() * 100)

        if (win_standard > random_number){
            //이김
            await gambling_Schema.updateOne(
                {userid:interaction.user.id},
                {money:Number(gambling_find.money) + bettingGold}
            )

            const embed = new EmbedBuilder()
            .setTitle(`승리!`)
            .setColor("Green")
            .setDescription(`**와..! 대단해! ${win_standard}% 확률에서 이겼어!\n+${bettingGold.toLocaleString()}**`)

            interaction.editReply({embeds:[embed]})
        } else {
            //짐
            await gambling_Schema.updateOne(
                {userid:interaction.user.id},
                {money:Number(gambling_find.money) - bettingGold}
            )

            const embed = new EmbedBuilder()
            .setTitle(`패배..`)
            .setColor("Red")
            .setDescription(`**에.. ${win_standard}% 확률에서 졌어,,\n-${bettingGold.toLocaleString()}**`)

            interaction.editReply({embeds:[embed]})
        }
        
    }
}
