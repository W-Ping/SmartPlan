/**
 *  获取小程序二维码
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function getWXAQRCode(ctx, next) {
    console.log(ctx);
}

/**
 * 获取小程序码
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function getWXACode(ctx, next) {
    console.log(ctx);
}

module.exports = {getWXAQRCode, getWXACode}