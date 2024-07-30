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

module.exports = {
  data: new SlashCommandBuilder()
    .setName("스킬")
    .setDescription("스킬 명령어입니다!")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("생성")
        .setDescription("자신만의 스킬을 창작해보세요!")
        .addStringOption((options) =>
          options
            .setName("이름")
            .setDescription("스킬의 이름 입력해주세요.")
            .setMaxLength(50)
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("삭제")
        .setDescription("스킬을 삭제합니다.")
        .addStringOption((options) =>
          options
            .setName("이름")
            .setDescription("스킬의 이름 입력해주세요.")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("강화")
        .setDescription("자신만의 스킬을 강화해보세요!")
        .addStringOption((options) =>
          options
            .setName("이름")
            .setDescription("스킬의 이름 입력해주세요.")
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("이름변경")
        .setDescription("자신의 스킬의 이름을 변경할수 있습니다.")
        .addStringOption((options) =>
          options
            .setName("스킬이름")
            .setDescription("스킬의 이름 입력해주세요.")
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
          "자기가 직접 만들고 강화한 스킬들을 확인할 수 있습니다.",
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("순위")
        .setDescription("스킬 강화 횟수로 순위를 봅니다."),
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

      if (gambling_find.skills) {
        const canGiveTime = Number(gambling_find.cooltime) + 1 * 30 * 1000;
        if (canGiveTime && canGiveTime > Date.now()) {
          interaction.reply({
            content: `**스킬 강화/생성 후에는 쿨타임이 있습니다.\n<t:${Math.round(
              canGiveTime / 1000,
            )}> (<t:${Math.round(canGiveTime / 1000)}:R>)**`,
          });
          return;
        }
      }
      let length = gambling_find.skills.length;
      let isitem = -1;
      let hasitem = [];

      for (let i = 0; i < length; i++) {
        if (gambling_find.skills[i].name == args) {
          isitem = i;
        } else {
          hasitem.push({
            name: gambling_find.skills[i].name,
            Lv: gambling_find.skills[i].Lv,
          });
        }
      }

      if (isitem == -1) {
        const embed = new EmbedBuilder()
          .setDescription(`**당신에게 없는 스킬을 강화하라구요? 참나**`)
          .setColor("Red");

        interaction.reply({ embeds: [embed] });
        return;
      }

      const random_number = Math.round(Math.random() * 10000);
      const random_upgrade = Math.round(Math.random() * 9) + 1; // 1에서 2사이

      if (
        random_number + (level_find?.level || 1) * 100 >
        gambling_find.skills[isitem].Lv ** 3
      ) {
        hasitem.push({
          name: args,
          Lv: gambling_find.skills[isitem].Lv + random_upgrade,
        });
        await gambling_Schema.updateOne(
          { userid: interaction.user.id },
          {
            $set: {
              skills: hasitem,
              hashtags: gambling_find?.hashtags || [],
              cooltime: Date.now(),
              defense: gambling_find?.defense || 0,
            },
          },
          { upsert: true },
        );

        const embed = new EmbedBuilder()
          .setTitle(
            `**강화 확률: ${
              (10000 +
                (level_find?.level || 1) * 100 -
                gambling_find.skills[isitem].Lv ** 3) /
              100
            }%**`,
          )
          .setDescription(
            `**강화 성공! 이름: ${args}, 강화 수: ${
              gambling_find.skills[isitem].Lv
            } -> ${gambling_find.skills[isitem].Lv + random_upgrade}**`,
          )
          .setColor("Green");

        interaction.reply({ embeds: [embed] });
      } else {
        if ((gambling_find?.defense || 0) < 1) {
          hasitem.push({
            name: args,
            Lv: gambling_find.skills[isitem].Lv - random_upgrade,
          });
          await gambling_Schema.updateOne(
            { userid: interaction.user.id },
            {
              $set: {
                skills: hasitem,
                hashtags: gambling_find?.hashtags || [],
                cooltime: Date.now(),
                defense: gambling_find?.defense || 0,
              },
            },
            { upsert: true },
          );

          const embed = new EmbedBuilder()
            .setTitle(
              `**강화 확률: ${
                (10000 +
                  (level_find?.level || 1) * 100 -
                  gambling_find.skills[isitem].Lv ** 3) /
                100
              }%**`,
            )
            .setDescription(
              `**강화 실패.. 이름: ${args}, 강화 수: ${
                gambling_find.skills[isitem].Lv
              } -> ${gambling_find.skills[isitem].Lv - random_upgrade}**`,
            )
            .setColor("Red");

          interaction.reply({ embeds: [embed] });
        } else {
          await gambling_Schema.updateOne(
            { userid: interaction.user.id },
            {
              $set: {
                skills: gambling_find?.hasitem,
                hashtags: gambling_find?.hashtags || [],
                cooltime: Date.now(),
                defense: gambling_find?.defense - 1,
              },
            },
            { upsert: true },
          );

          const embed = new EmbedBuilder()
            .setTitle(
              `방어. 확률: ${
                (10000 +
                  (level_find?.level || 1) * 100 -
                  gambling_find.skills[isitem].Lv ** 3) /
                100
              }%`,
            )
            .setDescription(
              `**당신의 방어권으로 스킬이 보존되었습니다. \n남은 방어권: ${
                gambling_find?.defense - 1
              }개**`,
            )
            .setColor("Blue");

          interaction.reply({ embeds: [embed] });
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

      console.log(gambling_find);
      console.log(money_find);

      if (gambling_find && gambling_find.skills) {
        const canGiveTime = Number(gambling_find.cooltime) + 1 * 30 * 1000;
        if (canGiveTime && canGiveTime > Date.now()) {
          interaction.reply({
            content: `**스킬 강화/생성 후에는 쿨타임이 있습니다.\n<t:${Math.round(
              canGiveTime / 1000,
            )}> (<t:${Math.round(canGiveTime / 1000)}:R>)**`,
          });
          return;
        }
      }

      if (gambling_find && gambling_find.skills) {
        let length = gambling_find.skills.length;
        let isitem = -1;
        for (let i = 0; i < length; i++) {
          if (gambling_find.skills[i].name == args) {
            isitem = i;
          }
        }

        if (isitem != -1) {
          const embed = new EmbedBuilder()
            .setDescription(
              `**이미 당신에게 있는 스킬을 또 생성할 수 없습니다.**`,
            )
            .setColor("Red");

          interaction.reply({ embeds: [embed] });
          return;
        }

        if (length > 5) {
          const embed = new EmbedBuilder()
            .setDescription(`**5개 이상의 스킬을 생성할 수 없습니다.**`)
            .setColor("Red");

          interaction.reply({ embeds: [embed] });
          return;
        }
      }

      if (!money_find || money_find.money < 25000) {
        const embed = new EmbedBuilder()
          .setDescription(`**스킬을 생성하려면 돈 25000재화가 필요합니다.**`)
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
            skills: [{ name: args, Lv: 0 }],
          },
          hashtags: gambling_find?.hashtags || [],
          cooltime: Date.now(),
          defense: gambling_find?.defense || 0,
        },
        { upsert: true },
      );

      const embed = new EmbedBuilder()
        .setDescription(
          `**25000재화를 주고 스킬이 생성 되었습니다. 이름: ${args}, 강화 수: 0**`,
        )
        .setColor("Green");

      interaction.reply({ embeds: [embed] });
    } else if (interaction.options.getSubcommand() === "삭제") {
      const args = interaction.options.getString("이름");
      const gambling_find = await gambling_Schema.findOne({
        userid: interaction.user.id,
      });

      console.log(gambling_find);

      if (!gambling_find) {
        interaction.reply({
          content: `**스킬이 없으시군요.. \`/스킬\` 명령어로 스킬을 생성하세요.**`,
        });
        return;
      }

      let soondeleteitem = [];

      let length = gambling_find.skills.length;
      let isitem = -1;
      for (let i = 0; i < length; i++) {
        if (gambling_find.skills[i].name == args) {
          isitem = i;
        } else {
          soondeleteitem.push({
            name: gambling_find.skills[i].name,
            Lv: gambling_find.skills[i].Lv,
          });
        }
      }

      if (isitem == -1) {
        const embed = new EmbedBuilder()
          .setDescription(
            `**스킬을 찾을 수 없습니다.. 공기라도 없애라는 건가요?**`,
          )
          .setColor("Red");

        interaction.reply({ embeds: [embed] });
        return;
      }

      console.log(soondeleteitem);

      await gambling_Schema.updateOne(
        { userid: interaction.user.id },
        {
          $set: {
            skills: soondeleteitem, //[{"name": null}]
            //{ "name": args, "Lv": 0 },
          },
          hashtags: gambling_find?.hashtags || [],
          cooltime: Date.now(),
          defense: gambling_find?.defense || 0,
        },
        { upsert: true },
      );

      // $push: {
      //     quizzes: {
      //        $each: [ { wk: 5, score: 8 }, { wk: 6, score: 7 }, { wk: 7, score: 6 } ],
      //        $sort: { score: -1 },
      //        $slice: 3
      //     }
      //   }

      //{ "name": args, "Lv": 0}

      //gambling_Schema.findOneAndRemove({name : gambling_find.skills[isitem]})

      const embed = new EmbedBuilder()
        .setDescription(`**스킬이 성공적으로 삭제 되었습니다. 이름: ${args}**`)
        .setColor("Green");

      interaction.reply({ embeds: [embed] });
    } else if (interaction.options.getSubcommand() === "확인") {
      const gambling_find = await gambling_Schema.findOne({
        userid: interaction.user.id,
      });

      if (!gambling_find.skills) {
        interaction.reply({
          content: `**스킬이 없으시군요.. \`/스킬\` 명령어로 스킬을 생성하세요.**`,
        });
        return;
      }

      const embed = new EmbedBuilder()
        .setDescription(`**${interaction.user}님의 스킬**`)
        .setColor("Green");

      let length = gambling_find.skills.length;
      for (let i = 0; i < length; i++) {
        console.log("반복" + i);
        console.log(gambling_find.skills[i]);
        if (!gambling_find.skills[i]) {
          continue;
        }
        var item = gambling_find.skills[i];
        console.log(item);
        embed.addFields({
          name: `${i + 1}. ${item.name}`,
          value: `강화수 : **${item.Lv}**`,
        });
      }

      embed.addFields({
        name: `강화보호권`,
        value: `${gambling_find?.defense || 0}개**`,
      });

      interaction.reply({ embeds: [embed] });
    } else if (interaction.options.getSubcommand() === "이름변경") {
      const args = interaction.options.getString("스킬이름");
      const args2 = interaction.options.getString("변경이름");
      const gambling_find = await gambling_Schema.findOne({
        userid: interaction.user.id,
      });

      console.log(gambling_find);

      if (!gambling_find.skills) {
        interaction.reply({
          content: `**스킬이 없으시군요.. \`/스킬\` 명령어로 스킬을 생성하세요.**`,
        });
        return;
      }

      let soondeleteitem = [];

      let length = gambling_find.skills.length;
      let isitem = -1;
      for (let i = 0; i < length; i++) {
        if (gambling_find.skills[i].name == args) {
          isitem = i;
          soondeleteitem.push({ name: args2, Lv: gambling_find.skills[i].Lv });
        } else {
          soondeleteitem.push({
            name: gambling_find.skills[i].name,
            Lv: gambling_find.skills[i].Lv,
          });
        }
      }

      if (isitem == -1) {
        const embed = new EmbedBuilder()
          .setDescription(
            `**스킬을 찾을 수 없습니다.. 공기라도 바꾸라는 건가요?**`,
          )
          .setColor("Red");

        interaction.reply({ embeds: [embed] });
        return;
      }

      console.log(soondeleteitem);

      await gambling_Schema.updateOne(
        { userid: interaction.user.id },
        {
          $set: {
            skills: soondeleteitem, //[{"name": null}]
            //{ "name": args, "Lv": 0 },
          },
          hashtags: gambling_find?.hashtags || [],
          cooltime: Date.now(),
          defense: gambling_find?.defense || 0,
        },
        { upsert: true },
      );

      const embed = new EmbedBuilder()
        .setDescription(`**스킬이 성공적으로 변경 되었습니다. ${args2}로요.**`)
        .setColor("Green");

      interaction.reply({ embeds: [embed] });
    } else if (interaction.options.getSubcommand() === "순위") {
      interaction.reply("순위 집계중");
      // const gambling_find = await gambling_Schema.findOne({
      //     userid:interaction.user.id
      // })

      const gambling_find = await gambling_Schema.find().exec();

      const embed = new EmbedBuilder()
        .setTitle(`${interaction.client.user.username} 강화 순위`)
        .setColor("Green")
        .setThumbnail(interaction.client.user.displayAvatarURL());

      let save = [];

      for (let i = 0; i < Object.keys(gambling_find).length; i++) {
        if (!gambling_find[i].skills) {
          continue;
        }
        let json3 = JSON.parse(JSON.stringify(gambling_find[i].skills));
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
        if (a.Lv > b.Lv) {
          return -1;
        }
        if (a.Lv < b.Lv) {
          return 1;
        }
        // a must be equal to b
        return 0;
      });

      for (let i = 0; i < 10; i++) {
        const user = await interaction.client.users.fetch(save[i].userid);
        embed.addFields({
          name: `${i + 1}. ${user.username}`,
          value: `${save[i].name} : ${save[i].Lv}강화`,
        });
      }

      interaction.editReply({ embeds: [embed] });
    }
  },
};
