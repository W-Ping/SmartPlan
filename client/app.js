//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
// var util = require('./utils/util.js');
App({
    onLaunch: function (options) {
        console.log("onLaunch options ", options);
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
        userInfo:{},
        logged:false,
    }
})