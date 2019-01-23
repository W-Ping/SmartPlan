const {mysql} = require("../qcloud");
const debug = require('debug');
const uuidGenerator = require('uuid/v1')
const {SUCCESS, FAILED, CNF, ERRORS_BIZ} = require("./constants")
const util = require('../tools/util')

async function save(ctx, next) {
    let params = ctx.request.body;
    let nowTime = util.nowTime();
    let userInfo = ctx.state.$sysInfo.userinfo;
    let noteInfo = {};
    noteInfo.id = uuidGenerator().replace(/-/g, '');
    noteInfo.uid = userInfo.uid;
    noteInfo.nickName = userInfo.nickName;
    noteInfo.note_title = params.note_title;
    noteInfo.note_content = params.note_content;
    noteInfo.remind_time = params.remind_time;
    noteInfo.status = params.status ? params.status : 0;
    await mysql(CNF.DB_TABLE.note_info).insert(noteInfo).where('id', params.id).then(res => {
        SUCCESS(ctx, res);
    }).catch(e => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_INSERT_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_INSERT_TO_DB}\n${e}`)
    })
}

async function update(ctx, next) {
    let params = ctx.request.body;
    if (!params.id) throw new Error("id is null");
    let userInfo = ctx.state.$sysInfo.userinfo;
    let noteInfo = {};
    await mysql(CNF.DB_TABLE.note_info).select("id").where({'id': params.id, 'uid': userInfo}).then(async res => {
        if (res && res.length > 0) {
            if (params.status) {
                noteInfo.status = params.status;
            }
            if (params.remind_time) {
                noteInfo.remind_time = params.remind_time;
            }
            if (params.note_title) {
                noteInfo.note_title = params.note_title;
            }
            if (params.note_content) {
                noteInfo.note_content = params.note_content;
            }
            noteInfo.update_time = nowTime;
            await mysql(CNF.DB_TABLE.note_info).update(noteInfo).where('id', params.id).then(res => {
                SUCCESS(ctx, res);
            }).catch(e => {
                debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_UPDATE_TO_DB, e)
                throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_UPDATE_TO_DB}\n${e}`)
            })
        } else {
            FAILED(ctx, res);
        }
    })
}

async function get(ctx, next) {
    let params = ctx.request.body;
    if (!params.id) throw new Error("id is null");
    let userInfo = ctx.state.$sysInfo.userinfo;
    await  mysql(CNF.DB_TABLE.note_info).select("id").where({'id': params.id, 'uid': userInfo}).first().then(res => {
        SUCCESS(ctx, res);
    }).catch(e => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB}\n${e}`)
    })
}

async function query(ctx, next) {
    let params = ctx.request.body;
    let userInfo = ctx.state.$sysInfo.userinfo;
    let condition = {uid: userInfo.uid};
    if (params && params.status) {
        condition.status = params.status;
    }
    await   mysql(CNF.DB_TABLE.note_info).select("*").where(condition).orderByRaw("status desc,update_time desc").then(res => {
        SUCCESS(ctx, res);
    }).catch(e => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB}\n${e}`)
    })
}

async function getRemindNoteList(ctx, next) {
    let userInfo = ctx.state.$sysInfo.userinfo;
    let nowDate = util.formatUnixTime(new Date(), 'Y-M-D');
    let nextDate = util.nowDateAdd(1, nowDate);
    await   mysql(CNF.DB_TABLE.note_info).select("*").where({uid: userInfo.uid}).whereBetween("remind_time", [nowDate, nextDate]).orderByRaw("update_time desc").then(res => {
        SUCCESS(ctx, res);
    }).catch(e => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB}\n${e}`)
    })
}

/**
 *
 * @returns {Promise<void>}
 */
async function getRemindNoteCount(ctx, next) {
    let userInfo = ctx.state.$sysInfo.userinfo;
    await   mysql(CNF.DB_TABLE.note_info).count("id as rm_count").where({uid: userInfo.uid}).where({
        uid: userInfo.uid,
        status: 1
    }).then(res => {
        SUCCESS(ctx, res);
    }).catch(e => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB}\n${e}`)
    })
}

/**
 *
 * @param ctx
 * @param nex
 * @returns {Promise<void>}
 */
async function deleteNote(ctx, nex) {
    let {id} = ctx.query;
    if (!id) throw new Error("id is null")
    let userInfo = ctx.state.$sysInfo.userinfo;
    await mysql(CNF.DB_TABLE.note_info).del().where({id: id, uid: userInfo.uid}).then(res => {
        SUCCESS(ctx, res);
    }).catch(e => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_DELETED_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_DELETED_TO_DB}\n${e}`)
    })
}

module.exports = {
    get,
    query,
    save,
    deleteNote,
    update,
    getRemindNoteCount,
    getRemindNoteList
}