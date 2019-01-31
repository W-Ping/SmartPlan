// client/pages/index/index.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config');
const util = require('../../utils/util');
const app = new getApp();
const request = require("../../utils/request")
const bk_image = ["../../images/bk_0.jpg", "../../images/bk_1.jpg", "../../images/bk_3.svg"]
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        authUserFlag:true,
        logged: app.globalData.logged,
        takeSession: false,
        imageUrl: '',
        requestResult: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var bkIndex = Math.floor(Math.random() * bk_image.length);
        this.setData({
            imageUrl: bk_image[bkIndex],
        });
        // var that=this;
        // wx.getUserInfo({
        //     withCredentials: false,
        //     lang: 'zh_CN',
        //     success: function () {
        //         console.log("用户授权成功")
        //     },
        //     fail: function () {
        //         that.setData({
        //             authUserFlag:false
        //         })
        //         console.log("用户授权失败")
        //     }
        // })
        // var url = "http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1";
        // var url = "https://cn.bing.com/HPImageArchive.aspx?format=js&idx=1&n=1&pid=hp";
        // this.getBiYingPhoto(url);
    },
    getBiYingPhoto: function (url) {
        var that = this;
        wx.request({
            url: url,
            method: 'GET',
            header: {
                "Content-Type": "json"
            },
            success: function (res) {
                that.processBiYingPhoto(res.data.images[0].url);
            },
            fail: function (error) {
                console.log('错误信息是：', error);
            }
        })
    },
    processBiYingPhoto: function (photoImageUrl) {
        var imageurl = 'https://cn.bing.com' + photoImageUrl;
        console.log(imageurl);
        this.setData({
            imageUrl: imageurl
        });
    },
    unLoginGotUserInfo: function (e) {
        wx.reLaunch({
            url: config.default_page,
        })
    },
    loginGotUserInfo: function (e) {

        this.bindGetUserInfo();
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },


    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    bindGetUserInfo: function () {
        if (this.data.logged) return;
        util.showBusy('进入...')
        const session = qcloud.Session.get()
        if (session) {
            qcloud.loginWithCode({
                success: res => {
                    app.globalData.userInfo = res;
                    app.globalData.logged = true;
                    this.setData({
                        userInfo: res,
                        logged: true
                    })
                    request.getReq(config.service.getRemindNoteCount, "stat=1", result => {
                        if (result.code == 1 && result.data.rmCount && result.data.rmCount > 0) {
                            wx.setTabBarBadge({
                                index: 2,
                                text: result.data.rmCount + ""
                            })
                        }
                    })
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
                    app.globalData.userInfo = res;
                    app.globalData.logged = true;
                    this.setData({
                        userInfo: res,
                        logged: true
                    })
                    request.getReq(config.service.getRemindNoteCount, "stat=1", result => {
                        if (result.code == 1 && result.data.rmCount && result.data.rmCount > 0) {
                            wx.setTabBarBadge({
                                index: 2,
                                text: result.data.rmCount + ""
                            })
                        }
                    })
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
    // 切换是否带有登录态
    switchRequestMode: function (e) {
        this.setData({
            takeSession: e.detail.value
        })
        this.doRequest()
    },
    doRequest: function () {
        util.showBusy('请求中...')
        var that = this
        var options = {
            url: config.service.requestUrl,
            login: true,
            success(result) {
                util.showSuccess('请求成功完成')
                that.setData({
                    requestResult: JSON.stringify(result.data)
                })
            },
            fail(error) {
                util.showModel('请求失败', error);
                console.log('request fail', error);
            }
        }
        if (this.data.takeSession) { // 使用 qcloud.request 带登录态登录
            qcloud.request(options)
        } else { // 使用 wx.request 则不带登录态
            wx.request(options)
        }
    },
    openSetting: function () {
        var that = this;
        //客户拒绝授权时
        wx.getSetting({
            success(res) {
                var statu = res.authSetting;
              if (!statu['scope.userInfo']) {
                    wx.showModal({
                        title: '是否授权用户信息',
                        content: '需要获取您头像和昵称，否则创建小目标服务无法正常使用',
                        success(tip) {
                            if (tip.confirm) {
                                wx.openSetting({
                                    success(data) {
                                      console.log(data);
                                      if (data.authSetting["scope.userInfo"] === true) {
                                            wx.showToast({
                                                title: '授权成功',
                                                icon: 'success',
                                                duration: 1000
                                            })
                                          that.bindGetUserInfo();
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            }
        });
    },
})