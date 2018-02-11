const Koa = require('koa')
const fs = require('fs')
const path = require('path')
const serve = require('koa-static')
const router = require('./router')
const log4js = require('log4js')
const utils = require('./utils')
const jwt = require('koa-jwt')
require('./logger')

const app = new Koa()


const public = serve(path.join(__dirname, 'static'))
public._name = 'public'
app.use(public)


const errorHandler = () => {
    const logger = log4js.getLogger('api')
    return async (ctx, next) => {
        try {
            await next()
        } catch (err) {
            err.status = err.statusCode || err.status || 500
            const res = {
                code: 500,
                message: err.message
            }
            const clientIP = utils.getClientIP(ctx.req)
            ctx.body = res
            console.error(err)

            logger.error(`来自(${clientIP}) - ${JSON.stringify(res)} \n ${err.stack}`)
        }
    }
}

const authHandler = (ctx, next) => {
    return next().catch((err) => {
        if (err.status === 401) {
            ctx.status = 401
            ctx.body = {
                code: 500,
                message: err.originalError ? err.originalError.message : err.message
            }
        } else {
            throw err
        }
    })
}

const JWT = () => {
    return jwt({
        secret: 'chrome-save-history'
    }).unless({
        path: [/\/token/]
    })
}


//console logger
const consoleLogger = (format) => {
    format = format || ':method :url - :msms'
    const logger = log4js.getLogger('console')
    return async (ctx, next) => {
        const start = Date.now()
        await next()
        const ms = Date.now() - start
        const str = format
            .replace(':method', ctx.method)
            .replace(':url', ctx.url)
            .replace(':ms', ms)
        console.log(str)
        logger.info(str)
    }
}

app
    .use(authHandler)
    .use(JWT())
    .use(errorHandler())
    .use(consoleLogger())
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(3000, () => {
        console.log('App listening on port 3000!');
    });


// Custom 401 handling (first middleware)

process.on('uncaughtException', (err) => {
    console.log('--------------------------------------')
    console.log('uncauth')
    console.log(err)
})

module.exports = app