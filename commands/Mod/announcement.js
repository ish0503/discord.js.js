const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("공지")
    .setDescription("공지를 전송합니다")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((f) =>
      f
        .setName("채널")
        .setDescription("공지를 전송할 채널을 선택해 주세요")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption((f) =>
      f
        .setName("공지사항")
        .setDescription("공지사항을 입력해 주세요")
        .setRequired(true)
        .setMaxLength(4000)
    ),
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const option_channel = interaction.options.getChannel("채널");
    const option_content = interaction.options
      .getString("공지사항")
      .replace(/\\n/g, "\n");

    const nowTimeStamp = Math.round(Date.now() / 1000);

    const embed = new EmbedBuilder()
      .setTitle("공지사항")
      .setColor("Purple")
      .setFooter({
        text: `작성자 : ${
          interaction.user.discriminator == 0
            ? `@${interaction.user.username}`
            : interaction.user.tag
        }`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(option_content)
      .addFields({
        name: "작성 시간",
        value: `**<t:${nowTimeStamp}> (<t:${nowTimeStamp}:R>)**`,
      });

    try {
      await option_channel.send({ embeds: [embed] });
      interaction.reply({ content: "공지 전송이 완료되었습니다" });
    } catch (error) {
      interaction.reply({ content: "공지를 전송하지 못했습니다" });
    }
  },
};
