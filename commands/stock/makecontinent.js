const {
    SlashCommandBuilder,
    EmbedBuilder,
} = require("discord.js");
const gambling_Schema = require("../../models/stock");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("대륙")
        .setDescription("대륙관리 명령어입니다!")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("생성")
                .setDescription("대륙 생성")
                .addStringOption((options) =>
                    options
                        .setName("이름")
                        .setDescription("대륙의 이름 입력")
                        .setMaxLength(50)
                        .setRequired(true),
                )
                .addIntegerOption((options) =>
                    options
                        .setName("주식열리는시간")
                        .setDescription("주식이 오픈되는 시간을 입력 (단위: 시)")
                        .setRequired(true),
                )
                .addIntegerOption((options) =>
                    options
                        .setName("주식끝나는시간")
                        .setDescription("주식이 클로즈되는 시간을 입력 (단위: 시)")
                        .setRequired(true),
                )
                .addStringOption((options) =>
                    options
                        .setName("주식이름")
                        .setDescription("대륙에 처음으로 생성될 주식의 이름 입력")
                        .setMaxLength(50)
                        .setRequired(true),
                )
                .addStringOption((f) =>
                    f
                        .setName("주식종류")
                        .setDescription("주식의 종류 선택")
                        .setRequired(true)
                        .addChoices(
                            { name: "무역", value: "무역" },
                            { name: "농사", value: "농사" },
                        )
                )
                .addStringOption((options) =>
                    options
                        .setName("주식설명")
                        .setDescription("주식의 설명 입력")
                        .setMaxLength(50)
                        .setRequired(true),
                )
                .addIntegerOption((options) =>
                    options
                        .setName("주식처음주가")
                        .setDescription("주식의 시작 주가 입력")
                        .setRequired(true),
                )
                .addIntegerOption((options) =>
                    options
                        .setName("주식량")
                        .setDescription("주식의 시작량 입력")
                        .setRequired(true),
                )
                
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("주식생성")
                .setDescription("대륙의 주식 생성")
                .addStringOption((options) =>
                    options
                        .setName("대륙이름")
                        .setDescription("대륙의 이름 입력")
                        .setMaxLength(50)
                        .setRequired(true),
                )
                .addStringOption((options) =>
                    options
                        .setName("주식이름")
                        .setDescription("생성될 주식의 이름 입력")
                        .setMaxLength(50)
                        .setRequired(true),
                )
                .addStringOption((f) =>
                    f
                        .setName("주식종류")
                        .setDescription("주식의 종류 선택")
                        .setRequired(true)
                        .addChoices(
                            { name: "무역", value: "무역" },
                            { name: "농사", value: "농사" },
                        )
                )
                .addStringOption((options) =>
                    options
                        .setName("주식설명")
                        .setDescription("주식의 설명 입력")
                        .setMaxLength(50)
                        .setRequired(true),
                )
                .addIntegerOption((options) =>
                    options
                        .setName("주식처음주가")
                        .setDescription("주식의 시작 주가 입력")
                        .setRequired(true),
                )
                .addIntegerOption((options) =>
                    options
                        .setName("주식량")
                        .setDescription("주식의 시작량 입력")
                        .setRequired(true),
                )

        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("삭제")
                .setDescription("대륙 삭제")
                .addStringOption((options) =>
                    options
                        .setName("대륙이름")
                        .setDescription("대륙의 이름 입력해주세요.")
                        .setRequired(true),
                ),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("전체확인")
                .setDescription("모든 대륙의 주식을 확인합니다.."),
        ),
    async execute(interaction) {
        if (interaction.user.id != "929974091614670938" && interaction.user.id != "981354358383984680" && interaction.user.id != "985115125939863582"){
            return interaction.reply("현재 이 명령어는 새늅, 봇, ks만 사용 가능함")
        }
        if (interaction.options.getSubcommand() === "생성") {
            const args = interaction.options.getString("이름");
            const args8 = interaction.options.getInteger("주식열리는시간");
            const args9 = interaction.options.getInteger("주식끝나는시간");
            const args3 = interaction.options.getString("주식이름");
            const args4 = interaction.options.getString("주식종류");
            const args5 = interaction.options.getString("주식설명");
            const args6 = interaction.options.getInteger("주식처음주가");
            const args7 = interaction.options.getInteger("주식량");

            const gambling_find = await gambling_Schema.findOne({
                continentname: args,
            });

            if (gambling_find) {
                const embed = new EmbedBuilder()
                    .setDescription(
                        `**이미 있는 대륙입니다.**`,
                    )
                    .setColor("Red");

                interaction.reply({ embeds: [embed] });
                return;
            }
            
            await gambling_Schema.updateOne(
                { continentname: args },
                {
                    minopentime: args8,
                    maxopentime: args9,
                    companys: [{ 
                        type: args4, 
                        name: args3,
                        desc: args5,
                        money: args6,
                        lastmoney: args6,
                        firstmoney: args6,
                        ceo: "0",
                        perworkpay: 0,
                        level: 1,
                        calculation: 0,
                        lastmaxbuy: args7,
                        allmaxbuy: 100,
                        employee: []
                    }]
                },
                { upsert: true },
            );

            const embed = new EmbedBuilder()
                .setDescription(
                    `전지전능한 권력으로 대륙을 생성해냈습니다. 오픈시간: ${args8}시~${args9}시 대륙 주식이름:${args3} 주식종류:${args4} 주식설명:${args5} 주식처음주가:${args6} 주식처음량:${args7}`,
                )
                .setColor("Green");

            interaction.reply({ embeds: [embed] });
        } else if (interaction.options.getSubcommand() === "주식생성") {
            const args = interaction.options.getString("대륙이름");
            const args3 = interaction.options.getString("주식이름");
            const args4 = interaction.options.getString("주식종류");
            const args5 = interaction.options.getString("주식설명");
            const args6 = interaction.options.getInteger("주식처음주가");
            const args7 = interaction.options.getInteger("주식량");

            const gambling_find = await gambling_Schema.findOne({
                continentname: args,
            });

            if (!gambling_find) {
                const embed = new EmbedBuilder()
                    .setDescription(
                        `**대륙을 찾을 수 없습니다.**`,
                    )
                    .setColor("Red");

                interaction.reply({ embeds: [embed] });
                return;
            }

            await gambling_Schema.updateOne(
                { continentname: gambling_find.continentname },
                {
                    minopentime: gambling_find.minopentime,
                    maxopentime: gambling_find.maxopentime,
                    $push: {
                        companys: [{
                            type: args4,
                            name: args3,
                            desc: args5,
                            money: args6,
                            lastmoney: args6,
                            firstmoney: args6,
                            ceo: "0",
                            perworkpay: 0,
                            level: 1,
                            calculation: 0,
                            lastmaxbuy: args7,
                            allmaxbuy: 100,
                            employee: []
                        }]
                    }
                },
                { upsert: true },
            );

            const embed = new EmbedBuilder()
                .setDescription(
                    `전지전능한 권력으로 ${args}대륙 안 ${args4}회사인 ${args3} (${args5})을 생성해냈습니다. 주식처음주가:${args6} 주식처음량:${args7}`,
                )
                .setColor("Green");

            interaction.reply({ embeds: [embed] });
        } else if (interaction.options.getSubcommand() === "삭제") {
            const args = interaction.options.getString("대륙이름");
            const gambling_find = await gambling_Schema.findOne({
                continentname: args,
            });

            console.log(gambling_find);

            if (!gambling_find) {
                interaction.reply({
                    content: `**찾을수 없습니다.**`,
                });
                return;
            }

            await gambling_Schema.deleteOne(
                { continentname: args },
            );

            const embed = new EmbedBuilder()
                .setDescription(`**전지전능한 권력으로 ${args}대륙이 성공적으로 물에 가라앉았습니다..💦**`)
                .setColor("Green");

            interaction.reply({ embeds: [embed] });
        } else if (interaction.options.getSubcommand() === "전체확인") {
            gambling_find = await gambling_Schema.find()

            console.log(gambling_find)

            var start = "```diff"
            var end = "```"

            for (let index = 0; index < gambling_find.length; index++) {
                const stock = gambling_find[index];
                const embed = new EmbedBuilder()
                    .setTitle(`주식 정보 (대륙:${stock.continentname})`)
                    .setColor("Green")
                    for (let index = 0; index < stock.companys.length; index++) {
                        const element = stock.companys[index];
                        const percent = ((element.money / element.lastmoney) * 100 - 100).toFixed(2)
                        embed.addFields(
                          {
                            name: `회사이름: ${element.name}\n회사설명: ${element.desc}\n회사종류: ${element.type}`,
                            value:
                              start +
                              `\n${percent >= 0 ? "+" : "-"
                              }주가: ${element.money.toLocaleString()} (${percent >= 0 ? "+" : ""
                              }${percent}%) \n주식량: ${element.lastmaxbuy} \nceo id: ${element.ceo} \n회사레벨: ${element.level}` +
                              end,
                            inline: true,
                          },
                          { name: "\u200B", value: "\u200B" },
                        )
                      }
                interaction.channel.send({ embeds: [embed] })
            }

            interaction.reply("모든 대륙의 주식을 불러 왔습니다.")
        }
    },
};