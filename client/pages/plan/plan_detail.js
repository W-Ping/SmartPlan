// client/pages/plan/plan_detail.js

const request = require("../../utils/request")
const config = require('../../config')
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    planDetailInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var pdNo = options.pdNo;
    request.getReq(config.service.getPlanDetailInfo, "pdNo=" + pdNo, res => {
      if (res.code == 1) {
        var planDetailInfo = res.data;
        planDetailInfo.plan_start_time = util.formatUnixTime(planDetailInfo.plan_start_time, "Y.M.D");
        planDetailInfo.plan_end_time = util.formatUnixTime(planDetailInfo.plan_end_time, "Y.M.D");
        planDetailInfo.plan_actual_start_time = util.formatUnixTime(planDetailInfo.plan_actual_start_time, "Y.M.D");
        planDetailInfo.plan_actual_end_time = util.formatUnixTime(planDetailInfo.plan_actual_end_time, "Y.M.D");
        this.setData({
          planDetailInfo: planDetailInfo
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

  }
})