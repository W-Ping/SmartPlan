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
    let {last_refresh_time, formId} = ctx.request.body;
    if (!formId) {
        throw new Error("formId is null")
    }
    if (formId == 'the formId is a mock one') {
        SUCCESS(ctx, "the formId is a mock one");
        return;
    }
    let userInfo = ctx.state.$sysInfo.userinfo;
    let nowTime = util.nowTime();
    let formIdInfo = {};
    if (!last_refresh_time) {
        formIdInfo.last_refresh_time = nowTime;
    }
    formIdInfo.formId = formId;
    formIdInfo.last_refresh_time = last_refresh_time;
    await mysql(CNF.DB_TABLE.user_formid_info).select("id").where('openId', userInfo.openId).orderBy('last_refresh_time', 'ASC').then(async res => {
        if (res && res.length == CNF.REMIND_MAX_COUNT) {
            await mysql(CNF.DB_TABLE.user_formid_info).update(formIdInfo).where('id', res[0].id).then(result => {
                SUCCESS(ctx, result);
            })
        } else {
            formIdInfo.id = uuidGenerator().replace(/-/g, '');
            formIdInfo.uid = userInfo.uid;
            formIdInfo.create_time = nowTime;
            formIdInfo.openId = userInfo.openId;
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
 *  消费formId 先进先出
 * @param uid
 * @returns {*|Promise<any>|PromiseLike<T>|Promise<T>}
 */
function getFormIdByUid(uid) {
    return mysql(CNF.DB_TABLE.user_formid_info).select("*").where('uid', uid).orderBy('last_refresh_time', 'ASC').first().then(res => {
        return Promise.resolve(res);
    }).catch(e => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB}\n${e}`)
    })
}

module.exports = {saveOrUpdate, getFormIdByUid}