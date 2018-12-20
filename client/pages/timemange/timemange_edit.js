// client/pages/timemange/timemange_edit.js
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: "",
    endDate: "",
    startDate: util.formatUnixTime(new Date(), 'Y-M-D')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var type = options.type;
    this.setData({
      type: type
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
  savePlan: function(e) {
    console.log(e.detail.value);
    var val = e.detail.value;
    //设置上一个页面值
    var pages = getCurrentPages();
    var previousPage = pages[pages.length - 2];
    if (previousPage.route == "pages/timemange/timemange") {
      switch (this.data.type) {
        case 'diy':
          previousPage.data.diyPlanList.push({
            content: val.content,
            id: Math.ceil(Math.random() * 100),
            startDate: val.startDate,
            endDate: val.endDate,
          })
          previousPage.setData({
            diyPlanList: previousPage.data.diyPlanList
          })
          break;
        case 'day':
          previousPage.data.dayPlanList.push({
            content: val.content,
            id: 998
          })
          previousPage.setData({
            dayPlanList: previousPage.data.dayPlanList
          })
          break;
        case 'week':
          previousPage.data.weekPlanList.push({
            content: val.content,
            id: Math.ceil(Math.random() * 100),
          })
          previousPage.setData({
            weekPlanList: previousPage.data.weekPlanList
          })
          break;
        case 'month':
          previousPage.data.monthPlanList.push({
            content: val.content,
            id: Math.ceil(Math.random() * 100),
          })
          previousPage.setData({
            monthPlanList: previousPage.data.monthPlanList
          })
          break;
      }
    }
    wx.navigateBack({
      delta: 1
    })
  },
  bindStartDateChange: function(e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  bindEndDateChange: function(e) {
    this.setData({
      endDate: e.detail.value
    })
  },
})