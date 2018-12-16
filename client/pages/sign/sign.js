// client/pages/work/work.js
var util = require("../../utils/util.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wkHidden: false, //工作打卡显示
    otHidden: false, //加班打卡显示
    normalOnWkTimeFlag: 0, //0:未打卡 1：正常打卡 2：异常打卡
    normalOffWkTimeFlag: 0,
    normalOnOvTimeFlag: 0,
    normalOffOvTimeFlag: 0,
    onWkTime: "09:30",
    offWkTime: "18:30",
    onWkOvTime: "9:30",
    offWkOvTime: "18:30",
    onWkActualTime: "09:25",
    offWkActualTime: "19:30",
    onActualWkOverTime: "10:30",
    offWkActualOverTime: "20:30",
    weekDay: util.getWeek(),
    today: util.formatUnixTime(new Date(), 'Y年M月D日')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      normalOnWkTimeFlag: 0,
      normalOffWkTimeFlag: 0,
      normalOnOvTimeFlag: 0,
      normalOffOvTimeFlag: 0,
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
    console.log("工作打卡", util.getNowTime());
    var nowTime = util.getNowTime();
    var normalOnWkTimeFlag = this.data.normalOnWkTimeFlag;
    if (normalOnWkTimeFlag == 0) { //上班打卡
      var onWkTime = this.data.onWkTime;
      if (util.compareTime(onWkTime, nowTime)) {
        wx.vibrateLong();
        this.setData({
          onWkActualTime: nowTime,
          normalOnWkTimeFlag: 1
        })
      } else {
        util.showConfirm(null, "上班迟到打卡？", () => {
          wx.vibrateLong();
          this.setData({
            onWkActualTime: nowTime,
            normalOnWkTimeFlag: 2
          })
        })
      }
    } else { //下班打卡
      var normalOffWkTimeFlag = this.data.normalOffWkTimeFlag;
      var offWkTime = this.data.offWkTime;
      if (util.compareTime(nowTime, offWkTime)) {
        wx.vibrateLong();
        this.setData({
          offWkActualTime: nowTime,
          normalOffWkTimeFlag: 1
        })
      } else {
        util.showConfirm(null, "下班早退打卡？", () => {
          wx.vibrateLong();
          this.setData({
            offWkActualTime: nowTime,
            normalOffWkTimeFlag: 2
          })
        })
      }

    }

  },
  overtimeClock: function(e) {
    console.log("加班打卡", util.getNowTime());
    var nowTime = util.getNowTime();
    var normalOnOvTimeFlag = this.data.normalOnOvTimeFlag;
    if (normalOnOvTimeFlag == 0) { //上班打卡
      var onWkOvTime = this.data.onWkOvTime;
      if (util.compareTime(onWkOvTime, nowTime)) {
        wx.vibrateLong();
        this.setData({
          onActualWkOverTime: nowTime,
          normalOnOvTimeFlag: 1
        })
      } else {
        util.showConfirm(null, "加班迟到打卡？", () => {
          wx.vibrateLong();
          this.setData({
            onActualWkOverTime: nowTime,
            normalOnOvTimeFlag: 2
          })
        })
      }

    } else { //下班打卡
      var normalOffOvTimeFlag = this.data.normalOffOvTimeFlag;
      var offWkOvTime = this.data.offWkOvTime;
      if (util.compareTime(nowTime, offWkOvTime)) {
        wx.vibrateLong();
        this.setData({
          offWkActualOverTime: nowTime,
          normalOffOvTimeFlag: 1
        })
      } else {
        util.showConfirm(null, "加班早退打卡？", () => {
          wx.vibrateLong();
          this.setData({
            offWkActualOverTime: nowTime,
            normalOffOvTimeFlag: 2
          })
        })
      }

    }
  },
  navigateToRule: function() {
    wx.navigateTo({
      url: 'sign_rule',
    })
  },
  navigatorToRecord: function() {
    wx.navigateTo({
      url: 'sign_record',
    })
  },
})