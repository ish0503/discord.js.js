const { SlashCommandBuilder , EmbedBuilder } = require("discord.js")  
const comma = require("comma-number")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("숫자맞추기")
        .setDescription("숫자맞추기를 시작합니다."),
    /**
     * 
     * @param {import("discord.js").CommandInteraction} interaction
     * @returns
     * 
     */
    async execute(interaction) {
        var channel = `1157256146227310632`
        if (interaction.channel.id == channel) {
            const embed = new EmbedBuilder()
            .setTitle('숫자맞추기')
            .setDescription('숫자맞추기를 시작합니다. 숫자를 말해주세요.')
            .setColor('2F3136')
            interaction.reply({embeds: [embed], ephemeral: true});

            const gambling_Schema = require("../../models/Money")  
            const gambling_find = await gambling_Schema.findOne({
                userid:interaction.user.id
            })

            function random(min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            }
            async function changemoney(money){
                await gambling_Schema.updateOne(
                    {userid: interaction.user.id},
                    {money: (gambling_find.money || 1) + money},
                    {upsert:true}
                );
            }
            var num = random(1, 100)
            var count = 0
            
            const filter = m => m.author.id === interaction.user.id;
            const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });
            collector.on('collect', m => {
                var number = parseInt(m.content)
                if (number > num) {
                    count = count + 1
                    interaction.followUp({content: `더 낮습니다.`, ephemeral: true});
                } else if (number < num) {
                    count = count + 1
                    interaction.followUp({content: `더 높습니다.`, ephemeral: true});
                }
                if (number == num) {
                    count = count + 1
                    const money = Math.round(25000 / count)
                    changemoney(money)
                    interaction.followUp({content: `정답입니다! ${count}번 만에 맞추셨습니다!\n${comma(money)}재화가 들어왔습니다!`, ephemeral: true});

                    collector.stop()
                }
            });
            collector.on('end', collected => {
                if (collected.size == 0) {
                    interaction.followUp({content: `시간이 초과되었습니다.`, ephemeral: true});
                }
            }
            );
        }else{
            const embed = new EmbedBuilder()
            .setTitle('오류')
            .setDescription('해당 명령어는 새늅봇 서버의 봇 서버에서만 가능합니다.\n새늅봇 서버에서 써주세요.(https://discord.com/invite/rEcg8NajwX)')
            .setColor('964242')
            interaction.reply({embeds: [embed], ephemeral: true});
        }
    }
};
