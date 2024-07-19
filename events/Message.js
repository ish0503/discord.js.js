const client = require("../index");

module.exports = {
  name: "message",
  once: true,
  async execute(message) {
    if (message.author.bot) return;

    const args = message.content.split(/ +/);
    const mentionedUsers = message.mentions.users;

    const isBotMentioned = mentionedUsers.size
        ? mentionedUsers.first().id === client.user.id
        : false;

    if (isBotMentioned && args.length === 1) 
        return message.channel.send(`What now, ${message.author}?`);
  },
};
