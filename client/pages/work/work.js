// client/pages/work/work.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wkHidden: false, //工作打卡显示
    otHidden: false, //加班打卡显示
    normalOnWkTimeFlag: true,
    normalOffWkTimeFlag: true,
    normalOnOvTimeFlag: true,
    normalOffOvTimeFlag: true,
    onWkTime: "9:30",
    offWkTime: "18:30",
    onWkOverTime: "9:30",
    offWkOverTime: "18:30",
    onWkActualTime: "09:25",
    offWkActualTime: "19:30",
    onActualWkOverTime: "10:30",
    offWkActualOverTime: "20:30",
    today:"2018年12月09日（星期日）"
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
  workClock: function(e) {
    console.log("工作打卡")
  },
  overtimeClock: function(e) {
    console.log("加班打卡")
  }
})