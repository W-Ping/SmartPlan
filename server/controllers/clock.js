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
async function save(ctx, next) {
    let params = ctx.request.body;
    let userInfo = ctx.state.$sysInfo.userinfo;
    let dateVersion = util.formatUnixTime(new Date(), 'Y-M-D');
    let nowTime = util.nowTime();
    await  mysql(CNF.DB_TABLE.clock_record_info).select("id").where({
        uid: userInfo.uid,
        clock_type: params.clock_type,
        date_version: dateVersion
    }).then(async res => {
        if (res && res.length > 0) {
            let update = {};
            if (params.clock_off_time) {
                update.clock_off_time = params.clock_off_time;
            }
            if (params.clock_on_time) {
                update.clock_on_time = params.clock_on_time;
            }
            update.update_time = nowTime
            await mysql(CNF.DB_TABLE.clock_record_info).update(update).where({id: res[0].id}).then(res => {
                SUCCESS(ctx, res);
            }).catch(e => {
                debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_UPDATE_TO_DB, e)
                throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_UPDATE_TO_DB}\n${e}`)
            });
            ;
        } else {
            let clockRecordInfo = {};
            clockRecordInfo.id = uuidGenerator().replace(/-/g, '');
            clockRecordInfo.create_time = nowTime;
            clockRecordInfo.update_time = nowTime;
            clockRecordInfo.uid = userInfo.uid;
            clockRecordInfo.date_version = dateVersion;
            clockRecordInfo.clock_type = params.clock_type;
            if (params.clock_off_time) {
                clockRecordInfo.clock_off_time = params.clock_off_time;
            }
            if (params.clock_on_time) {
                clockRecordInfo.clock_on_time = params.clock_on_time;
            }
            await  mysql(CNF.DB_TABLE.clock_record_info).insert(clockRecordInfo).then(res => {
                SUCCESS(ctx, res);
            }).catch(e => {
                debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_INSERT_TO_DB, e)
                throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_INSERT_TO_DB}\n${e}`)
            });
        }
    })

}

