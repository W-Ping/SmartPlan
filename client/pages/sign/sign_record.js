// client/pages/sign/sign_record.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    sStartDate: '2018-12-01',
    sEndDate: '2018-12-31',
    clockdList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    for (var i = 0; i < 12; i++) {
      that.data.clockdList.push({
        id: "ID" + i,
        clockDate: '2018.12.10',
        startTime: '09:19',
        endTime: '19:40',
        clockType: 0,
        status: Math.ceil(Math.random() * 2), //0:未打卡;1：上班打卡;2:下班打卡
      })
    }
    this.setData({
      clockdList: this.data.clockdList
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
  swichTab: function(e) {
    var currentTab = e.currentTarget.dataset.currenttab;
    this.setData({
      currentTab: currentTab
    })
  },
  changeStartDate: function(e) {
    this.setData({
      sStartDate:e.detail.value
    })
  },
  changeEndDate: function(e) {
    this.setData({
      sEndDate: e.detail.value
    })
  },
})