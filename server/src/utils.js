/**
 * 获取客户端IP
 * @param req 客户duan端
 */
function getClientIP(req) {
    let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress
    return ip.includes('::ffff:') ? ip.replace('::ffff:', '') : ip
}

module.exports = {
    getClientIP
}