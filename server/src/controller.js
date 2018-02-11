const db = require('./db')
const log4js = require('log4js')
const utils = require('./utils')
const jsonwebtoken = require('jsonwebtoken')

class Controller {
    constructor(ctx, next) {
        this.ctx = ctx
        this.next = next
        this.data = ctx.request.body
        this.db = db
        this.user = ctx.state.user
    }

    /**
     * 执行对应方法
     * @param {*} fn 方法名
     */
    async exec(fn) {
        const isAsyncFunc = Object.prototype.toString.call(this[fn]).includes('AsyncFunction')
        let res
        if (isAsyncFunc) {
            res = await this[fn].call(this)
        } else {
            res = this[fn].call(this)
        }
        this.final(res)
    }

    /**
     * 插入历史记录
     */
    async insertHistory() {
        this.data.user = this.user.data
        this.data.clientIP = utils.getClientIP(this.ctx.req)
        return await this.db.insertHistory(this.data)
    }

    /**
     * 查询历史记录
     */
    async queryHistory() {
        return await this.db.queryHistory(this.data)
    }

    generateJWT() {
        const secret = 'chrome-save-history'
        const token = jsonwebtoken.sign({
            data: this.data,
            // exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1小时
        }, secret)
        return {
            action: true,
            token
        }
    }

    /**
     * 后续操作
     * @param {*} res
     * @param {boolean}
     */
    final(res) {
        const code = res.action ? 200 : 500
        this.ctx.body = {
            code,
            ...res
        }
        this.next()
    }
}

module.exports = {
    async insertHistory(ctx, next) {
        await new Controller(ctx, next).exec('insertHistory')
    },
    async queryHistory(ctx, next) {
        await new Controller(ctx, next).exec('queryHistory')
    },
    async generateJWT(ctx, next) {
        await new Controller(ctx, next).exec('generateJWT')
    }
}   