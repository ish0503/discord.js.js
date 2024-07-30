const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder,
} = require("discord.js");

const gambling_Schema = require("../../models/Money")
const level_Sechma = require("../../models/level")
const bank_Schema = require("../../models/bank")
const calculation_Schema = require("../../models/calculation");

const bank = require("../stock/bank")

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("유저정보")
    .setType(ApplicationCommandType.User),
  /**
   *
   * @param {import("discord.js").UserContextMenuCommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.deferReply();

    const User = interaction.targetUser;

    const gambling_find = await gambling_Schema.findOne({
      userid:User.id
    })

    const level_find = await level_Sechma.findOne({
        userid:User.id
    })

    const bank_find = await bank_Schema.findOne({
      userid: User.id
    })

    const calculation_find = await calculation_Schema.findOne({
      userid: User.id,
    });

    let bot;
    if (User.bot == true) {
      bot = "봇입니다";
    } else {
      bot = "이 사람이 봇이겠어요?";
    }
    const embed = new EmbedBuilder()
      .setTitle(`${User.tag} 또는 ${User.globalName}님의 유저정보`)
      .setColor(User.accentColor || "Green")
      .setTimestamp()
      .setThumbnail(`${User.displayAvatarURL({ dynamic: true })}`)
      .addFields(
        { name: "아이디", value: `**${User.id}**` },
        { name: "봇 여부", value: `**${bot}**` },
        {
          name: "배지",
          value: `**${User.flags.toArray().join(", ") || "없음"}**`,
        },
        {
          name: "유저 이름",
          value: `**${User.username}#${User.discriminator}**`,
        },
        {
          name: "돈",
          value: `**${(gambling_find?.money || 0).toLocaleString()}**`,
        },
        {
          name: "레벨",
          value: `**${(level_find?.level || 1).toLocaleString()}**`,
        },
        {
          name: "저축량",
          value: `**${(bank_find?.bankmoney || 0)} (+${(bank_find?.bankmoney || 0) * (bank.금리 / 100) * (bank_find?.bankmoneycount || 0)})**`,
        },
        {
          name: "대출량",
          value: `**${(bank_find?.interestmoney || 0)} (+${(bank_find?.interestmoney || 0) * (bank.금리 / 100) * (bank_find?.interestcount || 0)})**`,
        },
        {
          name: "경력",
          value: `**${(calculation_find?.career || 0).toLocaleString()}**`,
        },
        {
          name: "연산량",
          value: `**${(calculation_find?.calculation || 0) }**`,
        }
      );
    interaction.editReply({ embeds: [embed] });
  },
};