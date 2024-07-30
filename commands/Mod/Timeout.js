const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

        
module.exports = {
  data: new SlashCommandBuilder()
    .setName("타임아웃")
    .setDescription("시끄러운 사람들을 조용히 시키자 ㅋㅋ")
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
    .addUserOption((option) =>
      option
        .setName("유저")
        .setDescription("조용히 시킬 사람을 골라주세요")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("시간")
        .setDescription("시간을 지정해주세요 | 단위:초 ")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("사유")
        .setDescription("타임아웃 시키려면 조용히 시키는 이유를 대십시오")
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const member = interaction.options.getMember("유저");
    const reason = interaction.options.getString("사유");
    const time = interaction.options.getInteger("시간");
    
    try {
      await member.timeout(time * 1000, reason); // * 0 제거
      await interaction.editReply({
        content: `시간이 ${time}초동안 지정됬습니다 **<@!${member.id}>** **( ${member.user.tag} )**`,
      });
    } catch {
      await interaction.editReply({
        content: "권한이 부족합니다.",
      });
    }
  },
};