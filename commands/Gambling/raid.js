const {
  SlashCommandBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const comma = require("comma-number");
const { table } = require("node:console");
const wait = require('node:timers/promises').setTimeout;

const raid_Sechma = require("../../models/raidparty")
const gambling_Schema = require("../../models/Money")
const gambling_Schema2 = require("../../models/upgrade")
const level_Sechma = require("../../models/level")

var cooldown = []

module.exports = {
  data: new SlashCommandBuilder()
    .setName("레이드")
    .setDescription("레이드를 시작해 보스 몬스터에 도전하세요."),
  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   */
            async execute(interaction) {
      await interaction.deferReply()
              if (!interaction.channel){
                await interaction.editReply({
                     content: `채널을 불러올수 없음.`,
                 });
                return;
              }
      var raid = await raid_Sechma.findOne({
        channelid: interaction.channel.id
      })
      console.log(interaction.channel.id)
    if (raid){
      await interaction.editReply({
          content: `이 채널에서 이미 레이드가 진행중입니다.`,
      });
      return;
    }

    await raid_Sechma.updateOne(
      {channelid:interaction.channel.id},
      {userid: []},
      {upsert:true}
      );

      const confirm = new ButtonBuilder()
    .setCustomId(`참가`)
    .setLabel(`참가`)
    .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder()
          .addComponents(confirm);

      const msg = await interaction.editReply({
          content: `참가하시겠습니까?`,
          components: [row],
      });

      const collector = msg.createMessageComponentCollector({
        time: 10000,
        max: 1000
      })

      collector.on("collect", async (inter) => {
        console.log(inter.user)
        try{
          const raid = await raid_Sechma.findOne({
            channelid: interaction.channel.id
          })
          if (!raid){
            inter.reply({
                content: `레이드를 찾지 못함.`,
                ephemeral: true
            });
            return;
          }

          if (!raid.userid.find((element) => element == interaction.user.id)){
              var list = raid.userid

              list.push(interaction.user.id)

              await raid_Sechma.updateOne(
                  {channelid: interaction.channel.id},
                  {userid: list},
                  {upsert:true}
              );
              inter.reply({
                content: `성공적으로 참가되었습니다.`,
                ephemeral: true
              })
              interaction.channel.send({
                  content: `${inter.user.username}님이 레이드에 참가하였습니다.`
              })
          }else{
            inter.reply({
              content: `이미 레이드에 참가해있습니다.`,
              ephemeral: true
            })
          }
        }catch (error){
            console.log(error);
            interaction.editReply({
                content: "error: "+error
            })
        }
      })

      await wait(10000)

      interaction.channel.send("이제 시작합니다.")

      interaction.deleteReply()

      var monsters = [
        { name: '라스 카르니안 케스', hp: 25000, reward: 50, XPreward:500 },
        { name: '흑화한 봇', hp: 30000, reward: 60, XPreward:600 },
        { name: '검은 새늅봇', hp: 15000, reward: 30, XPreward:300 },
        
        { name: '라스 카르니안 케스', hp: 25000, reward: 50, XPreward:500 },
        { name: '흑화한 봇', hp: 30000, reward: 60, XPreward:600 },
        { name: '검은 새늅봇', hp: 15000, reward: 30, XPreward:300 },
        
        { name: '라스 카르니안 케스', hp: 25000, reward: 50, XPreward:500 },
        { name: '흑화한 봇', hp: 30000, reward: 60, XPreward:600 },
        { name: '검은 새늅봇', hp: 15000, reward: 30, XPreward:300 },
        
        { name: '라스 카르니안 케스', hp: 25000, reward: 50, XPreward:500 },
        { name: '흑화한 봇', hp: 30000, reward: 60, XPreward:600 },
        { name: '검은 새늅봇', hp: 15000, reward: 30, XPreward:300 },
        
        { name: '죽음', hp: 50000, reward: 100, XPreward:1000 },
      ];

      const monster = getRandomMonster();

      var raid = await raid_Sechma.findOne({
        channelid: interaction.channel.id
      })

      let save = []

        for (var i=0; i < raid.userid.length; i++){
          await wait(100)
          const gambling_find2 = await gambling_Schema2.findOne({
            userid:raid.userid[i]
        })

        if (gambling_find2){
            let length = gambling_find2.hashtags.length
            for (let i = 0; i < length; i++){
                if (!gambling_find2.hashtags[i]) { 
                    continue
                }
                var item = gambling_find2.hashtags[i]
                save.push(item)
            }
        }
        }

        console.log(save)
        console.log(save.length)

        for (i=0; i < save.length; i++){

          await wait(1000)
          console.log("무기선택")
          var damage

        //for (var i=0;i > save.length;){
          if (save.length <= 0 || save[i].value <= 0){
              damage = 1
          }else{
              damage = save[i].value
          }
        //}

        const name = save[i].name 
          
        if (save.length <= 0 || save[i].value <= 0){
            interaction.channel.send(`야생의 ${monster.name}을(를) 만났다! (우리의 ${i+1}번째 무기: 맨주먹)`);
        }else{
            interaction.channel.send(`야생의 ${monster.name}을(를) 만났다! (우리의 ${i+1}번째 무기: ${name}, ${save[i].value}강화)`);
        }

        await wait(3000);

        console.log("공격")

        const random = Math.random() * 5+ 5

          for (var i2 = 0; i2 <= random; ++i2){
            console.log("공격"+i2)
              await wait(1000);
              if (monster.hp <= 0){
                  break
              }
              if (Math.random() * 100 < 20){
                const embed = new EmbedBuilder()
                  .setTitle("크리티컬")
                  .setDescription(
                      `우리는 ${monster.name}을(를) 공격합니다. **{크리티컬!}** ${damage * 2}대미지! (${monster.hp - damage * 2}HP)`
                  )
                  .setColor("Yellow");
                  interaction.channel.send({embeds: [embed]});
                  monster.hp -= damage * 2;
              }else if (Math.random() * 100 < 6){
                const embed = new EmbedBuilder()
                .setTitle("빗나감")
                .setDescription(
                    `우리는 공격이 빗나갔다! 0대미지. (${monster.hp}HP)`
                )
                .setColor("Grey");
                  interaction.channel.send({embeds: [embed]});
                  monster.hp -= 0;
              }else if (Math.random() * 100 < 2){
                const embed = new EmbedBuilder()
                .setTitle("회심의 일격")
                .setDescription(
                    `__**{회심의 일격!}**__ 우리는 ${monster.name}을(를) 공격합니다. ${damage * 10}대미지! (${monster.hp - damage * 10}HP)`
                )
                .setColor("Purple");
                  interaction.channel.send({embeds: [embed]});
                  monster.hp -= damage * 10;
              }else{
                const embed = new EmbedBuilder()
                .setTitle("공격")
                .setDescription(
                    `우리는 ${monster.name}을(를) 공격합니다. ${damage}대미지! (${monster.hp - damage}HP)`
                )
                .setColor("Green");
                interaction.channel.send({embeds: [embed]});
                  monster.hp -= damage;
              }
          }
          interaction.channel.send(`**${name} 리타이어**`);
        }

        console.log("싸움 끝")

        await wait(1000)

        if (monster.hp <= 0){
          interaction.channel.send(`${monster.name}: 내가 졌다 이 **놈들아`);
          for (var i3=0; i3 < raid.userid.length; i3++){
            const gambling_find = await gambling_Schema.findOne({
              userid:raid.userid[i3]
            })
    
            const level_find = await level_Sechma.findOne({
                userid:raid.userid[i3]
            })
            await gambling_Schema.updateOne(
              {userid: raid.userid[i3]},
              {money: gambling_find.money + monster.reward, cooltime: gambling_find.cooltime},
              {upsert:true}
            ); 
            await level_Sechma.updateOne(
              {userid: raid.userid[i3]},
              {level: (level_find?.level || 1) + monster.XPreward, exp: 0},
              {upsert:true}
          );
          }

        const embed = new EmbedBuilder()
            .setTitle("레이드 성공")
            .setDescription(
                `${monster.name}을(를) 쓰러뜨렸습니다! 보상으로 ${monster.reward.toLocaleString()}돈, ${monster.XPreward.toLocaleString()}레벨 을 얻었습니다.`
            )
            .setColor("Green");
        
        interaction.channel.send({embeds: [embed]});
        }else {
          interaction.channel.send(`${monster.name}: 약해 빠진 것들 강해져서 돌아와라`);
          for (var i3=0; i3 < raid.userid.length; i3++){
            const gambling_find = await gambling_Schema.findOne({
              userid:raid.userid[i3]
            })
    
            const level_find = await level_Sechma.findOne({
                userid:raid.userid[i3]
            })
            await gambling_Schema.updateOne(
              {userid: raid.userid[i3]},
              {money: gambling_find.money + monster.reward / 100, cooltime: gambling_find.cooltime},
              {upsert:true}
            ); 
            await level_Sechma.updateOne(
              {userid: raid.userid[i3]},
              {level: (level_find?.level || 1) + monster.XPreward / 100, exp: 0},
              {upsert:true}
          );
          }

          const embed = new EmbedBuilder()
          .setTitle("레이드 실패")
          .setDescription(
              `${monster.name}를 잡는데 실패하였습니다.. 하지만 괜찮아요! 보상으로 ${(monster.reward / 100).toLocaleString()}돈, ${(monster.XPreward / 100).toLocaleString()}레벨 을 얻었습니다.`
          )
          .setColor("Green");
      
      interaction.channel.send({embeds: [embed]});
        }
        
        await raid_Sechma.deleteOne({ channelid: interaction.channel.id });
        
          
        function getRandomMonster() {
            return monsters[Math.floor(Math.random() * monsters.length)];
        }

  },
};
