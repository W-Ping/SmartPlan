const {mysql} = require("../qcloud");
const debug = require('debug');
const {SUCCESS, FAILED, CNF, ERRORS_BIZ} = require("./constants")
const util = require('../tools/util')
const uuidGenerator = require('uuid/v1')
/**
 *  记录用户formId for 消息推送
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function saveOrUpdate(ctx, next) {
    let {formId} = ctx.request.body;
    if (!formId) {
        throw new Error("formId is null")
    }
    let userInfo = ctx.state.$sysInfo.userinfo;
    let nowTime = util.nowTime()
    let formIdInfo = {};
    formIdInfo.formId = formId
    formIdInfo.last_refresh_time = nowTime;
    await mysql(CNF.DB_TABLE.user_formid_info).select("id").where('openId', userInfo.openId).then(async res => {
        if (res && res.length > 0) {
            await mysql(CNF.DB_TABLE.user_formid_info).update(formIdInfo).where('id', res[0].id).then(result => {
                SUCCESS(ctx, result);
            })
        } else {
            formIdInfo.id = uuidGenerator().replace(/-/g, '');
            formIdInfo.uid = userInfo.uid;
            formIdInfo.openId = userInfo.openId;
            formIdInfo.create_time = nowTime;
            await mysql(CNF.DB_TABLE.user_formid_info).insert(formIdInfo).then(result => {
                SUCCESS(ctx, result);
            }).catch(e => {
                debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_INSERT_TO_DB, e)
                throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_INSERT_TO_DB}\n${e}`)
            })
        }
    })
}

/**
 *
 * @param uid
 * @returns {*|Promise<any>|PromiseLike<T>|Promise<T>}
 */
function getFormIdByUid(uid) {
    return mysql(CNF.DB_TABLE.user_formid_info).select("*").where(uid).first().then(res => {
        return Promise.resolve(res);
    }).catch(e => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB}\n${e}`)
    })
}

module.exports = {saveOrUpdate, getFormIdByUid}