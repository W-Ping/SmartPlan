const WxCrypt = require('../tools/WxCrypt')
const AuthDbService = require('./AuthDbService')
const userinfo = require('./userinfo')
const config = require('../config')
const {mysql} = require("../qcloud");
const {SUCCESS, FAILED, CNF, ERRORS_BIZ} = require("./constants")

function getShareInfo(ctx, next) {
    let {'x-wx-skey': skey} = ctx.req.headers
    let condition = ctx.request.body;
    let iv = condition.iv;
    let encryptedData = condition.encryptedData;
    return AuthDbService.getUserInfoBySKey(skey).then(result => {
        if (result) {
            var pc = new WxCrypt(config.appId, result[0].session_key)
            var data = pc.decryptData(encryptedData, iv)
            console.log('解密后 data: ', data)
            SUCCESS(ctx, data);
        }

    })
}

async function getShareInfoByUid(ctx, next) {
    let params = ctx.params;
    await  userinfo.getUserInfoByUid(params.uid).then(res => {
        SUCCESS(ctx, res);
    })
}

async function bindShareUser(ctx, next) {
    let parmas = ctx.request.body;
    console.log(parmas);
    await userinfo.saveOrUpdateBindUser(parmas.uid, parmas.relation_uid).then(res => {
        if (res && res.code == 1) {
            SUCCESS(ctx, res.msg);
        } else {
            FAILED(ctx, "添加好友失败");
        }
    })
}

async function checkUserRelation(ctx, next) {
    let {uid, refUid} = ctx.query;
    await  mysql(CNF.DB_TABLE.user_relation_info).select("id").where("status", 0).andWhere(function () {
        this.whereIn("uid", [uid, refUid]).andWhere(function () {
            this.whereIn("relation_uid", [uid, refUid])
        })
    }).then(res => {
        if (res && res.length > 0) {
            SUCCESS(ctx, "Y");
        } else {
            SUCCESS(ctx, "N");
        }
    });
}

module.exports = {getShareInfo, getShareInfoByUid, bindShareUser, checkUserRelation}