const {
    SlashCommandBuilder,
    EmbedBuilder
  } = require("discord.js");
  const gambling_Schema = require("../../models/Money")
  const gambling_Schema2 = require("../../models/upgrade")
  const level_Sechma = require("../../models/level")
  const wait = require('node:timers/promises').setTimeout;

  var cooldown = []
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("대련")
      .setDescription("PVP.")
      .addUserOption(options => options
        .setName("유저")
        .setDescription("돈을 걸고 대련할 유저를 선택하세요.")
        .setRequired(true)
    ),
    /**
     *
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
       
        await interaction.deferReply()
        const args = interaction.options.getMember("유저")

        if (!args.user){
            return
        }

        console.log(args.user.globalName)
        console.log(args.user.username)

        let gambling_find = await gambling_Schema.findOne({
            userid:interaction.user.id
        })

        let level_find = await level_Sechma.findOne({
            userid:interaction.user.id
        })

        let gambling_find3 = await gambling_Schema.findOne({
            userid:args.id
        })

        let level_find3 = await level_Sechma.findOne({
            userid:args.id
        })

        if (!gambling_find || !gambling_find3){
            interaction.editReply({
                content: `**당신이나 ${args.user.username}의 돈 데이터가 없습니다.. 얻을게 없는데 PVP를 왜 하죠?**`
            })
            return
        }

        if (!level_find || !level_find3){
            interaction.editReply({
                content: `**당신이나 ${args.user.username}의 레벨 데이터가 없습니다.. 얻을게 없는데 PVP를 왜 하죠?**`
            })
            return
        }

        if (cooldown.find((element) => element == interaction.user.id)){
            interaction.editReply({
                content: `**현재 이미 명령어를 실행하고 있습니다.**`
            })
            return
        }

        cooldown.push(interaction.user.id)

        function clear(){
            for(var i = 0; i < cooldown.length; i++){ 
                if (cooldown[i] === interaction.user.id) { 
                    cooldown.splice(i, 1); 
                    i--; 
                }
            } 
        }

        let save = []
        let skills = []
        let save2 = []
        let skills2 = []

        const gambling_find2 = await gambling_Schema2.findOne({
            userid:interaction.user.id
        })

        const gambling_find4 = await gambling_Schema2.findOne({
            userid:args.id
        })

        if (gambling_find2){
            var length = gambling_find2.hashtags.length
            for (let i = 0; i < length; i++){
                if (!gambling_find2.hashtags[i]) { 
                    continue
                }
                var item = gambling_find2.hashtags[i]
                save.push(item)
            }

            if (gambling_find2.skills){
                var length = gambling_find2.skills.length
                for (let i = 0; i < length; i++){
                    if (!gambling_find2.skills[i]) { 
                        continue
                    }
                    var item = gambling_find2.skills[i]
                    skills.push(item)
                }
            }
        }

        if (gambling_find4){
            var length = gambling_find4.hashtags.length
            for (let i = 0; i < length; i++){
                if (!gambling_find4.hashtags[i]) { 
                    continue
                }
                var item = gambling_find4.hashtags[i]
                save2.push(item)
            }

            if (gambling_find4.skills){
                var length = gambling_find4.skills.length
            for (let i = 0; i < length; i++){
                if (!gambling_find4.skills[i]) { 
                    continue
                }
                var item = gambling_find4.skills[i]
                skills2.push(item)
            }
            }
        }

        save.sort(function (a, b) {
            if (a.value > b.value) {
              return -1;
            }
            if (a.value < b.value) {
              return 1;
            }
            // a must be equal to b
            return 0;
          });

          skills.sort(function (a, b) {
            if (a.value > b.value) {
              return -1;
            }
            if (a.value < b.value) {
              return 1;
            }
            // a must be equal to b
            return 0;
          });

          save2.sort(function (a, b) {
            if (a.value > b.value) {
              return -1;
            }
            if (a.value < b.value) {
              return 1;
            }
            // a must be equal to b
            return 0;
          });

          skills2.sort(function (a, b) {
            if (a.value > b.value) {
              return -1;
            }
            if (a.value < b.value) {
              return 1;
            }
            // a must be equal to b
            return 0;
          });

          if (save2.length <= 0){
            interaction.editReply({
                content: `**아이템도 없는 사람을 팰려고 하다니 역시 당신은..**`
            })
            return
            clear()
        }else if(save.length <= 0){
            interaction.editReply({
                content: `**당신 아이템부터 만들고 오세용..(/아이템 생성)**`
            })
            return
            clear()
        }

        var damage

        var damage2

        if (save.length <= 0){
            damage = 1
        }else if(skills.length <= 0){
            damage = save[0].value
        }else {
            damage = save[0].value + skills[0].Lv
        }

        if (save2.length <= 0){
            damage2 = 1
        }else if(skills2.length <= 0){
            damage2 = save2[0].value
        }else{
            damage2 = save2[0].value + skills2[0].Lv
        }
          
        const monster = { name: save2[0].name, hp: save2[0].value * 20, reward: Math.round(gambling_find3.money / 10000), XPreward:Math.round(level_find3.level / 10000) };
        const user = { name: save[0].name, hp: save[0].value * 20, reward: Math.round(gambling_find.money / 10000), XPreward:Math.round(level_find.level / 10000) };
        if (save.length <= 0){
            interaction.editReply(`당신은 ${monster.name}을(를) 가지고 있는 ${args.user.username}에게 선전포고를 했다! 거절은 없다! \n(당신의 무기: 맨주먹)`);
        }else{
            interaction.editReply(`당신은 ${monster.name}을(를) 가지고 있는 ${args.user.username}에게 선전포고를 했다! 거절은 없다! \n(당신의 무기: ${save[0].name}, ${save[0].value}강화)`);
        }

        await wait(5000);

        const random = Math.random() * 5 + 5

        for (var i = 0; random; ++i){
            var skill = skills[Math.round(Math.random() * (skills.length - 1))]
            await wait(2000);
            if (monster.hp <= 0 || user.hp <= 0){
                break
            }
            // if (i >= random){
            //     interaction.editReply(`오히려 당신이 사냥당했다..`);
            //     clear()
            //     return
            // }
            if (Math.random() * 100 < 10){
                const embed = new EmbedBuilder()
                .setTitle("크리티컬")
                  .setDescription(
                      `**당신**은 ${monster.name}을(를) 공격합니다. {크리티컬!} ${damage * 2}대미지! \n(${args.user.username}: ${monster.hp - damage * 2}HP) (당신: ${user.hp}HP)`
                  )
                  .setColor("Yellow");
                  interaction.editReply({embeds: [embed]});
                  monster.hp -= damage * 2;
            }else if (Math.random() * 100 < 3){
                const embed = new EmbedBuilder()
                .setTitle("빗나감")
                .setDescription(
                    `**당신**의 공격이 빗나갔다! 0대미지. \n(${args.user.username}: ${monster.hp}HP) (당신: ${user.hp}HP)`
                )
                .setColor("Grey");
                interaction.editReply({embeds: [embed]});
                monster.hp -= 0;
            }else if (Math.random() * 100 < 1){
                const embed = new EmbedBuilder()
                .setTitle("회심의 일격")
                .setDescription(
                    `__**{회심의 일격!}**__ **당신**은 ${monster.name}을(를) 공격합니다. {회심의 일격!} ${damage * 10}대미지! \n(${args.user.username}: ${monster.hp - damage * 10}HP) (당신: ${user.hp}HP)`
                )
                .setColor("Purple");
                  interaction.editReply({embeds: [embed]});
                monster.hp -= damage * 10;
            }else if (!skills.length <= 0){
                if (Math.random() * 100 < 100-skill.Lv/100){
                    const embed = new EmbedBuilder()
                .setTitle(`${skill.name}`)
                  .setDescription(
                      `**당신**은 ${monster.name}을(를) 공격합니다. **{${skill.name}!}** ${damage + skill.Lv}대미지! \n(${args.user.username}: ${monster.hp - damage + skill.Lv}HP) (당신: ${user.hp}HP)`
                  )
                  .setColor("DarkGreen");
                  interaction.editReply({embeds: [embed]});
                monster.hp -= damage + skill.Lv;
                }
            }else{
                const embed = new EmbedBuilder()
                .setTitle("공격")
                .setDescription(
                    `**당신**은 ${monster.name}을(를) 공격합니다. ${damage}대미지! \n(${args.user.username}: ${monster.hp - damage}HP) (당신: ${user.hp}HP)`
                )
                .setColor("Green");
                interaction.editReply({embeds: [embed]});
                monster.hp -= damage;
            }
            await wait(2000);
            var skill = skills2[Math.round(Math.random() * (skills2.length - 1))]
            if (Math.random() * 100 < 20){
                const embed = new EmbedBuilder()
                .setTitle("크리티컬")
                  .setDescription(
                      `*${args.user.username}*는 ${user.name}을(를) 공격합니다. {크리티컬!} ${damage2 * 2}대미지! \n(${args.user.username}: ${monster.hp}HP) (당신: ${user.hp - damage * 2}HP)`
                  )
                  .setColor("Yellow");
                  interaction.editReply({embeds: [embed]});
                user.hp -= damage2 * 2;
            }else if (Math.random() * 100 < 2){
                const embed = new EmbedBuilder()
                .setTitle("빗나감")
                .setDescription(
                    `*${args.user.username}*의 공격이 빗나갔다! 0대미지. \n(${args.user.username}: ${monster.hp}HP) (당신: ${user.hp}HP)`
                )
                .setColor("Grey");
                interaction.editReply({embeds: [embed]});
                user.hp -= 0;
            }else if (Math.random() * 100 < 2){
                const embed = new EmbedBuilder()
                .setTitle("회심의 일격")
                .setDescription(
                    `__**{회심의 일격!}**__ *${args.user.username}*는 ${user.name}을(를) 공격합니다. ${damage2 * 10}대미지! \n(${args.user.username}: ${monster.hp}HP) (당신: ${user.hp - damage2 * 10}HP)`
                )
                .setColor("Purple");
                  interaction.editReply({embeds: [embed]});
                user.hp -= damage2 * 10;
            }else if (!skills2.length <= 0){
                if (Math.random() * 100 < 100-skill.Lv/100){
                    const embed = new EmbedBuilder()
                    .setTitle(`${skill.name}`)
                      .setDescription(
                          `${args.user.username}*는 ${user.name}을(를) 공격합니다. **{${skill.name}!}** ${damage2 + skill.Lv}대미지! \n(${args.user.username}: ${monster.hp}HP) (당신: ${user.hp - damage2 + skill.Lv}HP)`
                      )
                      .setColor("DarkGreen");
                      interaction.editReply({embeds: [embed]});
                      user.hp -= damage2 + skill.Lv;
                }
            }else{
                const embed = new EmbedBuilder()
                .setTitle("공격")
                .setDescription(
                    `*${args.user.username}*는 ${user.name}을(를) 공격합니다. ${damage2}대미지! \n(${args.user.username}: ${monster.hp}HP) (당신: ${user.hp - damage2}HP)`
                )
                .setColor("Green");
                interaction.editReply({embeds: [embed]});
                user.hp -= damage2;
            }
        }

        gambling_find = await gambling_Schema.findOne({
            userid:interaction.user.id
        })

        level_find = await level_Sechma.findOne({
            userid:interaction.user.id
        })

        gambling_find3 = await gambling_Schema.findOne({
            userid:args.id
        })

        level_find3 = await level_Sechma.findOne({
            userid:args.id
        })

        if (monster.hp <= 0){
            await wait(1000);

            await gambling_Schema.updateOne(
                {userid: interaction.user.id},
                {money: gambling_find.money + monster.reward, cooltime: gambling_find.cooltime},
                {upsert:true}
            );

            await level_Sechma.updateOne(
                {userid: interaction.user.id},
                {level: level_find.level + monster.XPreward, exp: 0},
                {upsert:true}
            );
    
            const gambling_find3 = await gambling_Schema.findOne({
                userid:args.id
            })
    
            const level_find3 = await level_Sechma.findOne({
                userid:args.id
            })

            await gambling_Schema.updateOne(
                {userid: args.id},
                {money: gambling_find3.money - monster.reward, cooltime: gambling_find3.cooltime},
                {upsert:true}
            );

            await level_Sechma.updateOne(
                {userid: args.id},
                {level: level_find3.level - monster.XPreward, exp: 0},
                {upsert:true}
            );

            const embed = new EmbedBuilder()
                .setTitle("PVP 성공")
                .setDescription(
                    `${interaction.user.username}님이 ${args.user.username}의 ${monster.name}을(를) 쓰러뜨려서 돈과 레벨을 강탈했습니다.\n${monster.reward.toLocaleString()}돈, ${monster.XPreward.toLocaleString()}레벨 을 얻었습니다.`
                )
                .setColor("Green");
            
            interaction.channel.send({embeds: [embed]});
        }else if(user.hp <= 0){
            await wait(1000);

            await gambling_Schema.updateOne(
                {userid: args.id},
                {money: gambling_find3.money + user.reward, cooltime: gambling_find3.cooltime},
                {upsert:true}
            );

            await level_Sechma.updateOne(
                {userid: args.id},
                {level: level_find3.level + user.XPreward, exp: 0},
                {upsert:true}
            );

            const gambling_find = await gambling_Schema.findOne({
                userid:interaction.user.id
            })
    
            const level_find = await level_Sechma.findOne({
                userid:interaction.user.id
            })

            await gambling_Schema.updateOne(
                {userid: interaction.user.id},
                {money: gambling_find.money - user.reward, cooltime: gambling_find.cooltime},
                {upsert:true}
            );

            await level_Sechma.updateOne(
                {userid: interaction.user.id},
                {level: level_find.level - user.XPreward, exp: 0},
                {upsert:true}
            );

            const embed = new EmbedBuilder()
                .setTitle("PVP 실패")
                .setDescription(
                    `${interaction.user.username}님이 ${args.user.username}의 ${monster.name}에게 졌습니다.. ${user.reward.toLocaleString()}돈, ${user.XPreward.toLocaleString()}레벨을 잃었습니다...`
                )
                .setColor("DarkRed");
            
            interaction.channel.send({embeds: [embed]});
        }

        clear()

    },
  };

