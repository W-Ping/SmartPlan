const {auth: {validation}} = require('../qcloud')
const {getUserByOpenId} = require('../controllers/userinfo')

/**
 * 响应处理模块
 */
module.exports = async function (ctx, next) {
    try {
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
        // catch 住全局的错误信息
        debug('Catch Error: %o', e)

        // 设置状态码为 200 - 服务端错误
        ctx.status = 200

        // 输出详细的错误信息
        ctx.body = {
            code: -1,
            error: e && e.message ? e.message : e.toString()
        }
    }
}
