const client = require("../index");

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message) {
    if (message.author.bot) return;

    const args = message.content.split(/ +/);
    const mentionedUsers = message.mentions.users;

    const isBotMentioned = mentionedUsers.size
        ? mentionedUsers.first().id === client.user.id
        : false;

    console.log(isBotMentioned, args.length) 

    if (isBotMentioned && args.length === 1) 
        return message.channel.send(`무슨일이야, ${message.author}센세?`);
    else if(isBotMentioned && args.length === 2)
      return message.channel.send(`${args[1]}!`);
  },
};
