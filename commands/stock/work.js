// 일하기 시스템
const { SlashCommandBuilder } = require("discord.js");
const gambling_Schema = require("../../models/stock");
const calculation_Schema = require("../../models/calculation");
const money_Schema = require("../../models/Money");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("일하기")
    .setDescription("회사에서 일을 하여 돈을 버세요.")
    .addStringOption((options) =>
        options
        .setName("대륙이름")
        .setDescription("일할 회사가 있는 대륙의 이름 입력해주세요.")
        .setRequired(true),
    )
    .addStringOption((options) =>
        options
        .setName("주식이름")
        .setDescription("일할 회사의 이름 입력해주세요.")
        .setRequired(true),
    ),

    /**
     * 
     * @param {import(*discord.js*).ChatInputCommandInteraction} interaction
     */
    async execute(interaction){
        //일하기 로직
        const args0 = interaction.options.getString("대륙이름");
        const args = interaction.options.getString("주식이름");

        const stock_find = await gambling_Schema.findOne({
             continentname: args0,
        }); 
    
        if (!stock_find) {
            interaction.reply({
                content: `대륙을 찾을수 없습니다. 제대로 입력했는지 확인해보세요.`,
            });
            return;
        }

        var companys = stock_find.companys
        var stock_find2 = companys.find((element) => element.name == args)

        if (!stock_find2) {
            interaction.reply({
                content: `**주식을 찾을수 없습니다.**`,
            });
            return;
        }

        if ((!stock_find2.employee || !stock_find2.employee.find((element) => element == interaction.user.id)) && !(stock_find2.ceo == interaction.user.id)){
            interaction.reply({
                content: `**${stock_find2.name}회사에서 일하기 위해서는 먼저 ${stock_find2.name}회사의 직원이 되어야합니다.**`,
            });
            return;
        }

        const money_find = await money_Schema.findOne({
            userid: stock_find2.ceo
        });
        
        const money_find2 = await money_Schema.findOne({
            userid: interaction.user.id
        });

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
            const collector = interaction.channel.createMessageCollector({ filter, time: 20000 });
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
            const message = interaction.reply(`문제를 보고 답을 채팅창에 적어주세요\n\n**${num1} ÷ ${num2} = ?\n(단, 소수 첫째자리에서 반올림한다.)**`)
            const filter = m => m.author.id === interaction.user.id;
            const collector = interaction.channel.createMessageCollector({ filter, time: 20000 });
            collector.on('collect', m => {
                var number = parseFloat(m.content)
                if (number == Math.round(num1 / num2).toFixed(1)) {
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
            //주식 연산력 늘어나는 로직
            var arr = []

            for (let index = 0; index < companys.length; index++) {
                const element = companys[index];
                if (element.name == args){
                arr.push({
                    type: element.type,
                    name: element.name, 
                    desc: element.desc, 
                    money: element.money,
                    lastmoney: element.lastmoney, 
                    firstmoney: element.firstmoney, 
                    ceo: element.ceo, 
                    perworkpay: element.perworkpay,
                    level: element.level, 
                    calculation: element.calculation + upcalculation, 
                    lastmaxbuy: element.lastmaxbuy, 
                    allmaxbuy: element.allmaxbuy, 
                    employee: element.employee
                })
                }else{
                arr.push(element)
                }
            }

            await gambling_Schema.updateOne(
                { continentname: args0 },
                { 
                minopentime: stock_find.minopentime, 
                maxopentime: stock_find.maxopentime,
                companys: arr 
                },
            );

            //플레이어 연산력 늘어나는 로직

            const calculation_find = await calculation_Schema.findOne({
                userid: interaction.user.id,
            });

            await calculation_Schema.updateOne(
            { userid: interaction.user.id },
            {
                calculation: (calculation_find?.calculation || 0) + upcalculation,
                career: (calculation_find?.career || 0)
            },
            {upsert: true}
            );

            // if (money_find.money < stock_find2.perworkpay * upcalculation){
            //     interaction.followUp(`**${stock_find2.name}회사에서 일했습니다. ceo의 돈이 부족하여 당신에게 돈을 줄 수 없습니다.\n연산력 +${upcalculation}**\n\n자신의 현재 연산력: ${(calculation_find?.calculation || 0) + upcalculation}\n회사의 현재 연산력: ${stock_find2.calculation + upcalculation}`)
            // }else {
                await money_Schema.updateOne(
                    { userid: stock_find2.ceo },
                    { 
                        money: Number(money_find?.money || 0) - stock_find2.perworkpay * upcalculation, 
                        cooltime: (money_find?.cooltime || -10000000) 
                    },
                    { upsert: true }
                );
                await money_Schema.updateOne(
                    { userid: interaction.user.id },
                    {
                        money: Number(money_find2?.money || 0) + stock_find2.perworkpay * upcalculation,
                        cooltime: (money_find2?.cooltime || -10000000)
                    },
                    { upsert: true }
                );
                interaction.followUp(`**${stock_find2.name}회사에서 일했습니다.\n돈 + ${stock_find2.perworkpay * upcalculation}$(ceo -> 당신)\n연산력 +${upcalculation}**\n\n자신의 현재 연산력: ${(calculation_find?.calculation || 0) + upcalculation}\n회사의 현재 연산력: ${stock_find2.calculation + upcalculation}`)
            //}
            }
        }
}
