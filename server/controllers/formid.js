const {mysql} = require("../qcloud");
const debug = require('debug');
const {SUCCESS, FAILED, CNF, ERRORS_BIZ} = require("./constants")
const util = require('../tools/util')

async function saveOrUpdate(ctx, next) {
    let {formId} = ctx.request.body;
    let userInfo = ctx.state.$sysInfo.userinfo;
    let formIdInfo={};
    formIdInfo.formId=formId
    formIdInfo.uid=userInfo.uid;
    formIdInfo.openId=userInfo.openId;
    await mysql(CNF.DB_TABLE.user_formid_info).insert(formIdInfo).where('id', params.id).then(res => {
        SUCCESS(ctx, res);
    }).catch(e => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_INSERT_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_INSERT_TO_DB}\n${e}`)
    })
}

module.exports = {saveOrUpdate}