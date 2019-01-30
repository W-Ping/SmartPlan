// client/pages/myself/myself.js
const app = getApp();
const request = require("../../utils/request.js")
const config = require('../../config');
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statPlanList: [],
    userInfo: {},
    noteRemindCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
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
    var that=this;
    request.getReq(config.service.getRemindNoteCount, "stat=1", result => {
      if (result.code == 1 && result.data.rmCount && result.data.rmCount > 0) {
        wx.setTabBarBadge({
          index: 2,
          success: function() {
            that.setData({
              noteRemindCount: result.data.rmCount
            })
          },
          text: result.data.rmCount + ""
        })
      }else{
        wx.removeTabBarBadge({
          index: 2,
          success:function(){
            that.setData({
              noteRemindCount: 0
            })
          }
        })
      }
    })
    request.postReq(config.service.getPlanInfoStat, {
      auth_type: [0, 1]
    }, res => {
      if (res.code == 1 && res.data) {
        res.data.forEach(function(item, i) {
          item.start_time = util.formatUnixTime(item.start_time, "Y.M.D");
          item.end_time = util.formatUnixTime(item.end_time, "Y.M.D");
        })
        var result = {};

        result['statPlanList'] = res.data;
        that.setData(result);
      }
    })
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
      url: 'setting?uid=' + this.data.userInfo.uid,
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
  navigatorStatPlan: function(e) {
    var pno = e.currentTarget.dataset.pno;
    wx.navigateTo({
      url: '../plan/plan_info_list?pNo=' + pno,
    })
  },
})