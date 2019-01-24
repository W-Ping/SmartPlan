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
    let auth_type = [0, 1];
    if (condition && condition.auth_type) {
        auth_type = condition.auth_type;
        delete condition.auth_type;
    }
    await mysql(CNF.DB_TABLE.plan_detail_info).select('*').whereIn('auth_type', auth_type).andWhere(function () {
        if (condition) {
            this.where(condition)
        }
    }).orderByRaw('priority desc').then(res => {
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
    let {pdNo} = ctx.query;
    await mysql(CNF.DB_TABLE.plan_detail_info).select('*').where({plan_detail_no: pdNo}).first().then(async res => {
        if (res) {
            let result = {planDetailInfo: res};
            await mysql(CNF.DB_TABLE.plan_info).select("*").where({plan_no: res.plan_no}).first().then(async res => {
                result.planInfo = res;
                await mysql(CNF.DB_TABLE.plan_user_ref_info).select(CNF.DB_TABLE.plan_user_ref_info + ".*", CNF.DB_TABLE.user_info + ".nickName").leftJoin(CNF.DB_TABLE.user_info, function () {
                    this.on(CNF.DB_TABLE.plan_user_ref_info + '.friend_uid', '=', CNF.DB_TABLE.user_info + '.uid')
                }).where({
                    plan_detail_no: pdNo
                }).andWhere(CNF.DB_TABLE.plan_user_ref_info + ".status", 0).then(res => {
                    if (res && res.length > 0) {
                        result.planSuperviseList = res;
                    } else {
                        result.planSuperviseList = [];
                    }
                    SUCCESS(ctx, result);
                });
            })
        } else {
            SUCCESS(ctx, {});
        }

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
    planDetailInfo.avatarUrl = userInfo.avatarUrl;
    let followUidList = planDetailInfo.followUidList;
    delete planDetailInfo.followUidList;
    if (planDetailInfo.plan_detail_no) {
        planDetailInfo.update_time = nowTime;
        await  mysql(CNF.DB_TABLE.plan_detail_info).select("id", 'priority', "plan_no").where({
            plan_detail_no: planDetailInfo.plan_detail_no,
            is_deleted: 0
        }).first().then(async res => {
            if (res && res.priority == 1 && res.plan_detail_name !== planDetailInfo.plan_detail_name) {
                await mysql(CNF.DB_TABLE.plan_info).update({plan_title: planDetailInfo.plan_detail_name}).where({plan_no: res.plan_no})
            }
            await mysql(CNF.DB_TABLE.plan_detail_info).update(planDetailInfo).where({
                plan_detail_no: plan_detail_no,
                creator_uid: userInfo.uid,
                is_deleted: 0
            }).then(async res => {
                await savePlanUserRef(followUidList, planDetailInfo, userInfo).then(res => {
                    SUCCESS(ctx, planDetailInfo);
                });
            }).catch(e => {
                debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_UPDATE_TO_DB, e)
                throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_UPDATE_TO_DB}\n${e}`)
            })
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
                    planInfo.auth_type = planDetailInfo.auth_type || 0;
                    planInfo.avatarUrl = userInfo.avatarUrl;
                    await  initPlanInfo(planInfo, planDetailInfo).then(res => {
                        planDetailInfo.plan_no = res.plan_no;
                        planDetailInfo.priority = res.priority;
                    });
                }
                await savePlanUserRef(followUidList, planDetailInfo, userInfo);
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
 *
 * @param followUidList
 * @param planDetailInfo
 * @param userInfo
 * @returns {Promise<void>}
 */
async function savePlanUserRef(followUidList, planDetailInfo, userInfo) {
    if (followUidList && followUidList.length > 0 && planDetailInfo && userInfo) {
        await mysql(CNF.DB_TABLE.plan_user_ref_info).del().where({
            creator_uid: userInfo.uid,
            plan_detail_no: planDetailInfo.plan_detail_no
        }).then(async res => {
            let nowTime = util.nowTime();
            let planUserRefInfoList = []
            followUidList.forEach(function (v, i) {
                planUserRefInfoList.push({
                    id: uuidGenerator().replace(/-/g, ''),
                    friend_uid: v,
                    plan_no: planDetailInfo.plan_no,
                    plan_detail_no: planDetailInfo.plan_detail_no,
                    creator_uid: userInfo.uid,
                    create_time: nowTime,
                    update_time: nowTime,
                })
            })
            await  mysql(CNF.DB_TABLE.plan_user_ref_info).insert(planUserRefInfoList);
        }).catch(e => {
            debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_INSERT_TO_DB, e)
            throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_INSERT_TO_DB}\n${e}`)
        })
    }
}

function getAuthorizationPlanNo(uid) {
    return mysql(CNF.DB_TABLE.plan_user_ref_info).distinct("plan_no", 'plan_detail_no').select().where({
        friend_uid: uid,
        status: 0
    }).then(res => {
        if (res) {
            let planNoList = [];
            let planDetailNoList = [];
            res.forEach(function (v, i) {
                planNoList.push(v.plan_no);
                planDetailNoList.push(v.plan_detail_no);
            })
            return Promise.resolve({planNoList: planNoList, planDetailNoList: planDetailNoList})
        } else {
            return Promise.resolve({})
        }
    }).catch(e => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB}\n${e}`)
    })
}

/**
 * 获取授权的好友
 * @param uid
 * @returns {Promise<any>}
 */
function getAuthorizationUid(uid) {
    return mysql(CNF.DB_TABLE.user_relation_info).distinct("relation_uid").select().where({
        uid: uid,
        status: 0
    }).then(res => {
        let relUidArr = [];
        if (res && res.length > 0) {
            res.forEach(function (item) {
                relUidArr.push(item.relation_uid)
            })
        }
        return Promise.resolve(relUidArr);
    }).catch(e => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB}\n${e}`)
    })
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
                if (!res || !res.plan_no) {
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
    let params = ctx.request.body;
    let userInfo = ctx.state.$sysInfo.userinfo;
    let uid = userInfo.uid;
    let authTypeArr = [0];
    if (params && params.auth_type) {
        if (Array.isArray(params.auth_type)) {
            authTypeArr = params.auth_type;
        } else {
            authTypeArr[0] = params.auth_type;
        }
    }
    if (params && params.type == 1) {//查询好友目标
        await getAuthorizationUid(uid).then(async relationUidArr => {
            if (relationUidArr && relationUidArr.length > 0) {
                await mysql(CNF.DB_TABLE.plan_info).select("*").where(builder => {
                    builder.whereIn("creator_uid", relationUidArr).whereIn('auth_type', authTypeArr).andWhereNot("creator_uid", uid)
                }).then(res => {
                    SUCCESS(ctx, res);
                }).catch(e => {
                    debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB, e)
                    throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB}\n${e}`)
                });
            } else {
                SUCCESS(ctx, relationUidArr);
            }
        })
    } else {
        //查询自己目标
        await  mysql(CNF.DB_TABLE.plan_info).select("*").where(builder => {
            builder.where("creator_uid", uid).whereIn("auth_type", authTypeArr)
        }).then(res => {
            SUCCESS(ctx, res);
        }).catch(e => {
            debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB, e)
            throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB}\n${e}`)
        });
    }
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
            await  mysql(CNF.DB_TABLE.plan_detail_info).select("*").where({plan_no: planNo}).orderByRaw("priority desc,status asc,create_time desc").then(list => {
                result.planDetailInfoList = list
                console.log("planDetailInfoList", list);
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
 *  获取最新的目标计划
 *
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function getLastPlanInfo(ctx, next) {
    let userInfo = ctx.state.$sysInfo.userinfo;
    await mysql(CNF.DB_TABLE.plan_info).select('*').where({
        is_deleted: 0,
        creator_uid: userInfo.uid
    }).andWhereNot('status', 2).orderBy('start_time', 'desc').first().then(async res => {
        SUCCESS(ctx, res);
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
async function del(ctx, next) {
    let {pNo, pdNo} = ctx.query;
    let userInfo = ctx.state.$sysInfo.userinfo;
    let uid = userInfo.uid;
    return mysql(CNF.DB_TABLE.plan_detail_info).count("id as idCount").where({plan_no: pNo}).andWhere('creator_uid', uid).then(res => {
        if (res && res[0].idCount == 1) {
            return mysql.transaction(function (tx) {
                return mysql(CNF.DB_TABLE.plan_info)
                    .transacting(tx)
                    .del().where({plan_no: pNo, creator_uid: uid})
                    .then(res => {
                        return mysql(CNF.DB_TABLE.plan_detail_info).del().where({
                            plan_detail_no: pdNo,
                            creator_uid: uid
                        });
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
            })
        } else {
            return mysql(CNF.DB_TABLE.plan_detail_info).select("priority", "plan_no").where({plan_detail_no: pdNo}).first().then(res => {
                if (res && res.priority == 1) {
                    return mysql(CNF.DB_TABLE.plan_detail_info).select("id", "plan_detail_name").where({plan_no: pNo}).whereNot({
                        plan_detail_no: pdNo,
                        priority: 1
                    }).whereNotNull("plan_detail_name").orderByRaw("status asc,create_time desc").first().then(res => {
                        console.log("del.....", res);
                        let plan_detail_name = res && res.plan_detail_name ? res.plan_detail_name : '';
                        return mysql(CNF.DB_TABLE.plan_detail_info).update({priority: 1}).where('id', res.id).then(async res => {
                            if (plan_detail_name) {
                                await mysql(CNF.DB_TABLE.plan_info).update({plan_title: plan_detail_name}).where({plan_no: pNo})
                            }
                            return mysql(CNF.DB_TABLE.plan_detail_info).del().where({
                                plan_detail_no: pdNo,
                                creator_uid: uid
                            }).then(res => {
                                return Promise.resolve(1);
                            }).catch(e => {
                                return Promise.resolve(-1);
                                debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_DELETED_TO_DB, e)
                                throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_DELETED_TO_DB}\n${e}`)
                            })
                        })
                    })
                } else {
                    return mysql(CNF.DB_TABLE.plan_detail_info).del().where({
                        plan_detail_no: pdNo,
                        creator_uid: uid
                    }).then(res => {
                        return Promise.resolve(1);
                    }).catch(e => {
                        return Promise.resolve(-1);
                        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_DELETED_TO_DB, e)
                        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_DELETED_TO_DB}\n${e}`)
                    })
                }
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

/**
 *
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
function topIndex(ctx, next) {
    let condition = ctx.request.body;
    let pdNo = condition.pdNo;
    return mysql(CNF.DB_TABLE.plan_detail_info).update({priority: 0}).where({priority: 1}).andWhereNot({plan_detail_no: pdNo}).then(async res => {
        return mysql(CNF.DB_TABLE.plan_detail_info).select('plan_detail_name', 'plan_no').where({plan_detail_no: pdNo}).first().then(async result => {
            await mysql(CNF.DB_TABLE.plan_info).update({plan_title: result.plan_detail_name}).where({plan_no: result.plan_no}).then(async res => {
                await mysql(CNF.DB_TABLE.plan_detail_info).update({priority: 1}).where({plan_detail_no: pdNo})
            })
            return Promise.resolve(result);
        })
    }).then(res => {
        SUCCESS(ctx, res);
    }).catch(e => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_UPDATE_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_UPDATE_TO_DB}\n${e}`)
    })
}

async function addProgress(ctx, next) {
    let condition = ctx.request.body;
    let pdNo = condition.plan_detail_no;
    let progress = condition.progress;
    let nowTime = util.nowTime();
    if (pdNo && progress) {
        let updateInfo = {progress: progress, update_time: nowTime}
        if (progress >= 100) {
            updateInfo.status = 2;
            updateInfo.plan_actual_end_time = nowTime;
        }
        await mysql(CNF.DB_TABLE.plan_detail_info).update(updateInfo).where("plan_detail_no", pdNo).then(res => {
            SUCCESS(ctx, res);
        }).catch(e => {
            debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_UPDATE_TO_DB, e)
            throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_UPDATE_TO_DB}\n${e}`)
        })
    }
}

async function startPlanDetailInfo(ctx, next) {
    let condition = ctx.request.body;
    let pdNo = condition.pdNo;
    let pNo = condition.pNo;
    let userInfo = ctx.state.$sysInfo.userinfo;
    let uid = userInfo.uid;
    let nowTime = util.nowTime();
    await mysql(CNF.DB_TABLE.plan_info).select("id").where({
        plan_no: pNo,
        is_deleted: 0,
        status: 0,
        creator_uid: uid
    }).first().then(async res => {
        if (res && res.id) {
            await  mysql(CNF.DB_TABLE.plan_info).update({status: 1, update_time: nowTime}).where({
                id: res.id
            });
        }
        await mysql(CNF.DB_TABLE.plan_detail_info).update({
            status: 1,
            progress: 10,
            plan_actual_start_time: nowTime,
            update_time: nowTime,
        }).where({plan_detail_no: pdNo, creator_uid: uid, is_deleted: 0,}).then(res => {
            SUCCESS(ctx, res)
        })
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
async function getPlanInfoStat(ctx, next) {
    let userInfo = ctx.state.$sysInfo.userinfo;
    await mysql(CNF.DB_TABLE.plan_info).select("*").joinRaw(" as pi inner join " +
        "(select plan_no,count(1) as count_sum,sum(if(status = 0, 1, 0)) as todo_count,sum(if(status = 1, 1, 0)) " +
        "as doing_count,sum(if(status = 2, 1, 0)) as done_count from " + CNF.DB_TABLE.plan_detail_info + " group by  plan_no)" +
        " pdi on pi.plan_no = pdi.plan_no").where("pi.creator_uid", userInfo.uid).orderBy("start_time", "desc").then(res => {
        SUCCESS(ctx, res);
    }).catch(e => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB}\n${e}`)
    })
}

async function getRelationPlanDetail(ctx, next) {
    let params = ctx.query;
    if (!params && !params.rUid) {
        FAILED(ctx, "rUid is null");
        return;
    }
    let pageNum = 0;
    let pageSize = 3;
    if (params.pNum) {
        pageNum = parseInt(params.pNum);
    }
    if (params.pSize) {
        pageSize = parseInt(params.pSize);
    }
    await mysql(CNF.DB_TABLE.plan_detail_info).select("*").where({
        creator_uid: params.rUid,
        auth_type: 0
    }).orderByRaw(" update_time desc").limit(pageSize).offset(pageNum).then(res => {
        SUCCESS(ctx, res);
    }).catch(e => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB}\n${e}`)
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
    getPlanInfoStat,
    getRelationPlanDetail,
    getPlanInfo,
    getLastPlanInfo,
    startPlanDetailInfo,
    addProgress,
    del,
    topIndex,
}