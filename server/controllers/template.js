const WXCode = require('./wxcode')
const Plan = require('./plan')
const FormId = require('./formid')
const Notify = require('./notify')
const {WX_API, MESSAGE_TEMP} = require('../wxapi')
const {SUCCESS, FAILED, CNF, ERRORS_BIZ} = require("./constants")
const https = require('https');
const url = require('url');
const util = require('../tools/util')
let request = require('request');

/**
 * 提醒用户
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function notifyRemindTemplate(ctx, next) {
    let {pdNo, uid, status} = ctx.request.body;
    if ([pdNo, uid, status].every(v => !v)) {
        throw new Error("notify params is error")
    }
    let userInfo = ctx.state.$sysInfo.userinfo;
    await Notify.getNotifyRecordCountByUid(uid, pdNo).then(async notify => {
        console.log("notify", notify)
        if (notify.count == 0) {
            await  FormId.getFormIdByUid(uid).then(async formIdInfo => {
                if (formIdInfo && formIdInfo.formId && formIdInfo.openId) {
                    await WXCode.getAccessToken(async accessToken => {
                        await  http_request(url.parse(WX_API.getMessageTemplate + "?access_token=" + accessToken), {
                            "offset": 0,
                            "count": 5
                        }).then(async res => {
                            await  Plan.getNotifyPlan(pdNo, status).then(async res => {
                                await http_request(url.parse(WX_API.sendMessageTemplate + "?access_token=" + accessToken), assembleRemindTemplateData(res, formIdInfo, userInfo)).then(async res => {
                                    if (!res.response.errcode || res.response.errcode == 0) {
                                        await FormId.delFormIdByFromId(formIdInfo)
                                        await  Notify.saveNotifyRecord({
                                            bizNo: pdNo,
                                            bizType: 0,
                                            openId: formIdInfo.openId,
                                            uid: formIdInfo.uid,
                                            creator_uid: userInfo.uid,
                                            notify_type: 0,
                                        });
                                        SUCCESS(ctx, "提醒成功");
                                    } else {
                                        FAILED(ctx, "提醒失败");
                                    }
                                })
                            })
                        })
                    })
                } else {
                    FAILED(ctx, "提醒不可用");
                }
            })
        } else {
            FAILED(ctx, "已经提醒过了");
        }
    })
}

async function notifyUserTemplate(ctx, next) {
    let {pdNo, formId, status} = ctx.request.body;
    let userInfo = ctx.state.$sysInfo.userinfo;
    await wxcode.getAccessToken(async accessToken => {
        await  http_request(url.parse(WX_API.getMessageTemplate + "?access_token=" + accessToken), {
            "offset": 0,
            "count": 5
        }).then(async res => {
            await  plan.getNotifyPlan(pdNo, status).then(async res => {
                await http_request(url.parse(WX_API.sendMessageTemplate + "?access_token=" + accessToken), assembleRemindTemplateData(res, formId, userInfo)).then(res => {
                    if (!res.response.errcode || res.response.errcode == 0) {
                        SUCCESS(ctx, res);

                    } else {
                        FAILED(ctx, res.response.errmsg);
                    }
                })
            })
        })
    })
}

function http_request(url, post_data) {
    let options = {
        url: url,
        method: 'POST',
        // headers: {
        //     'Content-Type': 'application/json',
        //     'Content-Length': JSON.stringify(post_data).length,
        // },
        strictSSL: false,
        timeout: 1500,
        body: JSON.stringify(post_data)
    };
    return new Promise((resolve, reject) => {
        request(options, (err, res, body) => {
            resolve({response: body, error: err});
        })
    });
}

function assembleRemindTemplateData(res, formIdInfo, userInfo) {
    let _jsonData = {};
    _jsonData.touser = formIdInfo.openId;
    _jsonData.template_id = MESSAGE_TEMP.notifyRemindTemplate;
    _jsonData.form_id = formIdInfo.formId;
    _jsonData.page = "pages/discovery/discovery";
    let status = res.status == 0 ? '未开始' : res.status == 1 ? '执行中' : '完成';
    let endTime = util.formatUnixTime(res.plan_end_time, 'Y年M月D日');
    let title = userInfo.nickName + "提醒您不要忘记了您的小目标哦~~"
    let data = {};
    data.keyword1 = {"value": res.plan_detail_name};
    data.keyword2 = {"value": status};
    data.keyword3 = {"value": endTime};
    data.keyword4 = {"value": res.creator_name};
    data.keyword5 = {"value": title};
    _jsonData.data = data;
    _jsonData.emphasis_keyword = "keyword1.DATA";
    return _jsonData;

}

module.exports = {
    notifyRemindTemplate,
    notifyUserTemplate
}