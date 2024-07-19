const { Client, Collection, EmbedBuilder } = require("discord.js");
const raid_Sechma = require("../models/raidparty")
const land_Sechma = require("../models/lands")

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    let number = 0
    setInterval(() => {
        const list = [`블루 아카이브`, `센세 기다리기`] 
        if(number == list.length) number = 0
        client.user.setActivity(list[number],{
            type: Client.Playing
        })
        number++
    }, 10000)
    console.log(`${client.user.tag} 봇 이 준비되었습니다.`)

    await raid_Sechma.deleteMany({ __v: 0 });

    // for (let i = 1; i < 101; i++) {
    //   await land_Sechma.updateOne(
    //     {landsid: i},
    //     { 
    //       price: 1000000,
    //       owner: ""
    //     },
    //     {upsert:true}
    //   )
    // }


  },
};
