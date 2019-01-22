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
    loginFlag: false,
    relationFlag: 'N',
    realtionDesc: ["可以相互查看公开的小目标", "可以相互提醒各自目标进展"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("friend_bind", options)
    request.getReq(config.service.getShareInfoByUid + "/" + options.uid, null, res => {
      if (res.code == 1 && res.data) {
        var data = res.data;
        console.log("data", data);
        if (!data || !data.uid) {
          util.showModel("邀请失败", "邀请用户不存在");
          this.setData({
            loginFlag: true
          })
          return;
        }
        const session = qcloud.Session.get()
        if (session) {
          var userInfo = session.userinfo;
          request.getReq(config.service.checkUserRelation, "uid=" + userInfo.uid + "&refUid=" + options.uid, res => {
            this.setData({
              relationFlag: res.data
            })
          })
        }else{
          
        }
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  onRefuse: function(e) {
    console.log("onRefuse..", this.data.uid, app.globalData.userInfo)
    this.bindGetUserInfo(res => {
      wx.reLaunch({
        url: config.default_page,
      })
    });
  },
  onAgree: function(e) {
    console.log("onAgree..", this.data.uid, app.globalData.userInfo)
    this.bindGetUserInfo(result => {
      console.log("登录", result);
      request.postReq(config.service.bindShareUser, {
        uid: app.globalData.userInfo.uid,
        relation_uid: this.data.uid,
      }, res => {
        if (res.code == 1) {
          wx.reLaunch({
            url: config.default_page,
          })
        } else {
          util.showModel("添加失败", null);
        }
      })

    })
  },
  bindGetUserInfo: function(callback) {
    const session = qcloud.Session.get()
    console.log("登录信息session", session)
    if (session) {
      qcloud.loginWithCode({
        success: res => {
          app.globalData.userInfo = res;
          app.globalData.logged = true;
          if (typeof(callback) === "function") {
            callback(res)
          }
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
          if (typeof(callback) === "function") {
            callback(res)
          }
        },
        fail: err => {
          console.error(err)
          util.showModel('登录错误', err.message)
        }
      })
    }
  },
})