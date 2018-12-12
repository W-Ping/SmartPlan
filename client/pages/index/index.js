// client/pages/index/index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config');
var util = require('../../utils/util.js');
const app=new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(app.globalData.userInfo);
    // this.bindGetUserInfo();
    // console.log("登录状态", this.data.logged);
  },
  onGotUserInfo: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
    wx.reLaunch({
      url: config.default_page,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

    this.setData({
      logged: app.globalData.logged
    })
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
  // 用户登录示例
  bindGetUserInfo: function() {
    if (this.data.logged) return
    var that=this;
    util.showBusy('正在登录')
    const session = qcloud.Session.get()
    if (session) {
      // 第二次登录
      // 或者本地已经有登录态
      // 可使用本函数更新登录态
      qcloud.loginWithCode({
        success: res => {
          that.setData({
            userInfo: res,
            logged: true
          })
          util.showSuccess('登录成功')

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
      // 首次登录
      qcloud.login({
        success: res => {
          that.setData({
            userInfo: res,
            logged: true
          })
          util.showSuccess('登录成功')
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