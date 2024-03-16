const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const gambling_Schema = require("../../models/Money")
const lands_Schema = require("../../models/lands")
const Player_lands_Schema = require("../../models/Player_land")
const Canvas = require('canvas');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("땅")
    .setDescription("땅에 대한 명령어입니다.")
    .addSubcommand((subcommand) =>
        subcommand
        .setName("목록")
        .setDescription("자신의 땅, 판매 중인 땅 등을 확인하세요")
    )
    .addSubcommand((subcommand) =>
        subcommand
        .setName("상세확인")
        .setDescription("특정 땅을 상세하게 확인하세요")
        .addIntegerOption((options) =>
          options
            .setName("번호")
            .setDescription("확인할 땅의 번호를 입력하세요")
            .setMinValue(1)
            .setMaxValue(100)
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
        subcommand
        .setName("구매")
        .setDescription("판매중인 땅을 구매하세요")
        .addIntegerOption((options) =>
          options
            .setName("번호")
            .setDescription("구매할 땅의 번호를 입력하세요")
            .setMinValue(1)
            .setMaxValue(100)
            .setRequired(true),
        ),
    ),
    /**
     * 
     * @param {import(*discord.js*).ChatInputCommandInteraction} interaction
     */
    async execute(interaction){
        const statue = {
            "For Sale" : '#f9ff00',
            "Owned": '#00f078',
            "Ally": '#0078f0',
            "Enemy": '#f00000',
            "Other": '#ffffff',
        }

        if (interaction.options.getSubcommand() === "목록") {
            const Player_lands_find = await Player_lands_Schema.findOne({
                userid:interaction.user.id
            })

            interaction.reply("# **현재 땅**")

            const canvas = Canvas.createCanvas(300, 300)
            const context = canvas.getContext('2d')

            context.textAlign = "center"
            // context.fillStyle = '#ffffff';
            // context.fillRect(0, 0, canvas.width, canvas.height);
            for (let i2 = 1; i2 < 11; i2++) {
                for (let i = 1; i < 11; i++) {
                    const lands_find = await lands_Schema.findOne({
                        landsid:(i2 - 1) * 10 + i
                    })

                    const playerland = (Player_lands_find?.lands || [])
                    const playerally = (Player_lands_find?.ally || [])
                    const playerenemy = (Player_lands_find?.enemy || [])

                    var allyNumbers = []

                    for (let i = 0; i < playerally.length; i++) {
                        const element = playerally[i];
                        const Player_lands_find = await Player_lands_Schema.findOne({
                            userid:element
                        }) 
        
        
                        Player_lands_find.lands.forEach(element => {
                            allyNumbers.push(element)
                        }); 
                    }
        
                    var enemyNumbers = []
        
                    for (let i = 0; i < playerenemy.length; i++) {
                        const element = playerenemy[i];
                        const Player_lands_find = await Player_lands_Schema.findOne({
                            userid:element
                        }) 
        
        
                        Player_lands_find.lands.forEach(element => {
                            enemyNumbers.push(element)
                        }); 
                    }

                    context.fillStyle = 
                    playerland.filter((land) => land == (i2 - 1) * 10 + i).length != 0 
                    ? statue["Owned"] 
                    : allyNumbers.filter((land) => land == (i2 - 1) * 10 + i).length != 0 
                    ? statue["Ally"] 
                    : enemyNumbers.filter((land) => land == (i2 - 1) * 10 + i).length != 0 
                    ? statue["Enemy"] 
                    : lands_find.owner != ""
                    ? statue["Other"]
                    : statue["For Sale"]

                    context.beginPath();
                    context.rect((i - 1) * 30, (i2 - 1) * 30, 30, 30);
                    context.fill();
                    //context.fillRect(0, 0, i * 30, i * 30);
                    
                    context.fillStyle = 'black';
                    context.font = 'Sans 30px'
                    context.fillText((i2 - 1) * 10 + i, 15 + (i - 1) * 30, 15 + (i2 - 1) * 30)

                }   
            }

            for (let i = 1; i < 10; i++) {
                context.moveTo(i * 30, 0);
                context.lineTo(i * 30, canvas.height);
                context.stroke();

                context.moveTo(0, i * 30);
                context.lineTo(canvas.width, i * 30);
                context.stroke();

            }

            interaction.channel.send({
                files: [{
                attachment: canvas.toBuffer(),
                name: 'grid.png'
            }]
            });

            interaction.channel.send("노란색: 판매중인 땅\n초록색: 보유한 땅\n파란색: 동맹국 땅\n빨간색: 적 땅\n흰색: 중립")
        }else if(interaction.options.getSubcommand() === "상세확인"){
            const args = interaction.options.getInteger("번호");

            const lands_find = await lands_Schema.findOne({
                landsid:args
            })

            const Player_lands_find = await Player_lands_Schema.findOne({
                userid:interaction.user.id
            })

            const playerland = (Player_lands_find?.lands || [])
            const playerally = (Player_lands_find?.ally || [])
            const playerenemy = (Player_lands_find?.enemy || [])

            var allyNumbers = []

            for (let i = 0; i < playerally.length; i++) {
                const element = playerally[i];
                const Player_lands_find = await Player_lands_Schema.findOne({
                    userid:element
                }) 

                console.log(Player_lands_find)

                Player_lands_find.lands.forEach(element => {
                    allyNumbers.push(element)
                }); 
            }

            var enemyNumbers = []

            for (let i = 0; i < playerenemy.length; i++) {
                const element = playerenemy[i];
                const Player_lands_find = await Player_lands_Schema.findOne({
                    userid:element
                }) 

                console.log(Player_lands_find)

                Player_lands_find.lands.forEach(element => {
                    enemyNumbers.push(element)
                }); 
            }

            const color =
            playerland.filter((land) => land == args).length != 0 
            ? statue["Owned"] 
            : allyNumbers.filter((land) => land == args).length != 0 
            ? statue["Ally"] 
            : enemyNumbers.filter((land) => land == args).length != 0 
            ? statue["Enemy"] 
            : lands_find.owner != ""
            ? statue["Other"]
            : statue["For Sale"]

            

            var user = null

            if (lands_find.owner != ""){
                user = await interaction.client.users.fetch(
                    lands_find.owner
                )
            }

            const embed = new EmbedBuilder()
              .setDescription(args + "땅의 상세정보")
              .addFields(
                { name: "땅 주인", value: `**${!user ? "없음" : user.username}**` },
                { name: "땅 값", value: `**${lands_find.price.toLocaleString()}**` },

              )
              .setColor(color);

              interaction.reply({embeds : [embed]})
        }else if(interaction.options.getSubcommand() === "구매"){
            const args = interaction.options.getInteger("번호");
            const lands_find = await lands_Schema.findOne({
                landsid:args
            })
            const Player_lands_find = await Player_lands_Schema.findOne({
                userid:interaction.user.id
            })
            let gambling_find = await gambling_Schema.findOne({
                userid:interaction.user.id
            })

            if (gambling_find.money < lands_find.price){
                interaction.reply({
                    content: `**돈이 부족합니다.\n\n당신의 돈: ${gambling_find.money.toLocaleString()}\n땅 값: ${lands_find.price.toLocaleString()}**`,
                });
                return;
            }

            if (lands_find.owner != ""){
                interaction.reply({
                    content: `**판매중인 땅이 아닙니다.**`,
                });
                return;
            }

            await gambling_Schema.updateOne(
                {userid: interaction.user.id},
                {money: gambling_find.money - lands_find.price, cooltime: gambling_find.cooltime},
                {upsert:true}
            );

            var lands = (Player_lands_find?.lands || [])
            var ally = (Player_lands_find?.ally || [])
            var enemy = (Player_lands_find?.enemy || [])

            console.log(lands)

            lands.push(args)

            console.log(lands)

            await Player_lands_Schema.updateOne(
                {userid: interaction.user.id},
                {lands: lands, ally: ally, enemy: enemy},
                {upsert:true}
            );

            await lands_Schema.updateOne(
                {landsid:args},
                {price: lands_find.price, owner: interaction.user.id},
                {upsert:true}
            );

            const embed = new EmbedBuilder()
            .setDescription(
                `**성공적으로 땅을 구매했습니다. 남은 돈: ${
                    (gambling_find.money - lands_find.price).toLocaleString()
                }**`
            )
            .setColor("Green");
        
        interaction.reply({embeds: [embed]});
        }
    }
}
