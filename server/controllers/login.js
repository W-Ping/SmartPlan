const userInfo = require("./userinfo");
module.exports = async ctx => {
    // 通过 Koa 中间件进行登录之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    if (ctx.state.$wxInfo.loginState) {
        await  userInfo.updateWithLogin(ctx.state.$wxInfo.userinfo).then(res => {
            ctx.state.data = ctx.state.$wxInfo.userinfo
            ctx.state.data['time'] = Math.floor(Date.now() / 1000)
        });
    }
}
