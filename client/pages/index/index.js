// client/pages/index/index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config');
var util = require('../../utils/util');
const app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    logged: app.globalData.logged,
    takeSession: false,
    imageUrl: '',
    requestResult: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("index page onLoad", this.data.logged)
    var url = "http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1";
    this.getBiYingPhoto(url);
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
        console.log('错误信息是：' + error);
      }
    })
  },
  processBiYingPhoto: function (photoImageUrl) {
    var imageurl = 'http://www.bing.com' + photoImageUrl;
    console.log(imageurl);
    this.setData({
      imageUrl: imageurl
    });
  },
  unLoginGotUserInfo: function(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
    wx.reLaunch({
      url: config.default_page,
    })
  },
  loginGotUserInfo: function(e) {
    this.bindGetUserInfo();
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  bindGetUserInfo: function() {
    if (this.data.logged) return;
    util.showBusy('正在登录')
    const session = qcloud.Session.get()
    console.log("登录信息session", session)
    if (session) {
      qcloud.loginWithCode({
        success: res => {
          app.globalData.userInfo = res;
          app.globalData.logged = true;
          this.setData({ userInfo: res, logged: true })
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
          app.globalData.userInfo = res;
          app.globalData.logged = true;
          this.setData({ userInfo: res, logged: true })
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
  switchRequestMode: function(e) {
    this.setData({
      takeSession: e.detail.value
    })
    this.doRequest()
  },
  doRequest: function() {
    util.showBusy('请求中...')
    var that = this
    var options = {
      url: config.service.requestUrl,
      login: true,
      success(result) {
        util.showSuccess('请求成功完成')
        console.log('request success', result)
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
})