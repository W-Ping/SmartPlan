const app = new getApp();
const request = require("../../utils/request.js")
const config = require('../../config')
const util = require('../../utils/util')
const qcloud = require('../../vendor/wafer2-client-sdk/index')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        avatarUrl: '',
        uid: '',
        nickName: '',
        realName: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log("friend_bind", options)
        request.getReq(config.service.getShareInfoByUid + "/" + options.uid, null, res => {
            if (res.code == 1 && res.data) {
                var data = res.data;
                this.setData({
                    uid: data.uid,
                    avatarUrl: data.avatarUrl ? data.avatarUrl : '',
                    realName: data.realName ? data.realName : '',
                    nickName: data.nickName ? data.nickName : ''
                })
            }
        })
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
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    onRefuse: function (e) {
        console.log("onRefuse..", this.data.uid, app.globalData.userInfo)
    },
    onAgree: function (e) {
        console.log("onAgree..", this.data.uid, app.globalData.userInfo)
        request.postReq(config.service.bindShareUser, {
            uid: app.globalData.userInfo.uid,
            relation_uid: this.data.uid,
        }, res => {
            if (res.code == 1) {
                util.showSuccess("添加成功")
                wx.reLaunch({
                    url: config.default_page
                })
            } else {
                util.showModel("添加失败", "");
            }
        })
    },
    bindGetUserInfo: function (callback) {
        const session = qcloud.Session.get()
        console.log("登录信息session", session)
        if (session) {
            qcloud.loginWithCode({
                success: res => {
                    app.globalData.userInfo = res;
                    app.globalData.logged = true;
                    if (typeof(callback) === "function")
                        callback(res)
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
            qcloud.login({
                success: res => {
                    app.globalData.userInfo = res;
                    app.globalData.logged = true;
                    res.frist
                    callback(res)
                },
                fail: err => {
                    console.error(err)
                    util.showModel('登录错误', err.message)
                }
            })
        }
    },
})