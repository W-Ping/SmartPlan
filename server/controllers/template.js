const wxcode = require('./wxcode')
const plan = require('./plan')
const {WX_API, MESSAGE_TEMP} = require('../wxapi')
const {SUCCESS, FAILED, CNF, ERRORS_BIZ} = require("./constants")
const https = require('https');
const url = require('url');

/**
 *
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function notifyRemindTemplate(ctx, next) {
    let {pdNo, formId} = ctx.request.body;
    let userInfo = ctx.state.$sysInfo.userinfo;
    await wxcode.getAccessToken(async accessToken => {
        await  plan.getNotifyPlan(pdNo).then(async res => {
            await request(url.parse(WX_API.sendTemplate + "?access_token=" + accessToken), JSON.stringify(assembleData(res, accessToken, formId))).then(async res => {
                console.log("resData", res);
                SUCCESS(ctx, res);
            })
        })
    })
}

function request(url, post_data) {
    let options = Object.assign(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': post_data.length,
        }
    });
    return new Promise((resolve, reject) => {
        let req = https.request(options, (res) => {
            let resData = '';
            res.setEncoding("utf-8");
            res.on('data', data => {
                resData += data;
            });
            res.on('end', () => {
                resolve(resData);
            });
        });
        req.on('error', (e) => {
            console.error(e);
        });
        req.write(JSON.parse(post_data));   // 写入 post 请求的请求主体。
        req.end();
    }).catch(() => {
        return null;
    });
}

function assembleData(res, accessToken, formId) {
    let _jsonData = {};
    _jsonData.touser = res.open_id;
    _jsonData.template_id = MESSAGE_TEMP.notifyRemindTemplate;
    _jsonData.form_id = formId;
    _jsonData.page = "pages/discovery/discovery";
    let data = {};
    data.keyword1 = {"value": "测试数据一"};
    data.keyword2 = {"value": "测试数据二"};
    data.keyword3 = {"value": "测试数据三"};
    data.keyword4 = {"value": "测试数据四"};
    data.keyword5 = {"value": "测试数据五"};
    _jsonData.data = data;
    _jsonData.emphasis_keyword = "keyword1.DATA";
    console.log("assembleData", _jsonData)
    return _jsonData;

}

module.exports = {
    notifyRemindTemplate
}