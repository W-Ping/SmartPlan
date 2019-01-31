const WxCrypt = require('../tools/WxCrypt')
const AuthDbService = require('./AuthDbService')
const userinfo = require('./userinfo')
const config = require('../config')
const {mysql} = require("../qcloud");
const {SUCCESS, FAILED, CNF, ERRORS_BIZ} = require("./constants")

function getShareInfo(ctx, next) {
    let {'x-wx-skey': skey} = ctx.req.headers
    let {iv, encryptedData} = ctx.request.body;
    if ([iv, encryptedData, skey].every(v => !v)) {
        throw new Error("参数错误")
    }
    return AuthDbService.getUserInfoBySKey(skey).then(result => {
        if (result) {
            var pc = new WxCrypt(config.appId, result[0].session_key)
            var data = pc.decryptData(encryptedData, iv)
            console.log('解密后 data: ', data)
            SUCCESS(ctx, data);
        }

    })
}

/**
 * 查询好友信息
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function getShareInfoByUid(ctx, next) {
    let params = ctx.params;
    await  userinfo.getUserInfoByUid(params.uid).then(res => {
        SUCCESS(ctx, res);
    })
}

/**
 * 绑定好友关系
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function bindShareUser(ctx, next) {
    let params = ctx.request.body;
    let userInfo = ctx.state.$sysInfo.userinfo;
    if (!params) throw new Error("bind user params is null");
    await userinfo.saveBindRelationUser(params.uid, params.relation_uid, userInfo).then(res => {
        if (res && res.code == 1) {
            SUCCESS(ctx, res.msg);
        } else {
            FAILED(ctx, "添加好友失败");
        }
    })
}

/**
 *
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function checkUserRelation(ctx, next) {
    let {uid, refUid} = ctx.query;
    await  mysql(CNF.DB_TABLE.user_relation_info).select("id").where({
        uid: uid,
        relation_uid: refUid,
        status: 0
    }).then(res => {
        if (res && res.length > 0) {
            SUCCESS(ctx, "Y");
        } else {
            SUCCESS(ctx, "N");
        }
    });
}

module.exports = {getShareInfo, getShareInfoByUid, bindShareUser, checkUserRelation}