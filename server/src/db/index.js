const mongoose = require('mongoose')
const History = require('./Model/history')
const log4js = require('log4js')
const logger = log4js.getLogger('DB')

class DB {
    constructor() {
        const url = 'mongodb://localhost/chrome-save-history'
        mongoose.connect(url)
        const db = mongoose.connection

        db.once('open', () => {
            console.log('Connect to MongoDB success!')
        })

        db.on('error', err => {
            if (err) {
                logger.error(err)
                console.error(err)
                // throw '数据库未连接'
            }
        })

        db.on('close', () => {
            const info = 'Connection of MongoB has been closed, try reconnect again...'
            console.log(info)
            logger.info(info)
            mongoose.connect(url)
        })
    }

    /**
     * 插入历史记录
     * @param {*} data 
     */
    insertHistory(data) {
        return this.wrap((resolve, reject) => {
            History.findOneAndUpdate(
                {
                    id: data.id
                },
                data,
                {
                    new: true,
                    upsert: true
                },
                (err, docs) => this.handler(resolve, err, docs)
            )
        })
    }

    /**
     * 查询历史记录
     * @param {*} condition 查询条件
     */
    queryHistory(condition) {
        return this.wrap((resolve, reject) => {
            History
                .find(condition)
                .sort('-lastVisitTime')
                .skip(condition.pageIndex || 0)
                .limit(condition.pageSize || 20)
                .exec((err, docs) =>
                    this.handler(resolve, err, docs)
                )
        })
    }

    /**
     * 数据库操作后统一回调handler
     * @param {*} resolve 
     * @param {*} err 
     * @param {*} docs 
     */
    handler(resolve, err, docs) {
        if (err) {
            console.error(err)
            resolve({
                action: false,
                message: err.message
            })
            return
        }
        resolve({
            action: true,
            data: docs
        })
    }

    /**
     * 为方法包裹Promise
     * @param {*} fn 
     */
    wrap(fn) {
        return new Promise((resolve, reject) => {
            fn(resolve, reject)
        })
    }
}

module.exports = new DB()