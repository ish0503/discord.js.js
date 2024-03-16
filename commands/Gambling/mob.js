const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const gambling_Schema = require("../../models/Money");
const gambling_Schema2 = require("../../models/upgrade");
const level_Sechma = require("../../models/level");
const wait = require("node:timers/promises").setTimeout;
let H = [];
var cooldown = [];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("사냥") //메인커맨드
    .setDescription("몹을 사냥해 전리품을 얻어보세요."),

  /**
   *
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.deferReply();

    const gambling_find = await gambling_Schema.findOne({
      userid: interaction.user.id,
    });

    var level_find = await level_Sechma.findOne({
      userid: interaction.user.id,
    });

    if (!gambling_find) {
      interaction.editReply({
        content: `**돈이 없으시군요.. 돈을 어떻게든 얻어보세요.**`,
      });
      return;
    }

    if (cooldown.find((element) => element == interaction.user.id)) {
      interaction.editReply({
        content: `**현재 이미 명령어를 실행하고 있습니다.**`,
      });
      return;
    }
    cooldown.push(interaction.user.id);

    function clear() {
      for (var i = 0; i < cooldown.length; i++) {
        if (cooldown[i] === interaction.user.id) {
          cooldown.splice(i, 1);
          i--;
        }
      }
    }
    var monsters = [
      { name: "죽음", hp: 100000, reward: 0, XPreward: 10 },
      { name: "최강의 슬라임", hp: 1300, reward: 0, XPreward: 9 },
      { name: "최강의 새늅봇", hp: 1300, reward: 0, XPreward: 9 },
      { name: "GPT", hp: 1200, reward: 0, XPreward: 8 },
      { name: "사이보그", hp: 1000, reward: 0, XPreward: 7 },
      { name: "봇", hp: 1000, reward: 0, XPreward: 7 },
      { name: "ks", hp: 1000, reward: 0, XPreward: 7 },
      { name: "파이어드래곤", hp: 700, reward: 0, XPreward: 6 },
      { name: "워터드래곤", hp: 600, reward: 0, XPreward: 5 },
      { name: "라이트닝드래곤", hp: 600, reward: 0, XPreward: 5 },
      { name: "드래곤", hp: 500, reward: 0, XPreward: 5 },
      { name: "로즈", hp: 300, reward: 0, XPreward: 4 },
      { name: "애기드래곤", hp: 300, reward: 0, XPreward: 4 },
      { name: "전설의 용사", hp: 200, reward: 0, XPreward: 4 },
      { name: "새늅봇", hp: 100, reward: 0, XPreward: 3 },
      { name: "새뉴비", hp: 100, reward: 0, XPreward: 3 },
      { name: "껌", hp: 50, reward: 0, XPreward: 2 },
      { name: "lk", hp: 25, reward: 0, XPreward: 2 },
      { name: "슬라임", hp: 10, reward: 0, XPreward: 2 },
      { name: "풀", hp: 5, reward: 0, XPreward: 1 },
      { name: "공기", hp: 1, reward: 0, XPreward: 1 },
    ];

    if (level_find?.level > 2000) {
      monsters = [
        { name: "황천의 죽음", hp: 1000000, reward: 1, XPreward: 100 },
        {
          name: "황천의 최강의 슬라임",
          hp: 13000,
          reward: 0,
          XPreward: 90,
        },
        {
          name: "황천의 최강의 새늅봇",
          hp: 13000,
          reward: 0,
          XPreward: 90,
        },
        { name: "황천의 GPT", hp: 12000, reward: 0, XPreward: 80 },
        { name: "황천의 사이보그", hp: 10000, reward: 0, XPreward: 70 },
        { name: "황천의 봇", hp: 10000, reward: 0, XPreward: 70 },
        { name: "황천의 ks", hp: 10000, reward: 0, XPreward: 70 },
        { name: "황천의 파이어드래곤", hp: 7000, reward: 0, XPreward: 60 },
        { name: "황천의 워터드래곤", hp: 6000, reward: 0, XPreward: 50 },
        {
          name: "황천의 라이트닝드래곤",
          hp: 6000,
          reward: 0,
          XPreward: 50,
        },
        { name: "황천의 드래곤", hp: 5000, reward: 0, XPreward: 50 },
        { name: "황천의 로즈", hp: 3000, reward: 0, XPreward: 40 },
        { name: "황천의 애기드래곤", hp: 3000, reward: 0, XPreward: 40 },
        { name: "황천의 전설의 용사", hp: 2000, reward: 0, XPreward: 40 },
        { name: "황천의 새늅봇", hp: 1000, reward: 0, XPreward: 30 },
        { name: "황천의 새뉴비", hp: 1000, reward: 0, XPreward: 30 },
        { name: "황천의 껌", hp: 500, reward: 0, XPreward: 20 },
        { name: "황천의 lk", hp: 250, reward: 0, XPreward: 20 },
        { name: "황천의 슬라임", hp: 100, reward: 0, XPreward: 20 },
        { name: "황천의 풀", hp: 50, reward: 0, XPreward: 10 },
        { name: "황천의 공기", hp: 10, reward: 0, XPreward: 10 },
      ];
    } else if (level_find?.level > 1000) {
      monsters = [
        { name: "천상의 죽음", hp: 100000, reward: 0, XPreward: 40 },
        {
          name: "천상의 최강의 슬라임",
          hp: 5200,
          reward: 0,
          XPreward: 36,
        },
        {
          name: "천상의 최강의 새늅봇",
          hp: 5200,
          reward: 0,
          XPreward: 36,
        },
        { name: "천상의 GPT", hp: 4800, reward: 0, XPreward: 32 },
        { name: "천상의 사이보그", hp: 4000, reward: 0, XPreward: 28 },
        { name: "천상의 봇", hp: 4000, reward: 0, XPreward: 28 },
        { name: "천상의 ks", hp: 4000, reward: 0, XPreward: 28 },
        { name: "천상의 파이어드래곤", hp: 2800, reward: 0, XPreward: 24 },
        { name: "천상의 워터드래곤", hp: 2400, reward: 0, XPreward: 20 },
        {
          name: "천상의 라이트닝드래곤",
          hp: 2400,
          reward: 0,
          XPreward: 20,
        },
        { name: "천상의 드래곤", hp: 2000, reward: 0, XPreward: 20 },
        { name: "천상의 로즈", hp: 1200, reward: 0, XPreward: 16 },
        { name: "천상의 애기드래곤", hp: 1200, reward: 0, XPreward: 16 },
        { name: "천상의 전설의 용사", hp: 1000, reward: 0, XPreward: 16 },
        { name: "천상의 새늅봇", hp: 8000, reward: 0, XPreward: 12 },
        { name: "천상의 새뉴비", hp: 800, reward: 0, XPreward: 12 },
        { name: "천상의 껌", hp: 500, reward: 0, XPreward: 8 },
        { name: "천상의 lk", hp: 300, reward: 0, XPreward: 8 },
        { name: "천상의 슬라임", hp: 200, reward: 0, XPreward: 8 },
        { name: "천상의 풀", hp: 100, reward: 0, XPreward: 4 },
        { name: "천상의 공기", hp: 50, reward: 0, XPreward: 4 },
      ];
    } else if (level_find?.level > 300) {
      monsters = [
        { name: "초월의 죽음", hp: 100000, reward: 0, XPreward: 20 },
        {
          name: "초월의 최강의 슬라임",
          hp: 2600,
          reward: 0,
          XPreward: 18,
        },
        {
          name: "초월의 최강의 새늅봇",
          hp: 2600,
          reward: 0,
          XPreward: 18,
        },
        { name: "초월의 GPT", hp: 2400, reward: 0, XPreward: 16 },
        { name: "초월의 사이보그", hp: 2000, reward: 0, XPreward: 14 },
        { name: "초월의 봇", hp: 2000, reward: 0, XPreward: 14 },
        { name: "초월의 ks", hp: 2000, reward: 0, XPreward: 14 },
        { name: "초월의 파이어드래곤", hp: 1400, reward: 0, XPreward: 12 },
        { name: "초월의 워터드래곤", hp: 1200, reward: 0, XPreward: 10 },
        {
          name: "초월의 라이트닝드래곤",
          hp: 1200,
          reward: 0,
          XPreward: 10,
        },
        { name: "초월의 드래곤", hp: 1000, reward: 0, XPreward: 10 },
        { name: "초월의 로즈", hp: 600, reward: 0, XPreward: 8 },
        { name: "초월의 애기드래곤", hp: 600, reward: 0, XPreward: 8 },
        { name: "초월의 전설의 용사", hp: 400, reward: 0, XPreward: 8 },
        { name: "초월의 새늅봇", hp: 200, reward: 0, XPreward: 6 },
        { name: "초월의 새뉴비", hp: 200, reward: 0, XPreward: 6 },
        { name: "초월의 껌", hp: 100, reward: 0, XPreward: 4 },
        { name: "초월의 lk", hp: 50, reward: 0, XPreward: 4 },
        { name: "초월의 슬라임", hp: 20, reward: 0, XPreward: 4 },
        { name: "초월의 풀", hp: 10, reward: 0, XPreward: 2 },
        { name: "초월의 공기", hp: 2, reward: 0, XPreward: 2 },
      ];
    } else if (level_find?.level > 150) {
      monsters = [
        { name: "각성의 죽음", hp: 100000, reward: 0, XPreward: 11 },
        {
          name: "각성의 최강의 슬라임",
          hp: 1800,
          reward: 0,
          XPreward: 10,
        },
        {
          name: "각성의 최강의 새늅봇",
          hp: 1800,
          reward: 0,
          XPreward: 10,
        },
        { name: "각성의 GPT", hp: 1500, reward: 0, XPreward: 9 },
        { name: "각성의 사이보그", hp: 1300, reward: 0, XPreward: 8 },
        { name: "각성의 봇", hp: 1300, reward: 0, XPreward: 8 },
        { name: "각성의 ks", hp: 1300, reward: 0, XPreward: 8 },
        { name: "각성의 파이어드래곤", hp: 1000, reward: 0, XPreward: 7 },
        { name: "각성의 워터드래곤", hp: 900, reward: 0, XPreward: 6 },
        { name: "각성의 라이트닝드래곤", hp: 900, reward: 0, XPreward: 6 },
        { name: "각성의 드래곤", hp: 800, reward: 0, XPreward: 6 },
        { name: "각성의 로즈", hp: 600, reward: 0, XPreward: 5 },
        { name: "각성의 애기드래곤", hp: 600, reward: 0, XPreward: 5 },
        { name: "각성의 전설의 용사", hp: 400, reward: 0, XPreward: 5 },
        { name: "각성의 새늅봇", hp: 200, reward: 0, XPreward: 4 },
        { name: "각성의 새뉴비", hp: 200, reward: 0, XPreward: 4 },
        { name: "각성의 껌", hp: 100, reward: 0, XPreward: 3 },
        { name: "각성의 lk", hp: 50, reward: 0, XPreward: 3 },
        { name: "각성의 슬라임", hp: 20, reward: 0, XPreward: 3 },
        { name: "각성의 풀", hp: 10, reward: 0, XPreward: 2 },
        { name: "각성의 공기", hp: 2, reward: 0, XPreward: 2 },
      ];
    }

    let save = [];

    let skills = [];

    const gambling_find2 = await gambling_Schema2.findOne({
      userid: interaction.user.id,
    });

    if (gambling_find2) {
      var length = gambling_find2.hashtags.length;
      for (let i = 0; i < length; i++) {
        if (!gambling_find2.hashtags[i]) {
          continue;
        }
        var item = gambling_find2.hashtags[i];
        save.push(item);
      }

      if (gambling_find2.skills) {
        var length = gambling_find2.skills.length;
        for (let i = 0; i < length; i++) {
          if (!gambling_find2.skills[i]) {
            continue;
          }
          var item = gambling_find2.skills[i];
          skills.push(item);
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
    while (H.includes(interaction.user.id)) {
      //console.log(H)
      await wait(1000);
      await Hunting();
    }

    Hunting();
    async function Hunting() {
      var damage;

      if (save.length <= 0) {
        damage = 1;
      } else if (skills.length <= 0) {
        damage = save[0].value;
      } else {
        damage = save[0].value + skills[0].Lv;
      }

      const monster = getRandomMonster();
      if (save.length <= 0) {
        interaction.editReply(
          `야생의 ${monster.name}을(를) 만났다! (당신의 무기: 맨주먹`,
        );
      } else {
        interaction.editReply(
          `야생의 ${monster.name}을(를) 만났다! (당신의 무기: ${save[0].name}, ${save[0].value}강화)`,
        );
      }

      await wait(5000);

      const random = Math.random() * 5 + 5;

      for (var i = 0; random; ++i) {
        var skill = skills[Math.round(Math.random() * (skills.length - 1))];
        await wait(1000);
        if (monster.hp <= 0) {
          break;
        }
        if (i >= random) {
          interaction.editReply(`오히려 당신이 사냥당했다..`);
          clear();
          return;
        }
        if (Math.random() * 100 < 10) {
          interaction.editReply(
            `당신은 ${monster.name}을(를) 공격합니다. {크리티컬!} ${
              damage * 2
            }대미지! (${monster.hp - damage * 2}HP)`,
          );
          monster.hp -= damage * 2;
        } else if (Math.random() * 100 < 3) {
          interaction.editReply(
            `당신의 공격이 빗나갔다! 0대미지. (${monster.hp}HP)`,
          );
          monster.hp -= 0;
        } else if (Math.random() * 100 < 1) {
          interaction.editReply(
            `{회심의 일격!} 당신은 ${
              monster.name
            }을(를) 공격합니다. {회심의 일격!} ${damage * 10}대미지! (${
              monster.hp - damage * 10
            }HP)`,
          );
          monster.hp -= damage * 10;
        } else if (!skills.length <= 0) {
          if (Math.random() * 100 < 100 - skill.Lv / 100) {
            interaction.editReply(
              `당신은 ${monster.name}을(를) 공격합니다. **{${skill.name}!}** ${
                damage + skill.Lv
              }대미지! (${monster.hp - (damage + skill.Lv)}HP)`,
            );
            monster.hp -= damage + skill.Lv;
          }
        } else {
          interaction.editReply(
            `당신은 ${monster.name}을(를) 공격합니다. ${damage}대미지! (${
              monster.hp - damage
            }HP)`,
          );
          monster.hp -= damage;
        }
      }

      await wait(1000);

      await gambling_Schema.updateOne(
        { userid: interaction.user.id },
        {
          money: gambling_find.money + monster.reward,
          cooltime: gambling_find.cooltime,
        },
        { upsert: true },
      );

      await level_Sechma.updateOne(
        { userid: interaction.user.id },
        { level: (level_find?.level || 1) + monster.XPreward, exp: 0 },
        { upsert: true },
      );

      const embed = new EmbedBuilder()
        .setTitle("사냥 성공")
        .setDescription(
          `<@${interaction.user.id}> ${
            monster.name
          }을(를) 쓰러뜨렸습니다! 보상으로 ${monster.reward.toLocaleString()}돈, ${monster.XPreward.toLocaleString()}레벨 을 얻었습니다.`,
        )
        .setColor("Green");

      interaction.channel.send({ embeds: [embed] });

      clear();

      function getRandomMonster() {
        return monsters[Math.floor(Math.random() * monsters.length)];
      }
    }
  },
};
