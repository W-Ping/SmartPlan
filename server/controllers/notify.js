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
function saveNotifyRecord(notifyRecord) {
    if (!notifyRecord) {
        throw new Error("notifyRecord is null")
    }
    let nowTime = util.nowTime();
    let startTime = nowTime.substr(0, 10)
    notifyRecord.notify_time = nowTime;
    return mysql(CNF.DB_TABLE.notify_record_info).select("id").where({
        'openId': notifyRecord.openId,
        'bizNo': notifyRecord.bizNo
    }).andWhereBetween('notify_time', [startTime, nowTime]).then(async res => {
        if (!res || res.length < CNF.REMIND_MAX_COUNT) {
            notifyRecord.id = uuidGenerator().replace(/-/g, '');
            return mysql(CNF.DB_TABLE.notify_record_info).insert(notifyRecord).then(result => {
                return Promise.resolve(1);
            }).catch(e => {
                debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_INSERT_TO_DB, e)
                throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_INSERT_TO_DB}\n${e}`)
            })
        } else {
            return Promise.resolve(-1);
        }
    })
}

/**
 *
 * @param uid
 * @returns {*|Promise<any>|PromiseLike<T>|Promise<T>}
 */
function getNotifyRecordCountByUid(uid, bizNo) {
    let nowTime = util.nowTime();
    let startTime = nowTime.substr(0, 10)
    return mysql(CNF.DB_TABLE.notify_record_info).count("id as count").first().where({
        'uid': uid,
        'bizNo': bizNo
    }).andWhereBetween('notify_time', [startTime, nowTime]).then(res => {
        return Promise.resolve(res);
    }).catch(e => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB}\n${e}`)
    })
}


module.exports = {saveNotifyRecord, getNotifyRecordCountByUid}