const { Schema, model } = require("mongoose");

const SchemaF = new Schema({
  landsid: Number, 
  price : Number,
  owner: String,
  army: Number,
  level: Number,
  research: Number,
  buildings : [String]
})

module.exports = model("lands", SchemaF);
