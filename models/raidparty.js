const { Schema, model } = require("mongoose");
// 레이드 파티가 DB에 저장되는 이유는 레이드를 동시에 같은 서버 내에서 사용하면 안되기 때문.
const SchemaF = new Schema({
    "channelid": String, // 레이드 채널 id
    "userid": [String] // 레이드 유저 id
})

module.exports = model("raidparty", SchemaF);