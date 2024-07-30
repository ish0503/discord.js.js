const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const { connection } = require("mongoose");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("추방")
    .setDescription("사람들을 추방시킬수 있습니다.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addStringOption(options => options
        .setName("유저")
        .setDescription("작성 방법: (19129458,48723928) 식으로 유저 id뒤 쉼표 넣기")
        .setRequired(true)
    )
    .addStringOption(option => option
		.setName('선택')
		.setDescription('킥 or 밴')
		.setRequired(true)
		.addChoices(
			{ name: '킥', value: '킥' },
			{ name: '밴', value: '밴' },
		)
    )
    .addStringOption(option => option
		.setName('사유')
		.setDescription('사유 입력')
        .setRequired(false)
        .setMaxLength(500)
    ),
            
    /**
     * 
     * @param {import(*discord.js*).ChatInputCommandInteraction} interaction
     */
    async execute(interaction){
        const category = interaction.options.getString('선택');
        const member = interaction.options.getString('유저').split(',');
        const reason = interaction.options.getString('사유');

        // if (!member.bannable){
        //     interaction.reply({content: `**멤버를 추방할수 없습니다.**`})
        //     return
        // }

        const embed = new EmbedBuilder({title:"멤버를 추방 하시겠습니까?"})
        .setColor("Blue")

        const buttons = new ActionRowBuilder({
            components: [
                new ButtonBuilder()
                .setCustomId("no")
                .setLabel("취소")
                .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                .setCustomId("yes")
                .setLabel("확인")
                .setStyle(ButtonStyle.Success),
            ]
        })

        const msg = await interaction.reply({
            embeds: [embed],
            components: [buttons],
        })

        const collector = msg.createMessageComponentCollector({
            time: 60_000,
            filter: (i) => i.user.id == interaction.user.id,
            max: 1
        })

        collector.on("collect", async (inter) => {
            if (inter.customId != "yes"){
                interaction.deleteReply()
                return;
            }
            if (category == "킥"){
                try{
                    let namearr = ""
                    member.forEach(element => {
                        const member = interaction.guild.members.cache.get(element);
                        if (member){
                            namearr += member.username + " "
                            member.kick({reason: reason})
                        }
                    });
    
                    interaction.editReply({
                        content: `**${namearr}를 킥하였습니다.**`,
                        embeds: [],
                        components: [],
                    })
                }catch (error){
                    console.log(error);
                    interaction.editReply({
                        content: "error: "+error
                    })
                }
            }else{
                try{
                    const namearr = ""
                    member.forEach(element => {
                        const member = interaction.guild.members.cache.get(element);
                        if (member){
                            namearr += member.username + " "
                            member.ban({reason: reason})
                        }
                    });
    
                    interaction.editReply({
                        content: `**${namearr}를 벤하였습니다.**`,
                        embeds: [],
                        components: [],
                    })
                }catch (error){
                    console.log(error);
                    interaction.editReply({
                        content: "error: "+error
                    })
                }
            }
        })

    }
}