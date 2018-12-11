// client/pages/myself/myself.js
const app = getApp();
var config = require('../../config');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statPlanList: [],
    userInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    for (var i = 0; i < 5; i++) {
      that.data.statPlanList.push({
        id: "ID" + i,
        statDay: '2018.01.01',
        addPlanCount: Math.ceil(Math.random() * 1000),
        startPlanCount: Math.ceil(Math.random() * 1000),
        finishPlanCount: Math.ceil(Math.random() * 2000)
      })
    }
    that.setData({
      statPlanList: that.data.statPlanList,
      userInfo: app.globalData.userInfo
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
  previewImage: function(e) {
    var url = app.globalData.userInfo.avatarUrl;
    wx.previewImage({
      urls: [url],
    })
  },
   navigatorToSetting: function(e) {
    wx.navigateTo({
      url: 'setting',
    })
  },
  navigatorToFriend: function(e) {
    wx.navigateTo({
      url: '../friend/friend',
    })
  },
  navigatorToTimeMange: function(e) {
    wx.navigateTo({
      url: '../timemange/timemange',
    })
  },
  // navigatorToSearch: function(e) {
  //   wx.navigateTo({
  //     url: '../search/search',
  //   })
  // },
  navigatorToNotepad: function(e) {
    wx.navigateTo({
      url: '../notepad/notepad',
    })
  },
  navigatorToSign: function(e) {
    wx.navigateTo({
      url: '../sign/sign',
    })
  },
  navigatorToStatistics: function(e) {
    wx.navigateTo({
      url: '../statistics/statistics',
    })
  },
})