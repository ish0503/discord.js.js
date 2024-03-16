const { Schema, model } = require("mongoose");

const SchemaF = new Schema({
  userid: String,
  count: Number,
  date: String,
})

module.exports = model("출석체크", SchemaF);