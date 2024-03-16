const { Client, Collection, EmbedBuilder } = require("discord.js");
const raid_Sechma = require("../models/raidparty")
const bank_Sechma = require("../models/bank")
const land_Sechma = require("../models/lands")

async function bank(){
  let today = new Date();   
      let month = today.getDate();

      bank_find = await bank_Sechma.find()

      for (let index = 0; index < bank_find.length; index++) {
        const element = bank_find[index];
        if (element.interesttime + 1 == month){
          await bank_Sechma.updateOne(
            {userid: element.userid},
            { 
                bankmoney: (element.bankmoney || 0), 
                bankmoneytime: (element.bankmoneytime || 0),
                bankmoneycount: (element.bankmoneycount || 0),
                interestmoney: (element.interestmoney || 0),
                interesttime: element.interesttime + 1,
                interestcount: element.interestcount + 1,
                creditrating: (element.creditrating || 5),
            },
            {upsert:true}
        );
        }
        if (element.bankmoneytime + 1 == month){
          await bank_Sechma.updateOne(
            {userid: element.userid},
            { 
                bankmoney: (element.bankmoney || 0), 
                bankmoneytime: element.bankmoneytime + 1,
                bankmoneycount: element.bankmoneycount + 1,
                interestmoney: (element.interestmoney || 0),
                interesttime: (element.interesttime || 0),
                interestcount: (element.interestcount || 0),
                creditrating: (element.creditrating || 5),
            },
            {upsert:true}
        );
        }
      }
}

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    let number = 0
    setInterval(() => {
        const list = [`새늅 골을 썩게`] 
        if(number == list.length) number = 0
        client.user.setActivity(list[number],{
            type: Client.Playing
        })
        number++
    }, 10000)
    console.log(`${client.user.tag} 봇 이 준비되었습니다.`)

    await raid_Sechma.deleteMany({ __v: 0 });

    bank()

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

    setInterval(async() => {
      bank()
    }, 300000);


  },
};
