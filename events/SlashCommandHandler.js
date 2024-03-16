const client = require("../index");

module.exports = {
  name: "interactionCreate",
  once: false,
  /**
   *
   * @param {import("discord.js").Interaction} interaction
   */
  async execute(interaction) {
    if (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand()) return;
    if (interaction.isCommand()) { // Checks if the interaction is a command and runs the `
      const command = client.commands.get(interaction.commandName);
      
      if(!command) return;

      const list = client.guilds.cache.get("1064545201647013978");
      var members
      try{
        members = await list.members.fetch(interaction.user.id)
      }catch (err){
        await interaction.reply("이 봇은 현재 공공적 목적으로 만들지 않았기 때문에 특정 사람만 이용 가능합니다.")
        return;
      }
      await command.execute(interaction);
      return;

  }
  },
};
