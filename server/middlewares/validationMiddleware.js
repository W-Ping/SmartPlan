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
                if (result.userinfo) {
                    const open_id = result.userinfo.openId;
                    await getUserByOpenId(open_id).then(async res => {
                        if (res) {
                            result.userinfo['realName'] = res.realName ? res.realName : result.userinfo.nickName;
                            result.userinfo['uid'] = res.uid;
                        }
                    })
                }
                ctx.state.$sysInfo = result

            })
        }
        await next()
    } catch (e) {
        console.log(e)
        throw new Error("validationMiddleware【" + `${e}`+"】")
    }
}
