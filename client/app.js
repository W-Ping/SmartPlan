//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var util = require('./utils/util.js');
App({
    onLaunch: function (options) {
        var scene = decodeURIComponent(options.scene)
        if (scene == 1044) {
            console.log(options.shareTicket)
        }
        //获取手机信息
        var phoneInfo = wx.getSystemInfoSync();
        this.globalData.phoneInfo = phoneInfo;
        qcloud.setLoginUrl(config.service.loginUrl);
        //登录
        this.bindGetUserInfo();
    },
    // 用户登录示例
    bindGetUserInfo: function () {
        if (this.globalData.logged) return
        util.showBusy('正在登录')
        const session = qcloud.Session.get()
        console.log("登录信息session", session)
        if (session) {
            // 第二次登录
            // 或者本地已经有登录态
            // 可使用本函数更新登录态
            qcloud.loginWithCode({
                success: res => {
                    this.globalData.userInfo = res;
                    this.globalData.logged = true;
                    util.showSuccess('登录成功');
                    wx.reLaunch({
                        url: config.default_page,
                    })
                },
                fail: err => {
                    console.error(err)
                    util.showModel('登录错误', err.message)
                }
            })
        } else {
          console.log("首次登录。。。。")
            // 首次登录
            qcloud.login({
                success: res => {
                    this.globalData.userInfo = res;
                    this.globalData.logged = true;
                    util.showSuccess('登录成功');
                    wx.reLaunch({
                        url: config.default_page,
                    })
                },
                fail: err => {
                    console.error(err)
                    util.showModel('登录错误', err.message)
                }
            })
        }
    },
    globalData: {
        phoneInfo: {},
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: ''
    }
})