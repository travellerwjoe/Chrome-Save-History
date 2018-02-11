const Router = require('koa-router')
const koaBody = require('koa-body')
const controller = require('./controller')
const router = new Router()

router.post('/history/insert', koaBody(), controller.insertHistory)

router.post('/history', koaBody(), controller.queryHistory)

router.post('/token', koaBody(), controller.generateJWT)


module.exports = router