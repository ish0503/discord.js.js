const { Schema, model } = require("mongoose");

const SchemaF = new Schema({
  userid: String, // 업그레이드 유저 id
  hashtags : [{ "name": String, "value": Number }], // 아이템 배열
  skills : [{ "name": String, "Lv": Number }], // 스킬 배열
  cooltime: String, // 쿨타임
  defense: Number, // 방어권 개수
})

module.exports = model("Upgrade", SchemaF);