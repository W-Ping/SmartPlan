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
 *
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
            SUCCESS(ctx, res);
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
                    planInfo.creator_uid = planDetailInfo.creator_uid;
                    planInfo.creator_name = planDetailInfo.creator_name;
                    planInfo.create_time = nowTime;
                    planInfo.update_time = nowTime;
                    planInfo.creator_uid = userInfo.uid;
                    planInfo.creator_name = userInfo.realName;
                    await  initPlanInfo(planInfo).then(res => {
                        planDetailInfo.plan_no = res.plan_no;
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
function initPlanInfo(planInfo) {
    if (planInfo) {
        return mysql(CNF.DB_TABLE.plan_info).select("plan_no").orderBy("create_time", 'desc').first().then(last => {
            let planNo = util.generateNo(CNF.PLAN_PREFIX, last ? last.plan_no : null, 1);
            planInfo.id = uuidGenerator().replace(/-/g, '');
            planInfo.plan_no = planNo;
            planInfo.start_time = util.formatUnixTime(new Date(), "Y-M-D");
            planInfo.end_time = util.nowDateAdd();
            return mysql(CNF.DB_TABLE.plan_info).insert(planInfo)
        }).then(() => {
            return Promise.resolve(planInfo)
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

function queryPlanInfo(ctx, next) {

}

module.exports = {
    query,
    get,
    update,
    save,
    saveOrUpdatePlanInfo,
    queryPlanInfo
}