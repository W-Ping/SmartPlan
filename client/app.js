//app.js
const qcloud = require('./vendor/wafer2-client-sdk/index')
const config = require('./config')
const request = require("./utils/request")
App({
    onLaunch: function (options) {
        console.log("onLaunch options ", options);
        // var scene = decodeURIComponent(options.scene)
        var scene = options.scene;
        if (options && options.shareTicket) {
            wx.getShareInfo({
                shareTicket: options.shareTicket,
                success: function (res) {
                    console.log("shareTicket", options.shareTicket, "getShareInfo result", res);
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
        const session = qcloud.Session.get();
        console.log("登录信息【onLaunch】session", session)
        if (session) {
            qcloud.loginWithCode({
                success: res => {
                    this.globalData.userInfo = res;
                    this.globalData.logged = true;
                    console.log("scene", scene)
                    if (scene == 1044 || scene == 1007 || scene == 1036) {

                    }

                },
                fail: err => {
                    console.error(err)
                }
            })
        }else{
            wx.reLaunch({
                url: config.boot_page,
            })
        }
    },
    globalData: {
        phoneInfo: {},
        userInfo: {},
        logged: false,
        bindUserInfo: {}
    }
})