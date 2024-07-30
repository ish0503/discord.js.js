const {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const gambling_Schema = require("../../models/upgrade");
const money_Schema = require("../../models/Money");
const level_Sechma = require("../../models/level");

let autoUpgradeInterval;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("아이템")
    .setDescription("아이템 명령어입니다!")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("생성")
        .setDescription("자신만의 아이템을 창작해보세요!")
        .addStringOption((options) =>
          options
            .setName("이름")
            .setDescription("아이템의 이름 입력해주세요.")
            .setMaxLength(50)
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("삭제")
        .setDescription("아이템을 삭제합니다.")
        .addStringOption((options) =>
          options
            .setName("이름")
            .setDescription("아이템의 이름 입력해주세요.")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("강화")
        .setDescription("자신만의 아이템을 강화해보세요!")
        .addStringOption((options) =>
          options
            .setName("이름")
            .setDescription("아이템의 이름 입력해주세요.")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("이름변경")
        .setDescription("자신의 아이템의 이름을 변경할수 있습니다.")
        .addStringOption((options) =>
          options
            .setName("아이템이름")
            .setDescription("아이템의 이름 입력해주세요.")
            .setRequired(true),
        )
        .addStringOption((options) =>
          options
            .setName("변경이름")
            .setDescription("변경할 이름 입력해주세요.")
            .setMaxLength(50)
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("확인")
        .setDescription(
          "자기가 직접 만들고 강화한 아이템들을 확인할 수 있습니다.",
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("순위")
        .setDescription("아이템 강화 횟수로 순위를 봅니다."),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("방어권구매")
        .setDescription("한번 강화 실패를 막을수 있는 방어막을!")
        .addIntegerOption((options) =>
          options
            .setName("수량")
            .setDescription("방어권의 수량을 입력해주세요.")
            .setMinValue(1)
            .setMaxValue(100)
            .setRequired(true),
        ),
    ),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === "강화") {
      const args = interaction.options.getString("이름");
      const gambling_find = await gambling_Schema.findOne({
        userid: interaction.user.id,
      });
      const level_find = await level_Sechma.findOne({
        userid: interaction.user.id,
      });

      if (gambling_find) {
        const canGiveTime = Number(gambling_find.cooltime) + 1 * 30 * 1000;
        if (canGiveTime && canGiveTime > Date.now()) {
          interaction.reply({
            content: `**아이템 강화/생성 후에는 쿨타임이 있습니다.\n<t:${Math.round(
              canGiveTime / 1000,
            )}> (<t:${Math.round(canGiveTime / 1000)}:R>)**`,
          });
          return;
        }
      }
      if (!gambling_find) {
        interaction.reply({
          content: `/아이템 생성을 먼저 해주세요.`,
        });
        return;
      }
      let length = gambling_find.hashtags.length;
      let isitem = -1;
      let hasitem = [];

      for (let i = 0; i < length; i++) {
        if (gambling_find.hashtags[i].name == args) {
          isitem = i;
        } else {
          hasitem.push({
            name: gambling_find.hashtags[i].name,
            value: gambling_find.hashtags[i].value,
          });
        }
      }

      if (isitem == -1) {
        const embed = new EmbedBuilder()
          .setDescription(`**당신에게 없는 아이템을 강화하라구요? 참나**`)
          .setColor("Red");

        interaction.reply({ embeds: [embed] });
        return;
      }

      const random_number = Math.round(Math.random() * 10000);
      const random_upgrade = Math.round(Math.random() * 9) + 1; // 1에서 2사이

      async function BrokeCheck(Num) {
        console.log(Num);
        const random_number = Math.round(Math.random() * Num);
        const number = 0;
        if (random_number <= number) {
          if ((gambling_find?.defense || 0) < 5) {
            let soondeleteitem = [];
            let length = gambling_find.hashtags.length;
            for (let i = 0; i < length; i++) {
              if (gambling_find.hashtags[i].name != args) {
                soondeleteitem.push({
                  name: gambling_find.hashtags[i].name,
                  value: gambling_find.hashtags[i].value,
                });
              }
            }

            await gambling_Schema.updateOne(
              { userid: interaction.user.id },
              {
                $set: {
                  hashtags: soondeleteitem,
                },
                skills: gambling_find.skills || [],
                cooltime: Date.now(),
                defense: gambling_find?.defense || 0,
              },
              { upsert: true },
            );
            sendmsgBroke(((number + 1) / (Num + 1)) * 100);
          } else {
            updatedefense(5);
            sendmsgBrokeDefense();
          }
          return "true";
        } else {
          return "false";
        }
      }

      function sendmsgBrokeDefense() {
        const embed = new EmbedBuilder()
          .setTitle(`아이템 파괴 방어`)
          .setDescription(
            `**당신의 방어권으로 아이템이 파괴 될 뻔했는데!! 보존되었습니다. \n남은 방어권: ${
              gambling_find?.defense - 10
            }개 (10개 사용함)**`,
          )
          .setColor("Blue");

        interaction.reply({ embeds: [embed] });
      }

      function sendmsgDefense() {
        const embed = new EmbedBuilder()
          .setTitle(
            `강화 확률: ${
              (10000 +
                (level_find?.level || 1) * 100 -
                gambling_find.hashtags[isitem].value ** 2) /
              100
            }%`,
          )
          .setDescription(
            `**당신의 방어권으로 아이템이 보존되었습니다. \n남은 방어권: ${
              gambling_find?.defense - 1
            }개**`,
          )
          .setColor("Blue");

        interaction.reply({ embeds: [embed] });

        return;
      }

      function sendmsgSucceess() {
        const embed = new EmbedBuilder()
          .setTitle(
            `**강화 확률: ${
              (10000 +
                (level_find?.level || 1) * 100 -
                gambling_find.hashtags[isitem].value ** 2) /
              100
            }%**`,
          )
          .setDescription(
            `**강화 성공! 이름: ${args}, 강화 수: ${
              gambling_find.hashtags[isitem].value
            } -> ${gambling_find.hashtags[isitem].value + random_upgrade}**`,
          )
          .setColor("Green");

        interaction.reply({ embeds: [embed] });
        return;
      }

      function sendmsgFail() {
        const embed = new EmbedBuilder()
          .setTitle(
            `**강화 확률: ${
              (10000 +
                (level_find?.level || 1) * 100 -
                gambling_find.hashtags[isitem].value ** 2) /
              100
            }%**`,
          )
          .setDescription(
            `**강화 실패.. 이름: ${args}, 강화 수: ${
              gambling_find.hashtags[isitem].value
            } -> ${gambling_find.hashtags[isitem].value - random_upgrade}**`,
          )
          .setColor("Red");

        interaction.reply({ embeds: [embed] });
        return;
      }

      function sendmsgBroke(percent) {
        const embed = new EmbedBuilder()
          .setTitle(`**아이템 파괴..**`)
          .setDescription(
            `**${percent}% 확률로 아이템이 파괴되었습니다.. 이름: ${args}**\n(아이템 파괴를 막을려면 방어권 10개가 필요합니다.)`,
          )
          .setColor("Red");

        interaction.reply({ embeds: [embed] });
        return;
      }

      async function update() {
        await gambling_Schema.updateOne(
          { userid: interaction.user.id },
          {
            $set: {
              hashtags: hasitem,
              skills: gambling_find?.skills || [],
              cooltime: Date.now(),
              defense: gambling_find?.defense || 0,
            },
          },
          { upsert: true },
        );
      }

      async function updatedefense(int) {
        await gambling_Schema.updateOne(
          { userid: interaction.user.id },
          {
            $set: {
              hashtags: gambling_find?.hasitem,
              skills: gambling_find?.skills || [],
              cooltime: Date.now(),
              defense: gambling_find?.defense - int,
            },
          },
          { upsert: true },
        );
      }

      if (
        (await BrokeCheck(
          10000 - gambling_find.hashtags[isitem].value > 0
            ? 10000 - gambling_find.hashtags[isitem].value
            : 1,
        )) == "true"
      ) {
        console.log("broke");
        return;
      }

      console.log("Notbroke");

      if (
        (10000 +
          (level_find?.level || 1) * 100 -
          gambling_find.hashtags[isitem].value ** 2) /
          100 >=
        3000
      ) {
        const random_upgrade = 30;
        hasitem.push({
          name: args,
          value: gambling_find.hashtags[isitem].value + random_upgrade,
        });

        update();

        sendmsgSucceess();
        return;
      } else if (
        (10000 +
          (level_find?.level || 1) * 100 -
          gambling_find.hashtags[isitem].value ** 2) /
          100 >=
        1000
      ) {
        const random_upgrade = 10;
        hasitem.push({
          name: args,
          value: gambling_find.hashtags[isitem].value + random_upgrade,
        });
        update();

        sendmsgSucceess();
        return;
      } else if (
        (10000 +
          (level_find?.level || 1) * 100 -
          gambling_find.hashtags[isitem].value ** 2) /
          100 >=
        500
      ) {
        const random_upgrade = Math.round(Math.random() * 5) + 5;
        hasitem.push({
          name: args,
          value: gambling_find.hashtags[isitem].value + random_upgrade,
        });
        update();

        sendmsgSucceess();
        return;
      }

      console.log(random_number + (level_find?.level || 1) * 100);
      console.log(gambling_find.hashtags[isitem].value ** 2);
      if (
        random_number + (level_find?.level || 1) * 100 >
        gambling_find.hashtags[isitem].value ** 2
      ) {
        console.log("강화 성공");
        hasitem.push({
          name: args,
          value: gambling_find.hashtags[isitem].value + random_upgrade,
        });
        update();

        sendmsgSucceess();
        return;
      } else {
        if ((gambling_find?.defense || 0) < 1) {
          hasitem.push({
            name: args,
            value: gambling_find.hashtags[isitem].value - random_upgrade,
          });
          update();

          sendmsgFail();
          return;
        } else {
          updatedefense(1);

          sendmsgDefense();
          return;
        }
      }
    } else if (interaction.options.getSubcommand() === "생성") {
      const args = interaction.options.getString("이름");
      const gambling_find = await gambling_Schema.findOne({
        userid: interaction.user.id,
      });
      const money_find = await money_Schema.findOne({
        userid: interaction.user.id,
      });

      if (gambling_find) {
        const canGiveTime = Number(gambling_find.cooltime) + 1 * 30 * 1000;
        if (canGiveTime && canGiveTime > Date.now()) {
          interaction.reply({
            content: `**아이템 강화/생성 후에는 쿨타임이 있습니다.\n<t:${Math.round(
              canGiveTime / 1000,
            )}> (<t:${Math.round(canGiveTime / 1000)}:R>)**`,
          });
          return;
        }
      }

      if (gambling_find && gambling_find.hastags) {
        let length = gambling_find.hashtags.length;
        let isitem = -1;
        for (let i = 0; i < length; i++) {
          if (gambling_find.hashtags[i].name == args) {
            isitem = i;
          }
        }

        if (isitem != -1) {
          const embed = new EmbedBuilder()
            .setDescription(
              `**이미 당신에게 있는 아이템을 또 생성할 수 없습니다.**`,
            )
            .setColor("Red");

          interaction.reply({ embeds: [embed] });
          return;
        }

        if (length > 5) {
          const embed = new EmbedBuilder()
            .setDescription(`**5개 이상의 아이템을 생성할 수 없습니다.**`)
            .setColor("Red");

          interaction.reply({ embeds: [embed] });
          return;
        }
      }

      if (!money_find || money_find.money < 25000) {
        const embed = new EmbedBuilder()
          .setDescription(`**아이템을 생성하려면 돈 25000재화가 필요합니다.**`)
          .setColor("Red");

        interaction.reply({ embeds: [embed] });
        return;
      }

      await money_Schema.updateOne(
        { userid: interaction.user.id },
        { money: Number(money_find.money) - 25000 },
      );

      await gambling_Schema.updateOne(
        { userid: interaction.user.id },
        {
          $push: {
            hashtags: [{ name: args, value: 0 }],
          },
          skills: (gambling_find?.skills || []),
          cooltime: Date.now(),
          defense: (gambling_find?.defense || 0),
        },
        { upsert: true },
      );

      const embed = new EmbedBuilder()
        .setDescription(
          `**25000재화를 주고 아이템이 생성 되었습니다. 이름: ${args}, 강화 수: 0**`,
        )
        .setColor("Green");

      interaction.reply({ embeds: [embed] });
    } else if (interaction.options.getSubcommand() === "삭제") {
      const args = interaction.options.getString("이름");
      const gambling_find = await gambling_Schema.findOne({
        userid: interaction.user.id,
      });

      if (!gambling_find) {
        interaction.reply({
          content: `**아이템이 없으시군요.. \`/아이템\` 명령어로 아이템을 생성하세요.**`,
        });
        return;
      }

      let soondeleteitem = [];
      let length = gambling_find.hashtags.length;
      let isitem = -1;
      for (let i = 0; i < length; i++) {
        if (gambling_find.hashtags[i].name == args) {
          isitem = i;
        } else {
          soondeleteitem.push({
            name: gambling_find.hashtags[i].name,
            value: gambling_find.hashtags[i].value,
          });
        }
      }

      if (isitem == -1) {
        const embed = new EmbedBuilder()
          .setDescription(
            `**아이템을 찾을 수 없습니다.. 공기라도 없애라는 건가요?**`,
          )
          .setColor("Red");

        interaction.reply({ embeds: [embed] });
        return;
      }

      await gambling_Schema.updateOne(
        { userid: interaction.user.id },
        {
          $set: {
            hashtags: soondeleteitem,
          },
          skills: gambling_find.skills || [],
          cooltime: Date.now(),
          defense: gambling_find?.defense || 0,
        },
        { upsert: true },
      );

      const embed = new EmbedBuilder()
        .setDescription(
          `**아이템이 성공적으로 삭제 되었습니다. 이름: ${args}**`,
        )
        .setColor("Green");

      interaction.reply({ embeds: [embed] });
    } else if (interaction.options.getSubcommand() === "확인") {
      const gambling_find = await gambling_Schema.findOne({
        userid: interaction.user.id,
      });

      if (!gambling_find) {
        interaction.reply({
          content: `**아이템이 없으시군요.. \`/아이템\` 명령어로 아이템을 생성하세요.**`,
        });
        return;
      }

      const embed = new EmbedBuilder()
        .setDescription(`**${interaction.user}님의 아이템**`)
        .setColor("Green");

      let length = gambling_find.hashtags.length;
      for (let i = 0; i < length; i++) {
        if (!gambling_find.hashtags[i]) {
          continue;
        }
        var item = gambling_find.hashtags[i];
        embed.addFields({
          name: `${i + 1}. ${item.name}`,
          value: `강화수 : **${item.value}**`,
        });
      }

      embed.addFields({
        name: `강화보호권`,
        value: `${gambling_find?.defense || 0}개**`,
      });

      interaction.reply({ embeds: [embed] });
    } else if (interaction.options.getSubcommand() === "이름변경") {
      const args = interaction.options.getString("아이템이름");
      const args2 = interaction.options.getString("변경이름");
      const gambling_find = await gambling_Schema.findOne({
        userid: interaction.user.id,
      });

      if (!gambling_find) {
        interaction.reply({
          content: `**아이템이 없으시군요.. \`/아이템\` 명령어로 아이템을 생성하세요.**`,
        });
        return;
      }

      let soondeleteitem = [];

      let length = gambling_find.hashtags.length;
      let isitem = -1;
      for (let i = 0; i < length; i++) {
        if (gambling_find.hashtags[i].name == args) {
          isitem = i;
          soondeleteitem.push({
            name: args2,
            value: gambling_find.hashtags[i].value,
          });
        } else {
          soondeleteitem.push({
            name: gambling_find.hashtags[i].name,
            value: gambling_find.hashtags[i].value,
          });
        }
      }

      if (isitem == -1) {
        const embed = new EmbedBuilder()
          .setDescription(
            `**아이템을 찾을 수 없습니다.. 공기라도 바꾸라는 건가요?**`,
          )
          .setColor("Red");

        interaction.reply({ embeds: [embed] });
        return;
      }

      await gambling_Schema.updateOne(
        { userid: interaction.user.id },
        {
          $set: {
            hashtags: soondeleteitem, //[{"name": null}]
            //{ "name": args, "value": 0 },
          },
          skills: gambling_find?.skills || [],
          cooltime: Date.now(),
          defense: gambling_find?.defense || 0,
        },
        { upsert: true },
      );

      const embed = new EmbedBuilder()
        .setDescription(
          `**아이템이 성공적으로 변경 되었습니다. ${args2}로요.**`,
        )
        .setColor("Green");

      interaction.reply({ embeds: [embed] });
    } else if (interaction.options.getSubcommand() === "순위") {
      interaction.reply("순위 집계중"); // const gambling_find = await gambling_Schema.findOne({
      //     userid:interaction.user.id
      // })

      const gambling_find = await gambling_Schema
        .find()
        //.sort([["value"]])
        //.limit(10)
        .exec();

      const embed = new EmbedBuilder()
        .setTitle(`${interaction.client.user.username} 강화 순위`)
        .setColor("Green")
        .setThumbnail(interaction.client.user.displayAvatarURL());

      let save = [];

      for (let i = 0; i < Object.keys(gambling_find).length; i++) {
        let json3 = JSON.parse(JSON.stringify(gambling_find[i].hashtags));
        for (let v = 0; v < Object.keys(json3).length; v++) {
          if (json3[v]) {
            json3[v]["userid"] = gambling_find[i].userid;
          } else if (json3) {
            json3["userid"] = gambling_find[i].userid;
          }
        }
        save.push(...json3);
      }

      save.sort(function (a, b) {
        if (a.value > b.value) {
          return -1;
        }
        if (a.value < b.value) {
          return 1;
        }
        // a must be equal to b
        return 0;
      });
      for (let i = 0; i < 10; i++) {
        if (!save[i]) continue;
        const user = await interaction.client.users.fetch(save[i].userid);
        embed.addFields({
          name: `${i + 1}. ${user.username}`,
          value: `${save[i].name} : ${save[i].value}강화`,
        });
      }

      interaction.channel.send({ embeds: [embed] });
    } else if (interaction.options.getSubcommand() === "방어권구매") {
      const args = interaction.options.getInteger("수량");
      const gambling_find = await gambling_Schema.findOne({
        userid: interaction.user.id,
      });

      const money_find = await money_Schema.findOne({
        userid: interaction.user.id,
      });

      if (!gambling_find) {
        interaction.reply({
          content: `**아이템이 없으시군요.. \`/아이템\` 명령어로 아이템을 생성하세요.**`,
        });
        return;
      }

      const confirm = new ButtonBuilder()
        .setCustomId(`defense`)
        .setLabel(`구매`)
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder().addComponents(confirm);

      const msg = await interaction.reply({
        content: `방어권 ${args} 개를 사시겠습니까? 가격: ${(
          args * 50000
        ).toLocaleString()}재화`,
        components: [row],
      });

      const collector = msg.createMessageComponentCollector({
        time: 10_000,
        filter: (i) => i.user.id == interaction.user.id,
        max: 1,
      });

      collector.on("collect", async (inter) => {
        try {
          if (!money_find || money_find.money < args * 50000) {
            const embed = new EmbedBuilder()
              .setDescription(`**돈이 부족합니다**`)
              .setColor("Red");

            interaction.reply({ embeds: [embed], ephemeral: true });
            return;
          }

          await money_Schema.updateOne(
            { userid: interaction.user.id },
            { money: Number(money_find.money) - args * 50000 },
          );

          await gambling_Schema.updateOne(
            { userid: interaction.user.id },
            {
              hashtags: gambling_find.hashtags,
              cooltime: gambling_find.cooltime,
              defense: (gambling_find?.defense || 0) + args,
            },
            { upsert: true },
          );

          inter.reply({
            content: "성공적으로 구매되었습니다.",
            ephemeral: true,
          });
        } catch (error) {
          console.log(error);
          interaction.editReply({
            content: "error: " + error,
          });
        }
      });
    }
  },
};
