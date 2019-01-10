const {mysql} = require("../qcloud");
const debug = require('debug');
const uuidGenerator = require('uuid/v1')
const {SUCCESS, FAILED, CNF, ERRORS_BIZ} = require("./constants")
const util = require('../tools/util')

/**
 *
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function query(ctx, next) {
    let condition = ctx.request.body;
    await mysql(CNF.DB_TABLE.plan_detail_info).select('*').where({condition}).then(res => {
        SUCCESS(ctx, res);
    }).catch(e => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB}\n${e}`)
    })
}

/**
 *
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function get(ctx, next) {
    let {plan_detail_no} = ctx.query;
    await mysql(CNF.DB_TABLE.plan_detail_info).select('*').where({plan_detail_no}).first().then(res => {
        SUCCESS(ctx, res);
    }).catch(e => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB}\n${e}`)
    })
}

/**
 *
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function update(ctx, next) {
    let planDetailInfo = ctx.request.body;
    let plan_detail_no = planDetailInfo.plan_detail_no;
    let nowTime = util.nowTime();
    planDetailInfo.update_time = nowTime;
    await mysql(CNF.DB_TABLE.plan_detail_info).update(planDetailInfo).where({plan_detail_no}).first().then(res => {
        SUCCESS(ctx, res);
    }).catch(e => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_UPDATE_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_UPDATE_TO_DB}\n${e}`)
    })
}

/**
 * 保存计划信息
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function save(ctx, next) {
    let planDetailInfo = ctx.request.body || {};
    let plan_no = planDetailInfo.plan_no;
    let plan_detail_no = planDetailInfo.plan_detail_no;
    let nowTime = util.nowTime();
    let userInfo = ctx.state.$sysInfo.userinfo;
    planDetailInfo.creator_uid = userInfo.uid;
    planDetailInfo.creator_name = userInfo.realName;
    if (planDetailInfo.plan_detail_no) {
        planDetailInfo.update_time = nowTime;
        await mysql(CNF.DB_TABLE.plan_detail_info).update(planDetailInfo).where({plan_detail_no}).then(res => {
            SUCCESS(ctx, planDetailInfo);
        }).catch(e => {
            debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_UPDATE_TO_DB, e)
            throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_UPDATE_TO_DB}\n${e}`)
        })
    } else {
        await mysql(CNF.DB_TABLE.plan_detail_info).select('plan_detail_no').orderBy('create_time', 'desc').first()
            .then(async lastPlanDetail => {
                const planDetailNo = util.generateNo(CNF.PLAN_DETAIL_PREFIX, lastPlanDetail ? lastPlanDetail.plan_detail_no : null, 1);
                planDetailInfo.id = uuidGenerator().replace(/-/g, '');
                planDetailInfo.plan_detail_no = planDetailNo;
                planDetailInfo.create_time = nowTime;
                planDetailInfo.update_time = nowTime;
                if (!plan_no) {
                    let planInfo = {};
                    planInfo.create_time = nowTime;
                    planInfo.update_time = nowTime;
                    planInfo.plan_title = planDetailInfo.plan_detail_name || '';
                    planInfo.creator_uid = userInfo.uid;
                    planInfo.creator_name = userInfo.realName;
                    await  initPlanInfo(planInfo, planDetailInfo).then(res => {
                        planDetailInfo.plan_no = res.plan_no;
                        planDetailInfo.priority = res.priority;
                    });
                }
                await mysql(CNF.DB_TABLE.plan_detail_info).insert(planDetailInfo).then(async res => {
                    SUCCESS(ctx, planDetailInfo);
                });
            }).catch(e => {
                debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_INSERT_TO_DB, e)
                throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_INSERT_TO_DB}\n${e}`)
            })
    }


}

/**
 * 初始化计划主表
 * @param planInfo
 * @returns {*}
 */
function initPlanInfo(planInfo, planDetailInfo) {
    if (planInfo && planDetailInfo) {
        let startTime = planDetailInfo.plan_start_time;
        let endTime = planDetailInfo.plan_end_time;
        return mysql(CNF.DB_TABLE.plan_info).select("plan_no").where('start_time', '<=', startTime).andWhere('end_time', '>=', endTime)
            .andWhere('creator_uid', planInfo.creator_uid).first().then(res => {
                if (!res || res.plan_no <= 0) {
                    return mysql(CNF.DB_TABLE.plan_info).select("plan_no").orderBy("create_time", 'desc').first().then(last => {
                        let planNo = util.generateNo(CNF.PLAN_PREFIX, last ? last.plan_no : null, 1);
                        planInfo.id = uuidGenerator().replace(/-/g, '');
                        planInfo.plan_no = planNo;
                        planInfo.start_time = util.formatUnixTime(new Date(), "Y-M-D");
                        planInfo.end_time = util.nowDateAdd();
                        return mysql(CNF.DB_TABLE.plan_info).insert(planInfo)
                    }).then(() => {
                        planInfo.priority = 1;
                        return Promise.resolve(planInfo)
                    }).catch(e => {
                        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_INSERT_TO_DB, e)
                        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_INSERT_TO_DB}\n${e}`)
                    })
                } else {
                    planInfo.priority = 0;
                    planInfo.plan_no = res.plan_no;
                    return Promise.resolve(planInfo)
                }
            }).catch(e => {
                debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_INSERT_TO_DB, e)
                throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_INSERT_TO_DB}\n${e}`)
            })
    }
}

