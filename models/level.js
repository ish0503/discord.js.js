const { Schema, model } = require("mongoose");

const SchemaF = new Schema({
  userid: String, // 레벨 유저 id
  level: Number, //레벨
  exp: Number, // xp(현재는 사용되지 않음)
})

module.exports = model("Level", SchemaF);
