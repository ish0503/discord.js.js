const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const translatte = require('translatte');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("번역")
        .setDescription("번역합니다")
        .addSubcommand(subcommand =>
              subcommand
              .setName("시작")
              .setDescription("번역을 시작합니다.")
              .addStringOption(options => options
                .setName("말")
                .setDescription("번역할 내용을 적으세요.")
                .setRequired(true)
              )
              .addStringOption(options => options
                  .setName("언어")
                  .setDescription("번역할 언어를 적으세요 (번역 확인).")
                  .setRequired(true)
              ),
            )
        .addSubcommand(subcommand =>
              subcommand
              .setName("확인")
              .setDescription("번역 할수 있는 언어들을 봅니다.")
            ),

    /**
     * 
     * @param {import(*discord.js*).ChatInputCommandInteraction} interaction
     */
    async execute(interaction){
        if (interaction.options.getSubcommand() === "시작") {
          interaction.deferReply() 
            const args = interaction.options.getString("말")
            const args2 = interaction.options.getString("언어")

            translatte(args, {to: args2}).then(res => {
                console.log(res.text);
                interaction.editReply({
                    embeds: [
                      new EmbedBuilder()
                        .setTitle(`${args}를 ${args2}로 번역됨`)
                        .setDescription(`${res.text}`)
                        .setColor("#18df8c"),
                    ],
                })
            }).catch(err => {
                console.error(err);
                interaction.editReply({
                    content: err.message,
                });
            });
        }else if (interaction.options.getSubcommand() === "확인") {
            interaction.reply({
                content: 'auto: Automatic\naf: Afrikaans\nsq: Albanian\nam: Amharic\nar: Arabic\nhy: Armenian\naz: Azerbaijani\neu: Basque\nbe: Belarusian\nbn: Bengali\nbs: Bosnian\nbg: Bulgarian\nca: Catalan\nceb: Cebuano\nny: Chichewa\nzh: Chinese (Simplified)\nzh-cn: Chinese (Simplified)\nzh-tw: Chinese (Traditional)\nco: Corsican\nhr: Croatian\ncs: Czech\nda: Danish\nnl: Dutch\nen: English\neo: Esperanto\net: Estonian\ntl: Filipino\nfi: Finnish\nfr: French\nfy: Frisian\ngl: Galician\nka: Georgian\nde: German\nel: Greek\ngu: Gujarati\nht: Haitian Creole\nha: Hausa\nhaw: Hawaiian\nhe: Hebrew\niw: Hebrew\nhi: Hindi\nhmn: Hmong\nhu: Hungarian\nis: Icelandic\nig: Igbo\nid: Indonesian\nga: Irish\nit: Italian\nja: Japanese\njw: Javanese\nkn: Kannada\nkk: Kazakh\nkm: Khmer\nko: Korean\nku: Kurdish (Kurmanji)\nky: Kyrgyz\nlo: Lao\nla: Latin\nlt: Lithuanian\nlb: Luxembourgish\nmk: Macedonian\nmg: Malagasy\nms: Malay\nml: Malayalam\nmt: Maltese\nmi: Maori\nmr: Marathi\nmn: Mongolian\nmy: Myanmar (Burmese)\nne: Nepali\nno: Norwegian\nps: Pashto\nfa: Persian\npl: Polish\npt: Portuguese\npa: Punjabi\nro: Romanian\nru: Russian\nsm: Samoan\ngd: Scots Gaelic\nsr: Serbian\nst: Sesotho\nsn: Shona\nsd: Sindhi\nsi: Sinhala\nsk: Slovak\nsl: Slovenian\nso: Somali\nes: Spanish\nsu: Sundanese\nsw: Swahili\nsv: Swedish\ntg: Tajik\nta: Tamil\nte: Telugu\nth: Thai\ntr: Turkish\nuk: Ukrainian\nur: Urdu\nuz: Uzbek\nvi: Vietnamese\ncy: Welsh\nxh: Xhosa\nyi: Yiddish\nyo: Yoruba\nzu: Zulu',
            });
        }
    }
}
