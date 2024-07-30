const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("청소")
        .setDescription("채널 메시지를 청소합니다")
        .addIntegerOption((f) =>
        f
            .setName("개수")
            .setRequired(true)
            .setDescription("청소할 메시지 개수를 입력해주세요.")
            .setMaxValue(1000)
            .setMinValue(1)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    /**
     * 
     * @param {import(*discord.js*).ChatInputCommandInteraction} interaction
     */
    async execute(interaction){
        const option_count = interaction.options.getInteger("개수");

        await interaction.reply({content: `**청소중..**`, ephemeral: true});

        function splitIntoMaxHundred(num){
            const MAX_Value = 100
            const result = []

            while (num > 0){
                if (num > MAX_Value){
                    result.push(MAX_Value)
                    num -= MAX_Value
                } else {
                    result.push(num)
                    num = 0
                }
            }

            return result
        }

        let count_split_array = splitIntoMaxHundred(option_count)

        for (let i = 0; i < count_split_array.length; i++){
            if (
            (await interaction.channel.bulkDelete(count_split_array[i], true))
            .size != count_split_array[i]
            ) {
                break
            }
        }

        interaction.editReply({content: `**${option_count}개의 메시지를 삭제하였습니다**`})
    }
}