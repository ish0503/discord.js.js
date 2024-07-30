const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const filtering_Schema = require("../../models/filter")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("필터")
        .setDescription("필터링 관리 명령어입니다")
   .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
              subcommand
              .setName("생성")
              .setDescription("필터를 생성")
              .addStringOption(options => options
                  .setName("필터방식")
                  .setDescription("필터를 만들 방식을 선택합니다.")                 
                .addChoices(
                    {name: "자동", value: "auto"},
                    {name: "커스텀", value: "custom"}
                  )
                    .setRequired(true)
              )
              .addStringOption(options => options
                  .setName("단어")
                  .setDescription("필터링할 단어 입력.")
                  .setRequired(false)
              )
              .addRoleOption(options => options
                .setName("역할")
                .setDescription("필터링에 구애받지 않을 역할 입력.")
                .setRequired(false)
              )
              .addChannelOption(options => options
                .setName("채널")
                .setDescription("필터링할 채널 입력.")
                .setRequired(false)
              )
              .addBooleanOption(options => options
                .setName("모든채널필터링")
                .setDescription("만약 모든 채널에 해당하는 필터링을 할 시 True로.")
                .setRequired(false)
              ),
            )
        .addSubcommand(subcommand =>
              subcommand
              .setName("삭제")
              .setDescription("이 서버에 필터를 삭제"),
            ),
      
          
    async execute(interaction) {
        if (interaction.options.getSubcommand() === "생성") {
          const args1 = interaction.options.getString("필터방식");
          const args2 = interaction.options.getString("단어");
          const args3 = interaction.options.getRole("역할");
          const args4 = interaction.options.getChannel("채널");
          const args5 = interaction.options.getBoolean("모든채널필터링");

          console.log(args1)
          console.log(args2)
          console.log(args3)
          console.log(args4)
          console.log(args5)

          const filtering_find = await filtering_Schema.findOne({
            filterserver: interaction.guild.id,
          });

          if (args1 == "auto"){
            if (filtering_find){
              await filtering_Schema.updateOne(
                {filterserver:String(interaction.guild.id)},
                {adminroleid:filtering_find.adminroleid.concat(args3?.id || null), filtermsg:["Auto"], filterchannel:filtering_find.filterchannel.concat([args4?.id || null]), filterallchannel:args5},
                {upsert:true}
              );
            }else{
              await filtering_Schema.updateOne(
                {filterserver:String(interaction.guild.id)},
                {adminroleid:[args3?.id || null], filtermsg:["Auto"], filterchannel:[args4?.id || null], filterallchannel:args5},
                {upsert:true}
              );
            }
            interaction.reply("필터링 추가 완료")
          }else{
            interaction.reply("미완성")
          }
        }else if (interaction.options.getSubcommand() === "삭제") {   
         interaction.reply("미완성")
        }
    }
}
