//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
const request = require("./utils/request")
App({
    onLaunch: function (options) {
        console.log("onLaunch options ", options);
        if (options) {
            wx.getShareInfo({
                shareTicket: options.shareTicket,
                success: function (res) {
                    console.log(res);
                    request.postReq(config.service.getShareInfo, res, result => {
                        console.log("result=>", result);
                    })
                }
            })
        }
        //设置登录路径
        qcloud.setLoginUrl(config.service.loginUrl);
        //获取手机信息
        this.globalData.phoneInfo = wx.getSystemInfoSync();
        var scene = decodeURIComponent(options.scene)
        if (scene == 1044) {
            console.log(options.shareTicket)
        }
        const session = qcloud.Session.get();
        console.log("登录信息【onLaunch】session", session)
        if (session) {
            qcloud.loginWithCode({
                success: res => {
                    this.globalData.userInfo = res;
                    this.globalData.logged = true;
                    wx.reLaunch({
                        url: config.default_page,
                    })
                },
                fail: err => {
                    console.error(err)
                }
            })
        }
    },
    globalData: {
        phoneInfo: {},
        userInfo: {},
        logged: false,
    }
})