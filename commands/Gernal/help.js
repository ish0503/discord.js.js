const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("명령어")
    .setDescription("명령어들을 봅니다."),

    /**
     * 
     * @param {import(*discord.js*).ChatInputCommandInteraction} interaction
     */
    async execute(interaction){
        //client.slashcommands = new Collection();
        //client.commands = new Collection();
        function splitIntoChunk(arr, chunk) {
            // 빈 배열 생성
            const result = [];
            
            for (index=0; index < arr.length; index += chunk) {
              let tempArray;
              // slice() 메서드를 사용하여 특정 길이만큼 배열을 분리함
              tempArray = arr.slice(index, index + chunk);
              // 빈 배열에 특정 길이만큼 분리된 배열을 추가
              result.push(tempArray);
            }
            
            return result;
        }

        const commands = [];

        const commandsCategoryPath = "./commands";
        const commandsCategoryFiles = fs.readdirSync(commandsCategoryPath);

        for (const category of commandsCategoryFiles) {
        const commandsPath = `./commands/${category}`;
        const commandsFiles = fs
            .readdirSync(commandsPath)
            .filter((file) => file.endsWith(".js"));
        for (const file of commandsFiles) {
            const command = require(`../../commands/${category}/${file}`);
            //client.commands.set(command.data.name, command);
            commands.push(command.data);
        }
        }

        const command2 = splitIntoChunk(commands, 25);

        for (let v = 0; v < command2.length; v++){
            var embed = new EmbedBuilder()
            .setTitle("명령어 모음"+(v+1))
            .setColor("Green");
                for (let i = 0; i < command2[v].length; i++){
                    embed.addFields({
                        name: `이름: ${command2[v][i].name}`,
                        value: `설명: ${command2[v][i].description || "어라? 설명이 없네요"}`,
                        inline: true
                    })
                }
            interaction.channel.send({embeds: [embed]});
        }
        interaction.reply({content: "모든 커맨드를 알려드렸어요!", ephemeral: true})
    }
}