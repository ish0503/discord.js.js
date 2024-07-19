const lands_Schema = require("../../models/lands")
const Player_lands_Schema = require("../../models/Player_land")
const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()

    .setName("땅초기화")
    .setDescription("땅을 초기화한다"),
    /**
     * 
     * @param {import(*discord.js*).ChatInputCommandInteraction} interaction
     */
    async execute(interaction){
        if (interaction.user.username == "birdnoob"){
            interaction.reply("땅초기화를 진행할게!")
            for (let index = 1; index < 101; index++) {
                console.log(index + "번째 데이터 저장중")
                await lands_Schema.updateOne(
                    {landsid:index},
                    {
                        price: 1000000, 
                        owner: "", 
                        army: 0,
                        level: 1,
                        buildings : []
                    },
                    {upsert:true}
                ).then(() => console.log(index + "번째 데이터 저장완료"))
            }
            interaction.channel.send("모든 땅 초기화를 완료했어. 헤헷..")
        }else{
            interaction.reply("삐빕- 에러발생-")
        }
    }
}