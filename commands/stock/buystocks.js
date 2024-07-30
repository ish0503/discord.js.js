const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const gambling_Schema = require("../../models/stock");
const gambling_Schema2 = require("../../models/stocker");
const money_Schema = require("../../models/Money");
const calculation_Schema = require("../../models/calculation");

const client = require("../../index");

const 매도수수료 = 5;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("주식")
    .setDescription("주식 명령어입니다!")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("매수")
        .setDescription("주식을 매수해보세요!")
        .addStringOption((options) =>
          options
            .setName("대륙이름")
            .setDescription("매수할 주식(회사)이 있는 대륙의 이름 입력해주세요.")
            .setRequired(true),
        )
        .addStringOption((options) =>
          options
            .setName("주식이름")
            .setDescription("매수할 주식(회사)의 이름 입력해주세요.")
            .setRequired(true),
        )
        .addIntegerOption((options) =>
          options
            .setName("주")
            .setDescription("매수할 주식의 주를 입력해주세요.")
            .setMinValue(1)
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("매도")
        .setDescription(`주식을 매도해보세요! (수수료 ${매도수수료.toLocaleString()}%)`)
        .addStringOption((options) =>
          options
            .setName("대륙이름")
            .setDescription("매도할 주식(회사)이 있는 대륙의 이름 입력해주세요.")
            .setRequired(true),
        )
        .addStringOption((options) =>
          options
            .setName("주식이름")
            .setDescription("매도할 주식(회사)의 이름 입력해주세요.")
            .setRequired(true),
        )
        .addIntegerOption((options) =>
          options
            .setName("주")
            .setDescription("매도할 주식의 주를 입력해주세요.")
            .setMinValue(1)
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("확인")
        .setDescription("가상 주식의 정보를 확인할 수 있습니다.")
        .addStringOption((options) =>
          options
            .setName("대륙이름")
            .setDescription("주식을 확인할 대륙 이름 입력해주세요.")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("보유확인")
        .setDescription("가상 주식 보유한것을 확인할 수 있습니다.")
        .addStringOption((options) =>
          options
            .setName("대륙이름")
            .setDescription("주식을 확인할 대륙 이름 입력해주세요.")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("발행")
        .setDescription("주식을 발행할수 있습니다.(회사 소유자만 가능)")
        .addStringOption((options) =>
          options
            .setName("대륙이름")
            .setDescription("발행할 주식(회사)이 있는 대륙의 이름 입력해주세요.")
            .setRequired(true),
        )
        .addStringOption((options) =>
          options
            .setName("주식이름")
            .setDescription("발행할 주식(회사)의 이름 입력해주세요.")
            .setRequired(true),
        )
        .addIntegerOption((options) =>
          options
            .setName("주")
            .setDescription("발행할 주식의 주를 입력해주세요.")
            .setMinValue(1)
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
      .setName("회사업그레이드")
      .setDescription("일정량의 연산량과 돈을 지불하여 회사의 레벨을 올릴 수 있습니다.")
      .addStringOption((options) =>
        options
          .setName("대륙이름")
          .setDescription("업그레이드할 회사가 있는 대륙의 이름 입력해주세요.")
          .setRequired(true),
      )
      .addStringOption((options) =>
        options
          .setName("회사이름")
          .setDescription("업그레이드할 회사의 이름 입력해주세요.")
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
      subcommand
      .setName("회사직원등록")
      .setDescription("회사에 인재를 등록할 수 있습니다.")
      .addStringOption((options) =>
        options
          .setName("대륙이름")
          .setDescription("직원등록할 회사가 있는 대륙의 이름 입력해주세요.")
          .setRequired(true),
      )
      .addStringOption((options) =>
        options
          .setName("회사이름")
          .setDescription("직원등록할 회사의 이름 입력해주세요.")
          .setRequired(true),
      )
      .addUserOption((options) =>
        options
          .setName("직원")
          .setDescription("등록할 직원을 입력해주세요.")
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
      subcommand
      .setName("회사직원해고")
      .setDescription("회사에 필요 없는 사람을 자를수 있습니다.")
      .addStringOption((options) =>
        options
          .setName("대륙이름")
          .setDescription("직원해고할 회사가 있는 대륙의 이름 입력해주세요.")
          .setRequired(true),
      )
      .addStringOption((options) =>
        options
          .setName("회사이름")
          .setDescription("직원해고할 회사의 이름 입력해주세요.")
          .setRequired(true),
      )
      .addUserOption((options) =>
        options
          .setName("직원")
          .setDescription("해고할 직원을 입력해주세요.")
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
    .setName("직원목록확인")
    .setDescription("회사의 직원의 연산량과 그 공적치를 볼 수 있습니다.")
    .addStringOption((options) =>
      options
        .setName("대륙이름")
        .setDescription("직원의 연산량을 볼 회사가 있는 대륙의 이름 입력해주세요.")
        .setRequired(true),
    )
    .addStringOption((options) =>
      options
        .setName("회사이름")
        .setDescription("직원의 연산량을 볼 회사의 이름 입력해주세요.")
        .setRequired(true),
    ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("자동돈지급")
      .setDescription("직원이 한번 일할때마다 주는 돈을 조절해보세요. (ceo의 돈이 빠져나갑니다.)")
      .addStringOption((options) =>
        options
          .setName("대륙이름")
          .setDescription("대륙의 이름 입력해주세요.")
          .setRequired(true),
      )
      .addStringOption((options) =>
        options
          .setName("회사이름")
          .setDescription("회사의 이름 입력해주세요.")
          .setRequired(true),
      )
      .addIntegerOption((options) =>
        options
          .setName("돈")
          .setDescription("직원이 한번 일할때마다 주는 돈을 입력하세요.")
          .setMinValue(1)
          .setRequired(true),
      ),
  ),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === "매수") {
      const args0 = interaction.options.getString("대륙이름");
      const args = interaction.options.getString("주식이름");
      const args2 = interaction.options.getInteger("주");
      const gambling_find = await gambling_Schema2.findOne({
        userid: interaction.user.id,
      });

      const money_find = await money_Schema.findOne({
        userid: interaction.user.id,
      });

      const stock_find = await gambling_Schema.findOne({
        continentname: args0,
      });

      if (!stock_find) {
        interaction.reply({
          content: `대륙을 찾을수 없습니다. 제대로 입력했는지 확인해보세요.`,
        });
        return;
      }

      let today = new Date();
      let hours = today.getHours();

      if (!(hours >= stock_find.minopentime && hours < stock_find.maxopentime)) {
        interaction.reply({
          content: `대륙 오픈시간에만 매수/매도할수 있습니다.`,
        });
        return;
      }

      let stock_find2 = stock_find.companys.find((element) => element.name == args)

      function check(){
        if (!money_find || money_find.money < stock_find2.money * args2) {
          const embed = new EmbedBuilder()
            .setDescription(`**돈이 부족합니다.**`)
            .setColor("Red");

          interaction.reply({ embeds: [embed] });
          return;
        }

        if (args2 > stock_find2.maxbuy) {
          const embed = new EmbedBuilder()
            .setDescription(`**살 수 없습니다.**`)
            .setColor("Red");

          interaction.reply({ embeds: [embed] });
          return;
        }
      }

      function sendmsg() {
        const embed = new EmbedBuilder()
          .setDescription(
            `**${(
              stock_find2.money * args2
            ).toLocaleString()}재화를 주고 ${args} ${args2.toLocaleString()}주가 매수 되었습니다.\n남은재화: ${(
              Number(money_find.money) -
              stock_find2.money * args2
            ).toLocaleString()}**`,
          )
          .setColor("Green");

        interaction.reply({ embeds: [embed] });
      }

      if (!stock_find2) {
        interaction.reply({
          content: `주식을 찾을수 없습니다. 제대로 입력했는지 확인해보세요.`,
        });
        return;
      }

      if (!money_find)
        return interaction.reply({
          embeds: [
            new (require("discord.js").EmbedBuilder)()
              .setTitle("SYSTEM API ERROR")
              .setDescription(`돈이 없습니다. /지원금 으로 지원금을 받으세요.`)
              .setColor("Red"),
          ],
          ephemeral: true,
        });

      if (stock_find2.money <= 0) {
        interaction.reply({
          content: `이 회사의 주식은 살 수 없습니다..`,
        });
        return;
      }

      check()

      await money_Schema.updateOne(
        { userid: interaction.user.id },
        {
          money:
            Number(money_find.money) - Number(stock_find2.money) * args2,
        },
      );

      if (gambling_find) {
        let stock_find3 = gambling_find.continents.find((element) => element.name == args0)
        if (stock_find3){
          let stock_find4 = stock_find3.stocks.find((element) => element.name == args)
          if (stock_find4){
            let stockslist = gambling_find.continents
            stockslist.find((element) => element.name == args0).stocks.find((element) => element.name == args).value += args2
            await gambling_Schema2.updateOne(
              { userid: interaction.user.id },
              {
                //$push: {
                continents: stockslist
                //}
              },
              { upsert: true },
            );

            sendmsg()
            return;
          }
        }
      }

      await gambling_Schema2.updateOne(
        { userid: interaction.user.id },
        {
          //$push: {
            continents: [{
              name: args0,
              //$push: {
                stocks: [{ 
                  name: args, 
                  value: args2, 
                  lastvalue: stock_find2.money * args2 
                }],
              //},
            }]
          //}
        },
        { upsert: true },
      );

      sendmsg()
      return
    } else if (interaction.options.getSubcommand() === "매도") {
      const args0 = interaction.options.getString("대륙이름");
      const args = interaction.options.getString("주식이름");
      const args2 = interaction.options.getInteger("주");
      const money_find = await money_Schema.findOne({
        userid: interaction.user.id,
      });
      const gambling_find = await gambling_Schema2.findOne({
        userid: interaction.user.id,
      });
      const stock_find = await gambling_Schema.findOne({
        continentname: args0,
      });   

      if (!stock_find) {
        interaction.reply({
          content: `대륙을 찾을수 없습니다. 제대로 입력했는지 확인해보세요.`,
        });
        return;
      }

      let today = new Date();
      let hours = today.getHours();

      if (!(hours >= stock_find.minopentime && hours < stock_find.maxopentime)) {
        interaction.reply({
          content: `대륙 오픈시간에만 매수/매도할수 있습니다.`,
        });
        return;
      }
      
      if (!money_find)
        return interaction.reply({
          embeds: [
            new (require("discord.js").EmbedBuilder)()
              .setTitle("SYSTEM API ERROR")
              .setDescription(`돈이 없습니다. /지원금 으로 지원금을 받으세요.`)
              .setColor("Red"),
          ],
          ephemeral: true,
        });

      if (!gambling_find) {
        interaction.reply({
          content: `**주식이 없으시군요.. \`/주식 매수\` 명령어로 주식을 매수하세요.**`,
        });
        return;
      }
      
      var stock_find2 = stock_find.companys.find((element) => element.name == args)

      if (!stock_find2 || !gambling_find.continents.find((element) => element.name == args0) || !gambling_find.continents.find((element) => element.name == args0).stocks.find((element) => element.name == args)) {
        interaction.reply({
          content: `**주식을 찾을수 없습니다.**`,
        });
        return;
      }

      var value2 = args2;

      if (gambling_find.continents.find((element) => element.name == args0).stocks.find((element) => element.name == args).value - value2 > 0) {
        gambling_find.continents.find((element) => element.name == args0).stocks.find((element) => element.name == args).value = gambling_find.continents.find((element) => element.name == args0).stocks.find((element) => element.name == args).value - value2,
        gambling_find.continents.find((element) => element.name == args0).stocks.find((element) => element.name == args).lastvalue = gambling_find.continents.find((element) => element.name == args0).stocks.find((element) => element.name == args).lastvalue - stock_find2.money * value2
      } else {
        value2 = gambling_find.continents.find((element) => element.name == args0).stocks.find((element) => element.name == args).value
        gambling_find.continents.find((element) => element.name == args0).stocks.find((element) => element.name == args).value = 0
      }

      await money_Schema.updateOne(
        { userid: interaction.user.id },
        {
          money:
            Number(money_find.money) +
            Math.round(stock_find2.money * value2 -
              stock_find2.money * value2 * (매도수수료 / 100)),
        },
      );

      const money_find2 = await money_Schema.findOne({
        userid: stock_find2.ceo,
      });

      if (money_find2) {
        await money_Schema.updateOne(
          { userid: stock_find2.ceo },
          {
            money:
              Number(money_find2.money) +
              stock_find2.money * value2 * (매도수수료 / 100),
          },
        );
      }

      await gambling_Schema2.updateOne(
        { userid: interaction.user.id },
        {
          $set: {
            continents: gambling_find.continents
          },
        },
        { upsert: true },
      );

      const embed = new EmbedBuilder()
        .setDescription(
          `**${args} ${value2.toLocaleString()}주가 성공적으로 매도되었습니다.\n예상되는 받는돈: ${Math.round(
            stock_find2.money * value2 -
            stock_find2.money * value2 * (매도수수료 / 100)
          ).toLocaleString()}(수수료 -${매도수수료}%)\n남은재화: ${(
            Number(money_find.money) +
            stock_find2.money * value2 -
            stock_find2.money * value2 * (매도수수료 / 100)
          ).toLocaleString()}**`,
        )
        .setColor("Green");

      interaction.reply({ embeds: [embed] });

      // if (soondeleteitem.length <= 0){
      //     gambling_Schema2.findOneAndRemove({userid : gambling_find.userid})
      // }
    } else if (interaction.options.getSubcommand() === "확인") {
      const args = interaction.options.getString("대륙이름");
      const stock = await gambling_Schema.findOne({
        continentname: args,
      });

      if (!stock){
        return interaction.reply("대륙을 찾을수 없습니다.")
      }

      var start = "```diff";
      var end = "```";

      const embed = new EmbedBuilder()
        .setTitle(`${args}대륙 주식 정보`)
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

      interaction.reply({ embeds: [embed] });
    } else if (interaction.options.getSubcommand() === "보유확인") {
      const args0 = interaction.options.getString("대륙이름");
      const gambling_find = await gambling_Schema2.findOne({
        userid: interaction.user.id,
      });

      if (!gambling_find) {
        interaction.reply({
          content: `**주식이 없으시군요.. \`/주식 매수\` 명령어로 주식을 매수하세요.**`,
        });
        return;
      }

      if (!gambling_find.continents.find((element) => element.name == args0)){
        interaction.reply({
          content: `**대륙을 찾을 수 없습니다.**`,
        });
        return;
      }

      var stocks = gambling_find.continents.find((element) => element.name == args0).stocks

      const embed = new EmbedBuilder()
        .setDescription(`**${interaction.user}님의 주식**`)
        .setColor("Green");

      for (let i = 0; i < stocks.length; i++) {
        if (!stocks[i] || stocks[i].value <= 0) {
          continue;
        }
        var item = stocks[i];
        const stock_find = await gambling_Schema.findOne({
          continentname: args0,
        }); 

        var stock_find2 = stock_find.companys.find((element) => element.name == item.name)

        embed.addFields({
          name: `${i + 1}. ${item.name}`,
          value: `**${item.value}주 (${(
            stock_find2.money * item.value
          ).toLocaleString()}재화)\n(${(
            ((Number(stock_find2.money) * item.value) / item.lastvalue) *
              100 -
            100
          ).toFixed(2)}%)**`,
        });
      }

      interaction.reply({ embeds: [embed] });
    } else if (interaction.options.getSubcommand() === "발행") {
      const args0 = interaction.options.getString("대륙이름");
      const args = interaction.options.getString("주식이름");
      const args2 = interaction.options.getInteger("주");
      const stock_find = await gambling_Schema.findOne({
        continentname: args0,
      });   

      if (!stock_find) {
        interaction.reply({
          content: `대륙을 찾을수 없습니다. 제대로 입력했는지 확인해보세요.`,
        });
        return;
      }

      let company = stock_find.companys.find((element) => element.name == args)

      var companys = []

      if (!company) {
        interaction.reply({
          content: `대륙은 찾았으나 회사를 찾을수 없습니다. 제대로 입력했는지 확인해보세요.`,
        });
        return;
      }

      if (interaction.user.id != company.ceo){
        interaction.reply({
          content: `이 명령어는 그 회사의 ceo만 이용 가능합니다.`,
        });
        return;
      }

      if (company.allmaxbuy - args2 < 0){
        interaction.reply({
          content: `이 정도의 주식을 발행 할 수 없습니다.\n현재 최대 ${company.allmaxbuy}주를 발행 할 수 있습니다.\n발행 가능한 최대 주식 수를 늘리려면 회사 레벨을 올리세요.\n현재 회사 레벨은 ${company.level}레벨 입니다.`,
        });
        return;
      }

      for (let index = 0; index < stock_find.companys.length; index++) {
        const element = stock_find.companys[index];
        if (element.name != company.name){
          companys.push(element)
        }else{
          companys.push({
            type: element.type,
            name: element.name,
            desc: element.desc,
            money: element.money,
            lastmoney: element.lastmoney,
            firstmoney: element.firstmoney,
            ceo: element.ceo,
            perworkpay: element.perworkpay,
            level: element.level,
            calculation: element.calculation,
            lastmaxbuy: element.lastmaxbuy + args2,
            allmaxbuy: element.allmaxbuy - args2,
            employee: element.employee
          })
        }
      }

      await gambling_Schema.updateOne(
        { continentname: args0 },
        {
          minopentime: stock_find.minopentime,
          maxopentime: stock_find.maxopentime,
          companys: companys
        },
        { upsert: true },
      );

      const embed = new EmbedBuilder()
        .setDescription(
          `**주식이 성공적으로 발행되었습니다. 발행한 주식: ${company.lastmaxbuy + args2}주, 더 발행할 수 있는 주식: ${company.allmaxbuy - args2}주**`,
        )
        .setColor("Green");

      interaction.reply({ embeds: [embed] });
    }else if (interaction.options.getSubcommand() === "회사업그레이드") {
      const args0 = interaction.options.getString("대륙이름");
      const args = interaction.options.getString("회사이름");
      const money_find = await money_Schema.findOne({
        userid: interaction.user.id,
      });
      const stock_find = await gambling_Schema.findOne({
        continentname: args0,
      });   

      if (!money_find)
        return interaction.reply({
          embeds: [
            new (require("discord.js").EmbedBuilder)()
              .setTitle("SYSTEM API ERROR")
              .setDescription(`돈이 없습니다. /지원금 으로 지원금을 받으세요.`)
              .setColor("Red"),
          ],
          ephemeral: true,
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

      if (interaction.user.id != stock_find2.ceo){
        interaction.reply({
          content: `이 명령어는 그 회사의 ceo만 이용 가능합니다.`,
        });
        return;
      }

      const confirm = new ButtonBuilder()
        .setCustomId(`upgrade`)
        .setLabel(`회사 레벨업`)
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder().addComponents(confirm);

      const msg = await interaction.reply({
        content: `회사를 레벨업 하시겠습니까?\n필요 연산량: ${(100 + 10 ** stock_find2.level).toLocaleString()}\n필요 돈: ${(50000 + 50000 * stock_find2.level).toLocaleString()}\n\n현재 이 회사의 연산량: ${stock_find2.calculation.toLocaleString()}\n현재 당신의 돈: ${money_find.money.toLocaleString()}`,
        components: [row],
      });

      const collector = msg.createMessageComponentCollector({
        time: 60_000,
        filter: (i) => i.user.id == interaction.user.id,
        max: 1,
      });

      collector.on("collect", async (inter) => {
        try {
          if (money_find.money < 50000 + 50000 * stock_find2.level) {
            const embed = new EmbedBuilder()
              .setDescription(`**돈이 부족합니다**`)
              .setColor("Red");

            inter.reply({ embeds: [embed], ephemeral: true });
            return;
          }

          if (stock_find2.calculation < 100 + 10 ** stock_find2.level) {
            const embed = new EmbedBuilder()
              .setDescription(`**연산력이 부족합니다**`)
              .setColor("Red");

            inter.reply({ embeds: [embed], ephemeral: true });
            return;
          }

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
                firstmoney: element.firstmoney + Math.round(element.firstmoney * 0.3), 
                ceo: element.ceo, 
                perworkpay: element.perworkpay,
                level: element.level + 1, 
                calculation: element.calculation - (100 + 10 ** stock_find2.level), 
                lastmaxbuy: element.lastmaxbuy, 
                allmaxbuy: element.allmaxbuy + 100, 
                employee: element.employee
              })
            }else{
              arr.push(element)
            }
          }

          await money_Schema.updateOne(
            { userid: interaction.user.id },
            { money: Number(money_find.money) - (50000 + 50000 * stock_find2.level) },
          );

          await gambling_Schema.updateOne(
            { continentname: args0 },
            { 
              minopentime: stock_find.minopentime, 
              maxopentime: stock_find.maxopentime,
              companys: arr 
            },
          );

          inter.reply({
            content: `**축하합니다! 당신의 회사가 레벨업 하였습니다.**\n\n레벨 ${stock_find2.level.toLocaleString()} -> 레벨 ${(stock_find2.level + 1).toLocaleString()}\n최대 주식 발행 개수 ${stock_find2.allmaxbuy.toLocaleString()}주 -> ${(stock_find2.allmaxbuy + 100).toLocaleString()}주\n주가 변화량 +30%\n실적 판매 돈 ${150 + (stock_find2.level - 1) * 50} -> ${150 + (stock_find2.level) * 50}\n연산력 ${stock_find2.calculation.toLocaleString()} -> ${(stock_find2.calculation - (100 + 10 ** stock_find2.level)).toLocaleString()}\n돈 ${money_find.money.toLocaleString()} -> ${(Number(money_find.money) - (1000000 + 100 ** stock_find2.level)).toLocaleString()}`,
          });
        } catch (error) {
          console.log(error);
          interaction.editReply({
            content: "error: " + error,
          });
        }
      });
    }else if (interaction.options.getSubcommand() === "회사직원등록") {
      const args0 = interaction.options.getString("대륙이름");
      const args = interaction.options.getString("회사이름");
      const user = interaction.options.getUser("직원");

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

      if (interaction.user.id != stock_find2.ceo){
        interaction.reply({
          content: `이 명령어는 그 회사의 ceo만 이용 가능합니다.`,
        });
        return;
      }

      if (user.bot){
        interaction.reply({
          content: `봇은 최고의 노동력을 자랑하지만.. 아쉽게도 회사의 직원이 될 수는 없네요..`,
        });
        return;
      }

      if (stock_find2.employee.find((element) => element == user.id) || user.id == stock_find2.ceo){
        interaction.reply({
          content: `이미 등록하려는 직원이 회사의 구성원입니다.`,
        });
        return;
      }

      var arr = []

      for (let index = 0; index < companys.length; index++) {
        const element = companys[index];
        if (element.name == args){
          element.employee.push(user.id)
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
            calculation: element.calculation, 
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

      interaction.reply({
        content: `<@${user.id}>님이 ${stock_find2.name}회사 직원에 등록되었습니다! 신입 사원을 환영합니다!`,
      });
    }else if (interaction.options.getSubcommand() === "회사직원해고") {
      const args0 = interaction.options.getString("대륙이름");
      const args = interaction.options.getString("회사이름");
      const user = interaction.options.getUser("직원");

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

      if (interaction.user.id != stock_find2.ceo){
        interaction.reply({
          content: `이 명령어는 그 회사의 ceo만 이용 가능합니다.`,
        });
        return;
      }

      if (!stock_find2.employee.find((element) => element == user.id) || user.id == stock_find2.ceo){
        interaction.reply({
          content: `이 사람은 당신의 회사에 속해있지 않습니다\n또는 당신을 해고 할수도 없죠..`, //이거 자기 자신을 해고 하려고 하거나 없는 사람 해고 하려고 햇을때 뜨는 메시지
        });
        return;
      }

      var arr = []

      for (let index = 0; index < companys.length; index++) {
        const element = companys[index];
        if (element.name == args){
          let filtered = element.employee.filter((element) => element != user.id)
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
            calculation: element.calculation, 
            lastmaxbuy: element.lastmaxbuy, 
            allmaxbuy: element.allmaxbuy, 
            employee: filtered
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

      const calculation_find = await calculation_Schema.findOne({
        userid: user.id,
      });

      await calculation_Schema.updateOne(
        { userid: user.id },
        {
            calculation: 0,
            career: (calculation_find?.career || 0)
        },
        {upsert: true}
      );

      interaction.reply({
        content: `<@${user.id}>님이 ${stock_find2.name}회사에서 해고되었습니다..`,
      });
    }else if (interaction.options.getSubcommand() === "직원목록확인") {
      const args0 = interaction.options.getString("대륙이름");
      const args = interaction.options.getString("회사이름");

      const calculation_find = await calculation_Schema
      .find()
      .sort([["calculation","descending"]])
      .exec();

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

      if (interaction.user.id != stock_find2.ceo){
        interaction.reply({
          content: `이 명령어는 그 회사의 ceo만 이용 가능합니다.`,
        });
        return;
      }

      let save = [];

      for (let index = 0; index < stock_find2.employee.length; index++) {
        const element = stock_find2.employee[index];
        const findcalculation = calculation_find.find((employee2) => employee2.userid == element)
        if (findcalculation){
          console.log(findcalculation)
          save.push({
            userid: findcalculation.userid,
            calculation: findcalculation.calculation
          })
        }else{
          save.push({
            userid: element,
            calculation: 0
          })
        }
      }

      // for (let index = 0; index < calculation_find.length; index++) {
      //   const element = calculation_find[index];
      //   if (stock_find2.employee.find((employee2) => employee2 == element.userid)){
      //       save.push(element)
      //   }
      // }

      save.sort(function (a, b) {
        if (a.calculation > b.calculation) {
          return -1;
        }
        if (a.calculation < b.calculation) {
          return 1;
        }
        // a must be equal to b
        return 0;
      });

      function splitIntoChunk(arr, chunk) {
        // 빈 배열 생성
        const result = [];
        
        for (index=0; index < arr.length; index += chunk) {
          let tempArray;
          // slice() 메서드를 사용하여 특정 길이만큼 배열을 분리함
          tempArray = arr.slice(index, index + chunk);
          // 빈 배열에 특정 길이만큼 분리된 배열을 추가
          result.push(tempArray);
        }
        
        return result;
      }

      let save2 = splitIntoChunk(save, 20);

      interaction.reply("집계중..")

      for (let i = 0; i < save2.length; i++) {
        const embed = new EmbedBuilder()
          .setTitle(`${args}회사 직원 목록`)
          .setColor("Green")
        for (let index = 0; index < save2[i].length; index++) {
          const element = save2[i][index];
          let user = client.users.cache.get(element.userid);
          if (!user){
            embed.addFields(
              {
                name: `**<알수없음>**`,
                value: `연산량: ${element.calculation}`, // \n회사의 총 연산력에 공헌한 퍼센트(%): ${(element.calculation/stock_find2.calculation*100).toFixed(2)}
                inline: true,
              },
            )
          }else{
            embed.addFields(
              {
                name: `**<${user.username}>**`,
                value: `연산량: ${element.calculation}`,
                inline: true,
              },
            )
          }
        } 
        interaction.channel.send({ embeds: [embed] });
      }
    } else if (interaction.options.getSubcommand() === "자동돈지급") {
      const args0 = interaction.options.getString("대륙이름");
      const args = interaction.options.getString("회사이름");
      const args2 = interaction.options.getInteger("돈");

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
          content: `**회사를 찾을수 없습니다.**`,
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

      for (let index = 0; index < companys.length; index++) {
        const element = companys[index];
        if (element.name == args) {
          arr.push({
            type: element.type,
            name: element.name,
            desc: element.desc,
            money: element.money,
            lastmoney: element.lastmoney,
            firstmoney: element.firstmoney,
            ceo: element.ceo,
            perworkpay: args2,
            level: element.level,
            calculation: element.calculation,
            lastmaxbuy: element.lastmaxbuy,
            allmaxbuy: element.allmaxbuy,
            employee: element.employee
          })
        } else {
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
        {upsert:true}
      );

      const embed = new EmbedBuilder()
        .setTitle(`${args}회사 자동 돈 지급 변경 완료`)
        .setDescription(`이제 ${args}회사에서 일할때마다 ceo의 돈에서 ${args2} * 증가연산량$ 만큼 빠져나가요!`)
        .setColor("Green")

      interaction.reply({ embeds: [embed] });
    }
  },
};