/**
 *
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function getClockRuleRecord(ctx, next) {
    let userInfo = ctx.state.$sysInfo.userinfo;
    let params = ctx.request.body;
    let clockType = params.clock_type ? params.clock_type : 0;
    await mysql(CNF.DB_TABLE.clock_record_info).select("*").where({
        uid: userInfo.uid,
        clock_type: clockType
    }).andWhere(function () {
        if (params.startTime && params.endTime) {
            this.whereBetween('date_version', [params.startTime, params.endTime])
        }
    }).then(res => {
        SUCCESS(ctx, res);
    })
}

async function get(ctx, next) {
    let userInfo = ctx.state.$sysInfo.userinfo;
    let week = new Date().getDay();
    let today = util.formatUnixTime(new Date(), 'Y-M-D');
    await mysql(CNF.DB_TABLE.clock_rule_info).select("*").where({uid: userInfo.uid, status: 0}).then(async res => {
        let result = {
            workClockRuleInfo: {},
            overtimeWorkClockRuleInfo: {},
            workClockInfo: {},
            overtimeWorkClockInfo: {},
        }
        if (res && res.length > 0) {
            let clockTypeArr = [];
            res.forEach(function (item, i) {
                if (item.clock_valid_week && item.clock_valid_week.indexOf(week) != -1) {
                    if (item.clock_type == 0) {
                        result.workClockRuleInfo = item;
                    } else if (item.clock_type == 1 || item.clock_type == 2) {
                        result.overtimeWorkClockRuleInfo = item;
                        item.clock_type = 1
                    }
                    clockTypeArr.push(item.clock_type);
                }
            })
            await mysql(CNF.DB_TABLE.clock_record_info).select("*").whereIn('clock_type', clockTypeArr).andWhere({
                date_version: today,
                uid: userInfo.uid
            }).then(res => {
                if (res && res.length > 0) {
                    res.forEach(function (item, i) {
                        if (item.clock_type == 0) {
                            result.workClockInfo = item;
                        } else if (item.clock_type == 1) {
                            result.overtimeWorkClockInfo = item;
                        }
                    })
                }
            }).catch(e => {
                debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB, e)
                throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB}\n${e}`)
            });
        }
        SUCCESS(ctx, result);
    })

}

/**
 *
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function saveClockRuleInfo(ctx, next) {
    let params = ctx.request.body;
    let userInfo = ctx.state.$sysInfo.userinfo;
    let wkClockRuleInfo = {}
    wkClockRuleInfo.clock_on_time = params.onWkTime;
    wkClockRuleInfo.clock_off_time = params.offWkTime;
    wkClockRuleInfo.clock_type = 0;
    let onWkTimeRangeArr = timeRangeToTime(params.onWkTimeRange);
    wkClockRuleInfo.clock_on_min_time = onWkTimeRangeArr[0]
    wkClockRuleInfo.clock_on_max_time = onWkTimeRangeArr[1];
    let offWkTimeRangeArr = timeRangeToTime(params.offWkTimeRange);
    wkClockRuleInfo.clock_off_min_time = offWkTimeRangeArr[0];
    wkClockRuleInfo.clock_off_max_time = offWkTimeRangeArr[1];
    wkClockRuleInfo.clock_valid_week = params.wkWeekdays.join(",");
    wkClockRuleInfo.status = params.wkActive ? 0 : 1;
    wkClockRuleInfo.uid = userInfo.uid;

    let wkOvClockRuleInfo = {}
    wkOvClockRuleInfo.clock_on_time = params.onOvTime;
    wkOvClockRuleInfo.clock_off_time = params.offOvTime;
    wkOvClockRuleInfo.clock_type = 1;
    let onOvWkTimeRangeArr = timeRangeToTime(params.onOvWkTimeRange);
    wkOvClockRuleInfo.clock_on_min_time = onOvWkTimeRangeArr[0]
    wkOvClockRuleInfo.clock_on_max_time = onOvWkTimeRangeArr[1];
    let offOvWkTimeRangeArr = timeRangeToTime(params.offOvWkTimeRange);
    wkOvClockRuleInfo.clock_off_min_time = offOvWkTimeRangeArr[0];
    wkOvClockRuleInfo.clock_off_max_time = offOvWkTimeRangeArr[1];
    wkOvClockRuleInfo.clock_valid_week = params.ovWeekdays.join(",");
    wkOvClockRuleInfo.status = params.ovActive ? 0 : 1;
    wkOvClockRuleInfo.uid = userInfo.uid;

    let wkOvWeekendClockRuleInfo = {}
    wkOvWeekendClockRuleInfo.clock_on_time = params.onOvWeekendTime;
    wkOvWeekendClockRuleInfo.clock_off_time = params.offOvWeekendTime;
    wkOvWeekendClockRuleInfo.clock_type = 2;
    let onOvWeekendWkTimeRangeArr = timeRangeToTime(params.onOvWeekendTimeRange);
    wkOvWeekendClockRuleInfo.clock_on_min_time = onOvWeekendWkTimeRangeArr[0]
    wkOvWeekendClockRuleInfo.clock_on_max_time = onOvWeekendWkTimeRangeArr[1];
    let offOvWeekendWkTimeRangeArr = timeRangeToTime(params.offOvWeekendTimeRange);
    wkOvWeekendClockRuleInfo.clock_off_min_time = offOvWeekendWkTimeRangeArr[0];
    wkOvWeekendClockRuleInfo.clock_off_max_time = offOvWeekendWkTimeRangeArr[1];
    wkOvWeekendClockRuleInfo.clock_valid_week = params.ovWeekendWeekdays.join(",");
    wkOvWeekendClockRuleInfo.status = params.ovWeekendActive ? 0 : 1;
    wkOvWeekendClockRuleInfo.uid = userInfo.uid;
    console.log(params);
    console.log(wkClockRuleInfo, wkOvClockRuleInfo, wkOvWeekendClockRuleInfo);
    await mysql(CNF.DB_TABLE.clock_rule_info).select("*").where({uid: userInfo.uid}).then(async res => {
        if (res && res.length > 0) {
            let updateWkClockRuleInfo = null;
            let updateWkOvClockRuleInfo = null;
            let updateWkOvWeekendClockRuleInfo = null;
            res.forEach(function (item, i) {
                if (item.clock_type == 0) {
                    updateWkClockRuleInfo = item;
                } else if (item.clock_type == 1) {
                    updateWkOvClockRuleInfo = item;
                } else if (item.clock_type == 2) {
                    updateWkOvWeekendClockRuleInfo = item;
                }
            })
            if (updateWkClockRuleInfo) {
                await  mysql(CNF.DB_TABLE.clock_rule_info).update(wkClockRuleInfo).where("id", updateWkClockRuleInfo.id);
            } else {
                wkClockRuleInfo.id = uuidGenerator().replace(/-/g, '');
                await mysql(CNF.DB_TABLE.clock_rule_info).insert(wkClockRuleInfo);
            }
            if (updateWkOvClockRuleInfo) {
                await  mysql(CNF.DB_TABLE.clock_rule_info).update(wkOvClockRuleInfo).where("id", updateWkOvClockRuleInfo.id);
            } else {
                wkOvClockRuleInfo.id = uuidGenerator().replace(/-/g, '');
                await mysql(CNF.DB_TABLE.clock_rule_info).insert(wkOvClockRuleInfo);
            }
            if (updateWkOvWeekendClockRuleInfo) {
                await mysql(CNF.DB_TABLE.clock_rule_info).update(wkOvWeekendClockRuleInfo).where("id", updateWkOvWeekendClockRuleInfo.id);
            } else {
                wkOvWeekendClockRuleInfo.id = uuidGenerator().replace(/-/g, '');
                await mysql(CNF.DB_TABLE.clock_rule_info).insert(wkOvWeekendClockRuleInfo);
            }
            SUCCESS(ctx, "OK");
        } else {
            wkClockRuleInfo.id = uuidGenerator().replace(/-/g, '');
            wkOvClockRuleInfo.id = uuidGenerator().replace(/-/g, '');
            wkOvWeekendClockRuleInfo.id = uuidGenerator().replace(/-/g, '');
            await mysql(CNF.DB_TABLE.clock_rule_info).insert(wkClockRuleInfo);
            await mysql(CNF.DB_TABLE.clock_rule_info).insert(wkOvClockRuleInfo);
            await mysql(CNF.DB_TABLE.clock_rule_info).insert(wkOvWeekendClockRuleInfo);
            SUCCESS(ctx, "OK");
        }
    }).catch(e => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB}\n${e}`)
    });
}

function timeRangeToTime(timeArr) {
    let minTime = timeArr[0] + ":" + timeArr[1];
    let maxTime = timeArr[2] + ":" + timeArr[3];
    return [minTime, maxTime];
}

async function getClockRuleInfo(ctx, next) {
    let userInfo = ctx.state.$sysInfo.userinfo;
    await mysql(CNF.DB_TABLE.clock_rule_info).select("*").where({uid: userInfo.uid}).then(res => {
        let result = {
            workClockRuleInfo: {},
            overtimeWorkClockRuleInfo: {},
            overtimeWeekendClockRuleInfo: {},
        }
        if (res && res.length > 0) {
            res.forEach(function (item, i) {
                if (item.clock_type == 0) {
                    result.workClockRuleInfo = item;
                } else if (item.clock_type == 1) {
                    result.overtimeWorkClockRuleInfo = item;
                } else if (item.clock_type == 2) {
                    result.overtimeWeekendClockRuleInfo = item;
                }
            })
        }
        SUCCESS(ctx, result);
    })
}

module.exports = {save, get, getClockRuleRecord, saveClockRuleInfo, getClockRuleInfo}
