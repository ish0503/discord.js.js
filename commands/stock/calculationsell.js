// 연산량 판매 시스템
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const calculation_Schema = require("../../models/calculation");
const money_Schema = require("../../models/Money");
const gambling_Schema = require("../../models/stock");

const client = require("../../index");

var 판매가격 = 200 // 연산량 1당 판매 가격

module.exports = {
    data: new SlashCommandBuilder()
        .setName("실적판매")
        .setDescription(`자신의 연산량(실적)를 판매합니다. 1당 150 + (주식레벨 - 1) * 50$`)
        .addStringOption((options) =>
            options
                .setName("대륙이름")
                .setDescription("일할 회사가 있는 대륙의 이름 입력해주세요.")
                .setRequired(true),
        )
        .addStringOption((options) =>
            options
                .setName("회사이름")
                .setDescription("일할 회사의 이름 입력해주세요.")
                .setRequired(true),
        )
        .addIntegerOption((options) =>
            options
                .setName("판매량")
                .setDescription("얼마나 판매할지 적으세요.")
                .setMinValue(1)
                .setRequired(true),
        ),

    /**
     * 
     * @param {import(*discord.js*).ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        //실적판매 로직
        // interaction.reply({
        //     content: `현재 이 명령어는 버그로 인해 사용할수 없습니다.`,
        // });
        // return;

        const args1 = interaction.options.getString("대륙이름");
        const args0 = interaction.options.getInteger("판매량");
        const args = interaction.options.getString("회사이름");

        const money_find = await money_Schema.findOne({
            userid: interaction.user.id,
        });

        const stock_find = await gambling_Schema.findOne({
            continentname: args1,
        });

        if (!stock_find) {
            interaction.reply({
                content: `대륙을 찾을수 없습니다. 제대로 입력했는지 확인해보세요.`,
            });
            return;
        }

        var companys = stock_find.companys
        var stock_find2 = companys.find((element) => element.name == args)

        if (stock_find2.calculation < args0){
            interaction.reply({
                content: `**회사 연산력을 넘어서는 숫자를 팔 수 없습니다. 현재 회사 연산력: ${stock_find2.calculation}**`,
            });
            return;
        }

        if (!stock_find2) {
            interaction.reply({
                content: `**주식을 찾을수 없습니다.**`,
            });
            return;
        }

        if (interaction.user.id != stock_find2.ceo) {
            interaction.reply({
                content: `이 명령어는 그 회사의 ceo만 이용 가능합니다.`,
            });
            return;
        }

        var arr = []

        for (let index = 0; index < stock_find.companys.length; index++) {
            const element = stock_find.companys[index];
            console.log(JSON.stringify(element))
            console.log(args)
            console.log(element.name == args)
            if (element.name == args) {
                console.log(element.calculation)
                console.log(args0)
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
                    calculation: element.calculation - args0,
                    lastmaxbuy: element.lastmaxbuy,
                    allmaxbuy: element.allmaxbuy,
                    employee: element.employee
                })
            } else {
                console.log("A")
                arr.push(element)
            }
        }

        console.log(arr)

        await gambling_Schema.updateOne(
            { continentname: args1 },
            {
                minopentime: stock_find.minopentime,
                maxopentime: stock_find.maxopentime,
                companys: arr
            },
            {upsert: true}
        );

        판매가격 = 150 + (stock_find2.level - 1) * 50

        await money_Schema.updateOne(
            { userid: interaction.user.id },
            {
                money: (money_find?.money || 0) + args0 * 판매가격,
                cooltime: (money_find?.cooltime || -10000000),
            },
            { upsert: true }
        );

        var embed
        embed = new EmbedBuilder()
        .setDescription(
            `${args0} 실적을 판매하였습니다. +${(args0 * 판매가격).toLocaleString()}$\n당신의 현재 돈: ${((money_find?.money || 0) + args0 * 판매가격).toLocaleString()}\n회사의 남은 연산량: ${stock_find2.calculation - args0}`,
        )
        .setColor("Red");

        interaction.reply({ embeds: [embed] });
    }
}
