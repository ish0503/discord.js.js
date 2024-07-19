const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder,
} = require("discord.js");

const gambling_Schema = require("../../models/Money")
const level_Sechma = require("../../models/level")

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

    let bot;
    if (User.bot == true) {
      bot = "봇이야!";
    } else {
      bot = "사람이야!";
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
      );
    interaction.editReply({ embeds: [embed] });
  },
};