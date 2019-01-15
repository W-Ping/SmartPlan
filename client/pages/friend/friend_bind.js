var app = new getApp();
const request = require("../../utils/request.js")
var config = require('../../config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    nickName: '',
    realName: '',
    bindUserInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("friend_bind", options)
    var bindUserInfo = app.globalData.bindUserInfo;
    console.log(bindUserInfo)
    request.getReq(config.service.getShareInfoByUid + "/" + options.uid, null, res => {
      if (res.code == 1 && res.data)
        var data = res.data;
      this.setData({
        avatarUrl: data.avatarUrl,
        realName: data.realName,
        nickName: data.nickName
      })
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
  onAgreeBind: function(e) {
    console.log("onAgreeBind..", app.globalData.bindUserInfo)
  }
})