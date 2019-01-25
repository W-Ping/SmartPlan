const {auth: {validation, getUserInfoBySKey}} = require('../qcloud')
const {getUserByOpenId} = require('../controllers/userinfo')
// const debug = require('debug')('koa-weapp-demo')
/**
 * 响应处理模块
 */
module.exports = async function (ctx, next) {
    try {
        console.log(ctx)
        // 调用下一个 middleware
        const {'x-wx-skey': skey} = ctx.req.headers
        if (skey !== null && skey !== undefined) {
            await  validation(ctx.req).then(async result => {
                if (result.userinfo && result.userinfo.openId) {
                    const open_id = result.userinfo.openId;
                    await getUserByOpenId(open_id).then(async res => {
                        if (res) {
                            result.userinfo['realName'] = res.realName ? res.realName : result.userinfo.nickName;
                            result.userinfo['uid'] = res.uid;
                        }
                    })
                    ctx.state.$sysInfo = result
                    await next();
                } else {
                    console.log("login is invalid")
                    let body = {}
                    body.message = 'login is invalid'
                    body.code = -2
                    body.data = 0
                    ctx.body = body;
                }
            })
        } else {
            await next();
        }
    } catch (e) {
        throw new Error("validationMiddleware【" + `${e}` + "】")
    }
}
