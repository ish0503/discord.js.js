const { Schema, model } = require("mongoose");

const SchemaF = new Schema({
  userid: String, 
  lands : [Number],
  ally : [String], // 동맹 플레이어 id
  enemy : [String] // 적 플레이어 id
})

module.exports = model("Playerlands", SchemaF);
