const AuthDbService = require('./AuthDbService')
const WxCrypt = require('../tools/WxCrypt')
const config = require('../config')
const {SUCCESS, FAILED, CNF, ERRORS_BIZ} = require("./constants")

async function getUserWeRunInfo(ctx, next) {
    let {'x-wx-skey': skey} = ctx.req.headers
    let {iv, encryptedData} = ctx.request.body;
    if ([iv, encryptedData, skey].every(v => !v)) {
        throw new Error("参数错误")
    }
    await AuthDbService.getUserInfoBySKey(skey).then(result => {
        if (result) {
            var pc = new WxCrypt(config.appId, result[0].session_key)
            var data = pc.decryptData(encryptedData, iv)
            console.log('解密后 data: ', data)
            SUCCESS(ctx, data);
        }

    })
}

module.exports = {getUserWeRunInfo}