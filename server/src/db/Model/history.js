const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const HistorySchema = new Schema({
    _id: ObjectId,
    id: String, //chrome history ID
    lastVisitTime: Date, //最后访问时间
    title: String, //url标题
    typedCount: Number, //从url栏输入访问的次数
    url: String, //url地址
    visitCount: Number, //访问次数
    clientIP: String, //用户客户端IP
    user: {
        email: String, //chrome用户邮箱 
        id: String // chrome用户id
    },
    platform:{
        chromeVersion: String, //Chrome版本
        os: String //系统
    }
})

const History = mongoose.model('History', HistorySchema)

module.exports = History