//알바 시스템
const { SlashCommandBuilder } = require("discord.js");
//const gambling_Schema = require("../../models/stock");
const calculation_Schema = require("../../models/calculation");
const money_Schema = require("../../models/Money");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("알바")
    .setDescription("알바를 하여 돈을 버세요."),

    /**
     * 
     * @param {import(*discord.js*).ChatInputCommandInteraction} interaction
     */
    async execute(interaction){
        //알바 로직
        const gambling_find = await money_Schema.findOne({
            userid:interaction.user.id
        })

        //사칙연산 로직
        var upcalculation = 1
        var random = Math.floor(Math.random() * 3 + 1)
        var num1 = Math.floor(Math.random() * 98 + 1)
        var num2 = Math.floor(Math.random() * 8 + 1)
        if (random == 1){ //덧셈
            const message = interaction.reply(`문제를 보고 답을 채팅창에 적어주세요\n\n**${num1} + ${num2} = ?**`)
            const filter = m => m.author.id === interaction.user.id;
            const collector = interaction.channel.createMessageCollector({ filter, time: 10000 });
            collector.on('collect', m => {
                var number = parseInt(m.content)
                if (number == num1 + num2) {
                    reward()
                    collector.stop()
                   // interaction.deleteReply()
                }else{
                    interaction.followUp(`오답입니다..`);
                    collector.stop()
                   // interaction.deleteReply()
                }
            });
            collector.on('end', collected => {
                if (collected.size == 0) {
                    interaction.followUp({content: `시간이 초과되었습니다.`});
                  //  interaction.deleteReply()
                }
            });
        }else if (random == 2){//뺄셈
            const message = interaction.reply(`문제를 보고 답을 채팅창에 적어주세요\n\n**${num1} - ${num2} = ?**`)
            const filter = m => m.author.id === interaction.user.id;
            const collector = interaction.channel.createMessageCollector({ filter, time: 10000 });
            collector.on('collect', m => {
                var number = parseInt(m.content)
                if (number == num1 - num2) {
                    reward()
                    collector.stop()
                    //interaction.deleteReply()
                }else{
                    interaction.followUp(`오답입니다..`);
                    collector.stop()
                    //interaction.deleteReply()
                }
            });
            collector.on('end', collected => {
                if (collected.size == 0) {
                    interaction.followUp({content: `시간이 초과되었습니다.`});
                   // interaction.deleteReply()
                }
            });
        }else if (random == 3){//곱셈
            upcalculation = 3
            const message = interaction.reply(`문제를 보고 답을 채팅창에 적어주세요\n\n**${num1} X ${num2} = ?**`)
            const filter = m => m.author.id === interaction.user.id;
            const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });
            collector.on('collect', m => {
                var number = parseInt(m.content)
                if (number == num1 * num2) {
                    reward()
                    collector.stop()
                    //interaction.deleteReply()
                }else{
                    interaction.followUp(`오답입니다..`);
                    collector.stop()
                   // interaction.deleteReply()
                }
            });
            collector.on('end', collected => {
                if (collected.size == 0) {
                    interaction.followUp({content: `시간이 초과되었습니다.`});
                    //interaction.deleteReply()
                }
            });
        }else if (random >= 4){//나눗셈
            upcalculation = 3
            const message = interaction.reply(`문제를 보고 답을 채팅창에 적어주세요\n\n**${num1} ÷ ${num2} = ?\n(단, 최대 소수 첫째자리까지 나타낸다.)**`)
            const filter = m => m.author.id === interaction.user.id;
            const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });
            collector.on('collect', m => {
                var number = parseFloat(m.content).toFixed(1)
                if (number == (num1 / num2).toFixed(1)) {
                    reward()
                    collector.stop()
                    //interaction.deleteReply()
                }else{
                    interaction.followUp(`오답입니다..`);
                    collector.stop()
                    //interaction.deleteReply()
                }
            });
            collector.on('end', collected => {
                if (collected.size == 0) {
                    interaction.followUp({content: `시간이 초과되었습니다.`});
                    //interaction.deleteReply()
                }
            });

        }

        async function reward(){
            //플레이어 경력 늘어나는 로직

            const calculation_find = await calculation_Schema.findOne({
                userid: interaction.user.id,
            });

            await calculation_Schema.updateOne(
            { userid: interaction.user.id },
            {
                calculation: (calculation_find?.calculation || 0),
                career: (calculation_find?.career || 0) + upcalculation
            },
            {upsert: true}
            );

            await money_Schema.updateOne(
                {userid: interaction.user.id},
                {money: Number(gambling_find?.money || 0) + upcalculation * 100, cooltime: (gambling_find?.cooltime || -10000000)},
                {upsert:true}
            );

            interaction.followUp(`**알바를 완료하였습니다. 경력 +${upcalculation}, 돈 +${upcalculation * 100}**\n\n자신의 현재 경력: ${(calculation_find?.career || 0) + upcalculation}\n자신의 현재 돈: ${(Number(gambling_find?.money || 0) + upcalculation * 100).toLocaleString()}`)
        }
    }
}
