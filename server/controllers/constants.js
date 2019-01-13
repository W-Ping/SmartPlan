CNF = {
    DB_TABLE: {
        'user_info': 'user_info',
        'plan_info': 'plan_info',
        'plan_detail_info': 'plan_detail_info',
        'plan_user_ref_info': 'plan_user_ref_info',
    },
    OPT_STATE: {
        SUCCESS_CODE: 1,
        SUCCESS: 'success',  // 操作成功
        FAILED: 'failed',    // 操作失败
        FAILED_CODE: -1
    },
    UID_PREFIX: "U",
    PLAN_PREFIX: "P",
    PLAN_DETAIL_PREFIX: "PD",

},
    ERRORS_BIZ = {
        //数据库存错误
        DBERR: {
            BIZ_ERR_WHEN_INSERT_TO_DB: 'BIZ_ERR_WHEN_INSERT_TO_DB',
            BIZ_ERR_WHEN_UPDATE_TO_DB: 'BIZ_ERR_WHEN_UPDATE_TO_DB',
            BIZ_ERR_WHEN_SELECT_TO_DB: 'BIZ_ERR_WHEN_SELECT_TO_DB',
            BIZ_ERR_WHEN_DELETED_TO_DB: 'BIZ_ERR_WHEN_DELETED_TO_DB'
        }
    }

function SUCCESS(ctx, result) {
    // console.log('Success 结果：', result);
    const body = {}
    body.message = CNF.OPT_STATE.SUCCESS
    body.code = CNF.OPT_STATE.SUCCESS_CODE
    body.data = result !== undefined ? result : {}
    ctx.body = body
}

function FAILED(ctx, result) {
    console.log('Failed 结果：', result);
    const body = {}
    body.message = result != null && result != '' ? result : CNF.OPT_STATE.FAILED
    body.code = CNF.OPT_STATE.FAILED_CODE
    body.data = result !== undefined ? result : {}
    ctx.body = body
}

module.exports = {SUCCESS, FAILED, CNF, ERRORS_BIZ}
