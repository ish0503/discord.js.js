const {
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("문의")
    .setDescription("봇의 대한 문의를 개발자에게 전송합니다"),
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const modal = new ModalBuilder().setCustomId("inquiry").setTitle("봇 문의");

    const title = new ActionRowBuilder({
      components: [
        new TextInputBuilder()
          .setCustomId("title")
          .setLabel("제목")
          .setStyle(TextInputStyle.Short),
      ],
    });

    const ds = new ActionRowBuilder({
      components: [
        new TextInputBuilder()
          .setCustomId("ds")
          .setLabel("설명")
          .setStyle(TextInputStyle.Paragraph),
      ],
    });

    modal.addComponents(title, ds);

    await interaction.showModal(modal);

    const collector = await interaction.awaitModalSubmit({
      time: 10 * 60 * 1000,
    });

    if (collector) {
      const title_value = collector.fields.fields.get("title")?.value;
      const ds_value = collector.fields.fields.get("ds")?.value;

      const embed = new EmbedBuilder()
        .setTitle(`문의 도착 (${interaction.user.tag})`)
        .setDescription(`**제목 : ${title_value}\n\n설명 : ${ds_value}**`)
        .setFooter({ text: `유저 아이디 : ${interaction.user.id}` })
        .setColor("Green")
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }));

      const developer_channel = interaction.client.channels.cache.get(
        "1137296898701664256"
      );

      developer_channel.send({ embeds: [embed] });

      collector.reply({
        ephemeral: true,
        content: `**문의가 전송되었습니다!**`,
      });
    }
  },
};