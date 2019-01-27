const {WX_API} = require('../wxapi')
const https = require('https');
const url = require('url');
const assert = require('assert')

/**
 *  获取小程序二维码
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function createwxaqrcode(ctx, next) {
    let {p, w} = ctx.query;
    await getAccessToken(async function (res) {
        const post_data = JSON.stringify({
            path: p || 'pages/today/today',     // 最多32个字符。
            width: w || 430,     // 生成的小程序码宽度。
        });
        let req_url = url.parse(WX_API.createwxaqrcode + `?access_token=${res}`);
        await request(req_url, post_data, ctx);
    })
}


/**
 *  获取小程序码
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function getwxacodeunlimit(ctx, next) {
    let {p, w, uid} = ctx.query;
    assert.ok(uid, "uid is empty");
    await getAccessToken(async function (res) {
        assert.ok(res, "获取access_token失败");
        const post_data = JSON.stringify({
            scene: uid, // 最多32个字符。只支持数字，大小写英文以及部分特殊字!#$&'()*+,/:;=?@-._~ 不支持%
            width: w || 430,// 生成的小程序码宽度。
            path: p || 'pages/today/today',
            auto_color: false,
            line_color: {"r": 0, "g": 0, "b": 0},
            is_hyaline: false,
        });
        let req_url = url.parse(WX_API.getwxacodeunlimit + `?access_token=${res}`);
        await request(req_url, post_data, ctx);
    });
}

/**
 * 获取小程序码
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function getwxacode(ctx, next) {
    let {p, w} = ctx.query;
    await getAccessToken(async function (res) {
        assert.ok(res, "获取access_token失败");
        const post_data = JSON.stringify({
            path: p || 'page/today/today', // 扫码进入的小程序页面路径，最大长度 128 字节，不能为空
            width: w || 430,// 生成的小程序码宽度。
            auto_color: false,
            line_color: {"r": 0, "g": 0, "b": 0},
            is_hyaline: false//是否需要透明底色，为 true 时，生成透明底色的小程序码
        });
        let req_url = url.parse(WX_API.getwxacode + `?access_token=${res}`);
        await request(req_url, post_data, ctx);
    });
}

/**
 *  获取小程序 access_Token
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function getAccessToken(callback) {
    const S_TO_MS = 1000;  // 秒到毫秒的转换。
    if (!global.access_token || global.access_token.timestamp + global.access_token.expires_in * S_TO_MS <= new Date() - 300) {
        // 过期，获取新的 token
        const appid = 'wx1465f9a62bfea385';
        const appsecret = '7d68daf0fd22f23d280bfa17d09a9618';
        const accessTokenObj = await new Promise((resolve, reject) => {
            https.get(WX_API.getAccessToken + `&appid=${appid}&secret=${appsecret}`, res => {
                let resData = '';
                res.on('data', data => {
                    resData += data;
                });
                res.on('end', () => {
                    resolve(JSON.parse(resData));
                })
            })
        }).catch(e => {
            console.log(e);
        });
        // 这里应该加一个判断的，因为可能请求失败，返回另一个 JSON 对象。
        global.access_token = Object.assign(accessTokenObj, {timestamp: +new Date()});
    }
    const access_token = global.access_token.access_token;
    await callback(access_token)
}

/**
 *  请求微信API
 * @param url
 * @param post_data
 * @param ctx
 * @returns {Promise<void>}
 */
async function request(url, post_data, ctx) {
    let options = Object.assign(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': post_data.length,
        }
    });
    // 获取图片二进制流
    const {imgBuffer, contentType} = await new Promise((resolve, reject) => {
        let req = https.request(options, (res) => {
            let resData = '';
            res.setEncoding("binary");
            res.on('data', data => {
                resData += data;
            });
            res.on('end', () => {
                // 微信api可能返回json，也可能返回图片二进制流。这里要做个判断。
                const contentType = res.headers['content-type'];
                if (!contentType.includes('image')) {
                    console.log('获取小程序码图片失败，微信api返回的json为：')
                    console.log(JSON.parse(resData))
                    return resolve(null);
                }
                const imgBuffer = Buffer.from(resData, 'binary');
                resolve({imgBuffer, contentType});
            });
        });
        req.on('error', (e) => {
            console.error(e);
        });
        req.write(post_data);   // 写入 post 请求的请求主体。
        req.end();
    }).catch(() => {
        return null;
    });

    if (imgBuffer == null) {
        ctx.body = {code: 223, msg: '获取小程序码失败'};
        return;
    }
    ctx.res.setHeader('Content-type', contentType);
    ctx.body = imgBuffer;
}

module.exports = {createwxaqrcode,request, getwxacodeunlimit,getAccessToken,getwxacode}