const { Schema, model } = require("mongoose");

const SchemaF = new Schema({
  landsid: Number, 
  price : Number,
  owner: String,
})

module.exports = model("lands", SchemaF);
