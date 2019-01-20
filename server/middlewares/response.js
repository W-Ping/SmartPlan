const debug = require('debug')('koa-weapp-demo')
const moment = require('moment')
/**
 * 响应处理模块
 */
module.exports = async function (ctx, next) {
    try {
        // 调用下一个 middleware
        await next()

        // 处理响应结果
        // 如果直接写入在 body 中，则不作处理
        // 如果写在 ctx.body 为空，则使用 state 作为响应
        if (ctx.body) {
            if (ctx.body.data) {
                responseTransform(ctx.body.data);
            }
        } else {
            ctx.body = {
                code: ctx.state.code !== undefined ? ctx.state.code : 0,
                data: ctx.state.data !== undefined ? ctx.state.data : {}
            }
        }
        // ctx.body = ctx.body ? ctx.body : {
        //     code: ctx.state.code !== undefined ? ctx.state.code : 0,
        //     data: ctx.state.data !== undefined ? ctx.state.data : {}
        // }
    } catch (e) {
        // catch 住全局的错误信息
        debug('Catch Error: %o', e)
        console.log(e);
        // 设置状态码为 200 - 服务端错误
        ctx.status = 200

        // 输出详细的错误信息
        ctx.body = {
            code: -1,
            error: e && e.message ? e.message : e.toString()
        }
    }

    function responseTransform(response) {
        Object.keys(response).map(key => {
            var val = response[key];
            if (null == val || undefined === val) {
                response[key] = "";
            } else if (val.constructor === Date) {
                val = moment(new Date(val)).format('YYYY-MM-DD HH:mm:ss')
                response[key] = val;
            } else if (val.constructor == Object) {
                responseTransform(val);
            } else if (val.constructor === Array) {
                val.forEach(v => {
                    responseTransform(v);
                })
            }
        })
    }
}
