const log4js = require('log4js')

log4js.configure({
    pm2: true,
    appenders: {
        test: {
            type: 'file',
            filename: 'logs/test.log'
        },
        error: {
            type: 'file',
            filename: 'logs/errors.log'
        },
        api: {
            type: 'file',
            filename: 'logs/api.log'
        },
        console: {
            type: 'file',
            filename: 'logs/console.log'
        }
    },
    categories: {
        default: {
            appenders: ['test'],
            level: 'all'
        },
        test: {
            appenders: ['test'],
            level: 'info'
        },
        DB: {
            appenders: ['error'],
            level: 'error'
        },
        api: {
            appenders: ['api'],
            level: 'all'
        },
        console: {
            appenders: ['console'],
            level: 'info'
        }
    }
})