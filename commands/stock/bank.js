const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const money_Schema = require("../../models/Money")
const bank_Schema = require("../../models/bank")

const 금리 = 1 // 단위: 퍼센트(%)

module.exports = {
    금리: 금리,
    data: new SlashCommandBuilder()
    .setName("은행")
    .setDescription("은행 명령어 입니다.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("저축")
        .setDescription("돈을 저축할 수 있습니다.")
        .addIntegerOption((options) =>
          options
            .setName("금액")
            .setDescription("저축할 금액을 입력해주세요.")
            .setMinValue(1000)
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("인출")
        .setDescription("저축한 돈을 인출할 수 있습니다.")
        .addIntegerOption((options) =>
          options
            .setName("금액")
            .setDescription("인출할 금액을 입력해주세요.")
            .setMinValue(1000)
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
        subcommand
        .setName("대출")
        .setDescription("돈을 대출받을 수 있습니다.")
        .addIntegerOption((options) =>
            options
            .setName("금액")
            .setDescription("대출받을 금액을 입력해주세요.")
            .setMinValue(1000)
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("대출금상환")
            .setDescription("대출받은 돈을 이자까지 포함해서 상환 합니다.")
            .addIntegerOption((options) =>
                options
                    .setName("금액")
                    .setDescription("대출상환할 금액을 입력해주세요.")
                    .setMinValue(1)
                    .setRequired(true),
            ),
    )
    ,

    /**
     * 
     * @param {import(*discord.js*).ChatInputCommandInteraction} interaction
     */
    async execute(interaction){
        if (interaction.options.getSubcommand() === "저축") {
            let today = new Date(); 
            const args = interaction.options.getInteger("금액");
            const bank_find = await bank_Schema.findOne({
                userid:interaction.user.id
            })

            const money_find = await money_Schema.findOne({
                userid:interaction.user.id
            })

            if (!money_find){
                interaction.reply({ content: `**잔액이 부족해요**\n현재 잔액: ${Number(money_find?.money || 0).toLocaleString()}` })
                return
            }

            if  (money_find.money < args){
                interaction.reply({content:`**잔액이 부족해요**\n현재 잔액: ${Number(money_find?.money || 0).toLocaleString()}`})
                return
            }

            await money_Schema.updateOne(
                {userid: interaction.user.id},
                { money: Number(money_find?.money || 0) - args, cooltime: (money_find?.cooltime || -10000000)},
                {upsert:true}
            );

            await bank_Schema.updateOne(
                {userid: interaction.user.id},
                { 
                    bankmoney: Number(bank_find?.bankmoney || 0) + args, 
                    bankmoneytime: today.getDate(),
                    bankmoneycount: (bank_find?.bankmoneycount || 0),
                    interestmoney: (bank_find?.interestmoney || 0),
                    interesttime: (bank_find?.interesttime || -1),
                    interestcount: (bank_find?.interestcount || 0),
                    creditrating: (bank_find?.creditrating || 5),
                },
                {upsert:true}
            );

            const embed = new EmbedBuilder()
            .setDescription(`**💰저축이 되었습니다. -${args.toLocaleString()}$\n현재 남은 돈: ${(Number(money_find?.money || 0) - args).toLocaleString()}\n남은 저축금액: ${(Number(bank_find?.bankmoney || 0) + args).toLocaleString()}**`)
            .setColor("Green");
        
            interaction.reply({embeds: [embed]});
        }else if (interaction.options.getSubcommand() === "인출") {
            const args = interaction.options.getInteger("금액");
            const bank_find = await bank_Schema.findOne({
                userid:interaction.user.id
            })

            const money_find = await money_Schema.findOne({
                userid:interaction.user.id
            })

            if  ((bank_find?.bankmoney || 0) < args){
                interaction.reply({content:`**인출 할 수 있는 금액을 초과했어요**\n현재 인출 할 수 있는 금액: ${Number(bank_find?.bankmoney || 0).toLocaleString()}`})
                return
            }

            await money_Schema.updateOne(
                {userid: interaction.user.id},
                { 
                    money: Number(money_find?.money || 0) + args + Math.round(args * (금리 / 100) * (bank_find?.bankmoneycount || 0)), 
                    cooltime: (money_find?.cooltime || -10000000)
                },
                {upsert:true}
            );

            await bank_Schema.updateOne(
                {userid: interaction.user.id},
                { 
                    bankmoney: Number(bank_find?.bankmoney || 0) - args, 
                    bankmoneytime: -1,
                    bankmoneycount: 0,
                    interestmoney: (bank_find?.interestmoney || 0),
                    interesttime: (bank_find?.interesttime || -1),
                    interestcount: (bank_find?.interestcount || 0),
                    creditrating: (bank_find?.creditrating || 5),
                },
                {upsert:true}
            );

            const embed = new EmbedBuilder()
            .setDescription(`**💰인출이 되었습니다. +${(args + Math.round(args * (금리 / 100) * (bank_find?.bankmoneycount || 0))).toLocaleString()}$\n남은 돈: ${(Number(money_find?.money || 0) + args + Math.round(args * (금리 / 100) * (bank_find?.bankmoneycount || 0))).toLocaleString()}\n남은 저축금액: ${(Number(bank_find?.bankmoney || 0) - args).toLocaleString()}**`)
            .setColor("Green");
        
            interaction.reply({embeds: [embed]});
        }else if (interaction.options.getSubcommand() === "대출") {
            const args = interaction.options.getInteger("금액");
            const bank_find = await bank_Schema.findOne({
                userid:interaction.user.id
            })

            const money_find = await money_Schema.findOne({
                userid:interaction.user.id
            })
            if (((bank_find?.creditrating || 5) == 5) && ((bank_find?.interestmoney || 0) + args) > 50000){
                interaction.reply({
                    content: `**신용등급이 모자라 돈을 대출할 수 없습니다.**\n현재 신용등급: ${(bank_find?.creditrating || 5)}등급\n최대 대출가능 금액: 5만`,
                });
                return;
            }else if (((bank_find?.creditrating || 5) == 4) && ((bank_find?.interestmoney || 0) + args) > 100000){
                interaction.reply({
                    content: `**신용등급이 모자라 돈을 대출할 수 없습니다.**\n현재 신용등급: ${(bank_find?.creditrating || 5)}등급\n최대 대출가능 금액: 10만`,
                });
                return;
            }else if (((bank_find?.creditrating || 5) == 3) && ((bank_find?.interestmoney || 0) + args) > 200000){
                interaction.reply({
                    content: `**신용등급이 모자라 돈을 대출할 수 없습니다.**\n현재 신용등급: ${(bank_find?.creditrating || 5)}등급\n최대 대출가능 금액: 20만`,
                });
                return;
            }else if (((bank_find?.creditrating || 5) == 2) && ((bank_find?.interestmoney || 0) + args) > 500000){
                interaction.reply({
                    content: `**신용등급이 모자라 돈을 대출할 수 없습니다.**\n현재 신용등급: ${(bank_find?.creditrating || 5)}등급\n최대 대출가능 금액: 50만`,
                });
                return;
            }else if (((bank_find?.creditrating || 5) == 1) && ((bank_find?.interestmoney || 0) + args) > 1000000){
                interaction.reply({
                    content: `**신용등급이 모자라 돈을 대출할 수 없습니다.**\n현재 신용등급: ${(bank_find?.creditrating || 5)}등급\n최대 대출가능 금액: 100만`,
                });
                return;
            }

            await money_Schema.updateOne(
                {userid: interaction.user.id},
                { money: Number(money_find?.money || 0) + args, cooltime: (money_find?.cooltime || -10000000)},
                {upsert:true}
            );

            let today = new Date(); 

            await bank_Schema.updateOne(
                {userid: interaction.user.id},
                { 
                    bankmoney: (bank_find?.bankmoney || 0), 
                    bankmoneytime: (bank_find?.bankmoneytime || 0),
                    bankmoneycount: (bank_find?.bankmoneycount || 0),
                    interestmoney: (bank_find?.interestmoney || 0) + args,
                    interesttime: today.getDate(),
                    interestcount: (bank_find?.interestcount || 0),
                    creditrating: (bank_find?.creditrating || 5),
                },
                {upsert:true}
            );

            const embed = new EmbedBuilder()
            .setDescription(`**💰대출이 되었습니다. +${args.toLocaleString()}$\n남은 돈: ${(Number(money_find?.money || 0) + args).toLocaleString()}\n총 대출금액: ${((bank_find?.interestmoney || 0) + args).toLocaleString()}**`)
            .setColor("Green");
        
            interaction.reply({embeds: [embed]});
        } else if (interaction.options.getSubcommand() === "대출금상환") {
            const args = interaction.options.getInteger("금액");
            const bank_find = await bank_Schema.findOne({
                userid: interaction.user.id
            })

            const money_find = await money_Schema.findOne({
                userid: interaction.user.id
            })

            if (args < (bank_find?.interestmoney || 0) * (금리 / 100) * (bank_find?.interestcount || 0)){
                interaction.reply({
                    content: `이자 이하의 돈으로 상환할수 없습니다. 현재 이자: (${(bank_find?.interestmoney || 0) * (금리 / 100) * (bank_find?.interestcount || 0)}$)`,
                });
                return;
            }

            if ((bank_find?.interestmoney || 0) + (bank_find?.interestmoney || 0) * (금리 / 100) * (bank_find?.interestcount || 0) < args){
                interaction.reply({
                    content: `대출금 + 이자를 넘어선 금액입니다.\n(${(bank_find?.interestmoney || 0) + (bank_find?.interestmoney || 0) * (금리 / 100) * (bank_find?.interestcount || 0) }$를 상환하시면 됩니다.)`,
                });
                return;
            }

            await money_Schema.updateOne(
                { userid: interaction.user.id },
                { money: Number(money_find?.money || 0) - args, cooltime: (money_find?.cooltime || -10000000) },
                { upsert: true }
            );

            let today = new Date();

            await bank_Schema.updateOne(
                { userid: interaction.user.id },
                {
                    bankmoney: (bank_find?.bankmoney || 0),
                    bankmoneytime: (bank_find?.bankmoneytime || 0),
                    bankmoneycount: (bank_find?.bankmoneycount || 0),
                    interestmoney: (bank_find?.interestmoney || 0) - (args - (bank_find?.interestmoney || 0) * (금리 / 100) * (bank_find?.interestcount || 0)),
                    interesttime: 0,
                    interestcount: 0,
                    creditrating: (bank_find?.creditrating || 5),
                },
                { upsert: true }
            );

            const embed = new EmbedBuilder()
                .setDescription(`**💰대출금 상환이 되었습니다. -${args.toLocaleString()}$\n남은 돈: ${(Number(money_find?.money || 0) - args).toLocaleString()}\n남은 대출금액: ${(bank_find?.interestmoney || 0) - (args - (bank_find?.interestmoney || 0) * (금리 / 100) * (bank_find?.interestcount || 0)).toLocaleString()}**`)
                .setColor("Green");

            interaction.reply({ embeds: [embed] });
        }
    }
}