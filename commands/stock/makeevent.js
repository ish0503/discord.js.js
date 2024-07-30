const {
    SlashCommandBuilder,
    EmbedBuilder,
} = require("discord.js");
const gambling_Schema = require("../../models/stock");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("이벤트")
        .setDescription("이벤트 관리 명령어입니다")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("생성")
                .setDescription("이벤트 생성")
                .addStringOption((options) =>
                    options
                        .setName("이름")
                        .setDescription("이벤트의 이름 입력")
                        .setMaxLength(50)
                        .setRequired(true),
                )
                .addStringOption((options) =>
                    options
                        .setName("설명")
                        .setDescription("이벤트의 설명 입력")
                        .setMaxLength(50)
                        .setRequired(true),
                )
                .addStringOption((options) =>
                    options
                        .setName("회사종류")
                        .setDescription("이벤트의 영향을 받는 회사종류 선택")
                        .setRequired(true)
                        .addChoices(
                            { name: "무역", value: "무역" },
                            { name: "농사", value: "농사" },
                        )
                )
                .addIntegerOption((options) =>
                    options
                        .setName("돈변화량")
                        .setDescription("이벤트의 영향을 받았을때의 돈(주가)변화량")
                        .setRequired(true),
                )
                .addStringOption((options) =>
                    options
                        .setName("대륙이름")
                        .setDescription("이벤트의 영향을 받는 대륙이름 입력")
                        .setMaxLength(50)
                        .setRequired(false),
                )
                .addStringOption((options) =>
                    options
                        .setName("회사종류2")
                        .setDescription("이벤트의 영향을 받는 회사종류 선택2")
                        .setRequired(false)
                        .addChoices(
                            { name: "무역", value: "무역" },
                            { name: "농사", value: "농사" },
                        )
                )
                .addIntegerOption((options) =>
                    options
                        .setName("돈변화량2")
                        .setDescription("이벤트의 영향을 받았을때의 돈(주가)변화량2")
                        .setRequired(false),
                )
                .addStringOption((options) =>
                    options
                        .setName("대륙이름2")
                        .setDescription("이벤트의 영향을 받는 대륙이름 입력2")
                        .setMaxLength(50)
                        .setRequired(false),
                ),

        ),
    async execute(interaction) {
        if (interaction.user.id != "929974091614670938" && interaction.user.id != "981354358383984680" && interaction.user.id != "985115125939863582") {
            return interaction.reply("현재 이 명령어는 새늅, 봇, ks만 사용 가능함")
        }
        if (interaction.options.getSubcommand() === "생성") {
            const args = interaction.options.getString("이름");
            const args2 = interaction.options.getString("설명");
            const args3 = interaction.options.getString("대륙이름");
            const args4 = interaction.options.getString("회사종류");
            const args5 = interaction.options.getInteger("돈변화량");
            const args6 = interaction.options.getString("대륙이름2");
            const args7 = interaction.options.getString("회사종류2");
            const args8 = interaction.options.getInteger("돈변화량2");

            async function checkdata(continentname){ // 특정 대륙이 존재하는지 확인
                stock = await gambling_Schema.findOne({
                    continentname: continentname,
                });

                console.log(continentname)

                if (!stock) {
                    const embed = new EmbedBuilder()
                        .setDescription(
                            `**대륙을 찾을 수 없습니다.**`,
                        )
                        .setColor("Red");

                    interaction.reply({ embeds: [embed] });
                    return;
                }

                console.log(JSON.stringify(stock))

                return stock
            }

            async function savedata(list){ // 리스트로 주가 바꾼거 저장
                await gambling_Schema.updateOne(
                    { continentname: list.continentname },
                    {
                        minopentime: list.minopentime,
                        maxopentime: list.maxopentime,
                        companys: list.companys
                    },
                    {upsert: true},
                );
            }

            async function getlist(stock, companytype, moneychange){ // 주가 바꿀 리스트 작성
                console.log(JSON.stringify(stock))
                var list = {
                    continentname: stock.continentname,
                    minopentime: stock.minopentime,
                    maxopentime: stock.maxopentime,
                    companys: stock.companys
                }
                for (let index = 0; index < list.companys.length; index++) {
                    const element = list.companys[index];
                    if (element.type == companytype) {
                        element.money += moneychange
                    }
                }

                await savedata(list)
            }

            async function changeallmoney(companytype, moneychange){ // 조건에 부합되는 모든 대륙의 회사 주가 바꾸기
                gambling_find = await gambling_Schema.find()
                for (let index = 0; index < gambling_find.length; index++) {
                    const stock = gambling_find[index];
                    await getlist(stock, companytype, moneychange)
                }
            }

            async function changemoney(continentname, companytype, moneychange){ // 조건에 부합되는 특정 대륙의 회사 주가 바꾸기
                const stock = await checkdata(continentname)
                if (!stock) return;
                await getlist(stock, companytype, moneychange)
            }

            const embed = new EmbedBuilder()
                .setTitle(`이벤트 등장: ${args}`)
                .setDescription(`**${args2}**\n\n 이 이벤트는 다음과 같은 영향을 끼칩니다..`)
                .setColor("Green");

            function moneymsg(continentname, companytype, moneychange) // 조건에 부합되는 특정 대륙의 회사 주가 바꾸기일때 보내는 메시지
            {
                embed.addFields(
                    {
                        name: `${continentname}대륙 내 ${companytype}회사`,
                        value: `이 이벤트로 인해 다음과 같은 영향을 받습니다.\n회사 주가 ${moneychange >= 0 ? "+" : ""}${moneychange}$`,
                        inline: true,
                    },
                )
            }

            function allmoneymsg(companytype, moneychange) // 조건에 부합되는 모든 대륙의 회사 주가 바꾸기일때 보내는 메시지
            {
                embed.addFields(
                    {
                        name: `모든대륙의 ${companytype}회사`,
                        value: `이 이벤트로 인해 다음과 같은 영향을 받습니다.\n회사 주가 ${moneychange >= 0 ? "+" : ""}${moneychange}$`,
                        inline: true,
                    },
                )
            }

            if (args3){
                moneymsg(args3, args4, args5)
                await changemoney(args3, args4, args5)
            }else{
                allmoneymsg(args4, args5)
                await changeallmoney(args4, args5)
            }

            if (args7 && args8){
                if (args6){
                    moneymsg(args6, args7, args8)
                    await changemoney(args6, args7, args8)
                }else{
                    allmoneymsg(args7, args8)
                    await changeallmoney(args7, args8)
                }
            }

            interaction.reply({ embeds: [embed] });
        }
    },
};