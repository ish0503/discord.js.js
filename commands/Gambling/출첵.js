const { SlashCommandBuilder , EmbedBuilder } = require('discord.js');
const _Schema = require("../../models/출석체크")
const gambling_Schema = require("../../models/Money")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("출석")
        .setDescription("오늘 출첵을 합니다."),
    /**
     * 
     * @param {import(*discord.js*).ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        let newData
        const gambling_find = await gambling_Schema.findOne({
            userid:interaction.user.id
        })
        const t = new Date()
        const user = await _Schema.findOne({ userid: interaction.user.id })
        const date = "" + t.getFullYear() + (t.getMonth() + 1) + t.getDate()
                if (!user) {
                    await _Schema.updateOne(
                    {userid: interaction.user.id},
                    { count: 1, date: date },
                    {upsert:true}
                    )
                    await gambling_Schema.updateOne(
                        {userid: interaction.user.id},
                        {money: Number(gambling_find?.money || 0) + 20000, cooltime: gambling_find?.cooltime || 0},
                        {upsert:true}
                    );
                    const embeds = new EmbedBuilder()
                    .setTitle("출석체크를 완료했어요.")
                    .setDescription(`1번째 <@${interaction.member.user.id}> 출석체크 완료! (+ 10000 재화)`)      
                    .setColor(`Blue`)
                    .setTimestamp()
                    //.setFooter(`${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL()) 
                    interaction.reply({embeds: [embeds]})
                } else {
                    const random = Math.round(Math.random() * (10000 * user.count || 0)) + 10000
                    //.setFooter(`${interaction.member.user}`, interaction.member.user.displayAvatarURL()) 
                    if (user.date == date){
                        const embedss = new EmbedBuilder()
                        .setTitle("출석 체크 이미 완료. 내일 또 와요 !")
                        .setDescription(`<@${interaction.member.user.id}>님은 이미 출석을 한 상태입니다.`)
                        .setColor(`Red`)
                        .setTimestamp()
                        interaction.reply({embeds: [embedss]})
                        return
                    }
                    await _Schema.updateOne(
                        {userid: interaction.user.id },
                        { 
                        count: parseInt(user.count) + 1,
                        date: date 
                    },
                    {upsert:true})
                    await gambling_Schema.updateOne(
                        {userid: interaction.user.id},
                        {money: Number(gambling_find?.money || 0) + random, cooltime: gambling_find?.cooltime || 0},
                        {upsert:true}
                    );
                    const embedsss = new EmbedBuilder()
                    .setTitle("출석체크를 완료했어요.")
                    .setDescription(`${parseInt(user.count) + 1}번째 <@${interaction.member.user.id}> 출석체크 완료! (+ ${random} 재화)`)
                    .setColor(`Green`)
                    .setTimestamp()
                    //.setFooter(`${interaction.member.user.tag}`, interaction.member.user.displayAvatarURL()) 
                    interaction.reply({embeds: [embedsss]})
                }
        }
    }