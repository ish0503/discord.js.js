const { Schema, model } = require("mongoose");
//은행 DB
const SchemaF = new Schema({
  userid: String, // 유저id
  bankmoney: Number, //저축 금액
  bankmoneytime: Number,  //마지막 저축 이자 시간
  bankmoneycount: Number, //저축 이자 받는 총 횟수
  interestmoney: Number, //대출 금액
  interesttime: Number,  //마지막 대출 이자 시간
  interestcount: Number, //대출 이자 받는 총 횟수
  creditrating: Number,  //신용 등급
})

module.exports = model("bank", SchemaF);