/**
 * 更新或新增 计划主表
 * @param res
 */
async function saveOrUpdatePlanInfo(ctx, next) {
    var planInfo = ctx.request.body || {};
    var nowTime = util.nowTime();
    if (planInfo && planInfo.plan_no) {
        planInfo.update_time = nowTime;
        await mysql(CNF.DB_TABLE.plan_info).update(planInfo).where({plan_no: planInfo.plan_no}).then(async res => {
            SUCCESS(ctx, planInfo);
        }).catch(e => {
            debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_UPDATE_TO_DB, e)
            throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_UPDATE_TO_DB}\n${e}`)
        })
    } else {
        await mysql(CNF.DB_TABLE.plan_info).select('plan_no').orderBy('create_time', 'desc').first().then(async last => {
            const planNo = util.generateNo(CNF.PLAN_PREFIX, last ? last.plan_no : null, 1);
            planInfo.id = uuidGenerator().replace(/-/g, '');
            planInfo.plan_no = planNo;
            planInfo.create_time = nowTime;
            planInfo.update_time = nowTime;
            await mysql(CNF.DB_TABLE.plan_info).insert(planInfo).then(async res => {
                SUCCESS(ctx, planInfo);
            }).catch(e => {
                debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_INSERT_TO_DB, e)
                throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_INSERT_TO_DB}\n${e}`)
            });
        })

    }

}

/**
 * 查询计划主表
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function queryPlanInfo(ctx, next) {
    let condition = ctx.request.body || {1: 1};
    await mysql(CNF.DB_TABLE.plan_info).select("*").where(condition).then(res => {
        SUCCESS(ctx, res);
    }).catch(e => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB}\n${e}`)
    });
}

/**
 * 查询计划主表和明细
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function getPlanInfo(ctx, next) {
    let {planNo} = ctx.query;
    await mysql(CNF.DB_TABLE.plan_info).select("*").where({plan_no: planNo}).first().then(async res => {
        let result = {
            planInfo: res,
            planDetailInfoList: []
        }
        if (res) {
            await  mysql(CNF.DB_TABLE.plan_detail_info).select("*").where({plan_no: planNo}).then(list => {
                result.planDetailInfoList = list
                SUCCESS(ctx, result);
            })
        } else {
            SUCCESS(ctx, result);
        }
    }).catch(e => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB}\n${e}`)
    });
}

/**
 *
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
function del(ctx, next) {
    let {pNo, pdNo} = ctx.query;
    let userInfo = ctx.state.$sysInfo.userinfo;
    let uid = userInfo.uid;
    return mysql(CNF.DB_TABLE.plan_detail_info).count("id as idCount").where({plan_no: pNo}).andWhere('creator_uid', uid).then(res => {
        if (res && res[0].idCount == 1) {
            return mysql(CNF.DB_TABLE.plan_info)
                .transacting(tx)
                .del().where({plan_no: pNo, creator_uid: uid})
                .then(res => {
                    return mysql(CNF.DB_TABLE.plan_detail_info).del().where({plan_no: pdNo, creator_uid: uid});
                }).then(res => {
                        tx.commit
                        return Promise.resolve(1);
                    }
                ).catch(e => {
                    tx.rollback();
                    return Promise.resolve(-1);
                    debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_DELETED_TO_DB, e)
                    throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_DELETED_TO_DB}\n${e}`)
                })
        } else {
            return mysql(CNF.DB_TABLE.plan_detail_info).del().where({
                plan_detail_no: pdNo,
                creator_uid: uid
            }).then(res => {
                return Promise.resolve(1);
            }).catch(e => {
                debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_DELETED_TO_DB, e)
                throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_DELETED_TO_DB}\n${e}`)
            })
        }
    }).then(res => {
        if (res == 1) {
            SUCCESS(ctx, res);
        } else {
            FAILED(ctx, res);
        }
    }).catch(e => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_DELETED_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_DELETED_TO_DB}\n${e}`)
    })
}

// function deletePlanInfo(condition){
//     mysql.transaction(function (t) {
//         return mysql(table)
//             .transacting(t)
//             .update(condition).where(conditon)
//             .then(function (res) {
//                 return callback(res, t)
//             })
//             .then(t.commit)
//             .catch(function (e) {
//                 t.rollback()
//                 throw e
//             })
//     }).then(function () {
//         console.log('SUCCESS')
//         return result(1)
//         // it worked
//     }).catch(function (e) {
//         console.log('failed')
//         return result(-1)
//     })
// }
module.exports = {
    query,
    get,
    update,
    save,
    saveOrUpdatePlanInfo,
    queryPlanInfo,
    getPlanInfo,
    del,
}