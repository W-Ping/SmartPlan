const request = require("../../utils/request")
const config = require('../../config')
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    planInfo: {},
    planDetailInfoList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var planNo = options.pNo;
    request.getReq(config.service.getPlanInfo, "planNo=" + planNo, (res) => {
      if (res.code == 1) {
        var planInfo = res.data.planInfo;
        var planDetailInfoList = res.data.planDetailInfoList;
        planDetailInfoList.forEach(function (item, i) {
          item.plan_start_time = util.formatUnixTime(item.plan_start_time, "Y.M.D");
          item.plan_end_time = util.formatUnixTime(item.plan_end_time, "Y.M.D");
          item.plan_actual_end_time = util.formatUnixTime(item.plan_actual_end_time, "Y.M.D");
          item.plan_actual_start_time = util.formatUnixTime(item.plan_actual_start_time, "Y.M.D");
          item.status_desc = item.status == 0 ? '未启动' : item.status == 1 ? '执行中' : '已完成';
        })
        planInfo.start_time = util.formatUnixTime(planInfo.start_time, "Y.M.D");
        planInfo.end_time = util.formatUnixTime(planInfo.end_time, "Y.M.D");
        this.setData({
          planInfo: res.data.planInfo,
          planDetailInfoList: planDetailInfoList
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
  navigatorToDetail:function(e){
    var pdNo = e.currentTarget.dataset.pdno;
    wx.navigateTo({
      url: './plan_detail?pdNo=' + pdNo,
    })
  }
})