// client/pages/timemange/timemange.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    diyHidden: false,
    tdHidden: false,
    weeHidden: true,
    monthHidden: true,
    tdMustTodo: "每天体土地方法集体土地方法对付集体土地方法对付集体土地方法对付集体土地方法对付集体土地方法对付对付",
    tdEffortodo: "每天体土地方法集体土地方法对付集体土地方法对付集体土地方法对付集体土地方法对付集体土地方法对付对付",
    weekMustTodo: "每周体土地方法集体土地方法对付集体土地方法对付集体土地方法对付集体土地方法对付集体土地方法对付对付",
    weekEffortodo: "每周体土地方法集体土地方法对付集体土地方法对付集体土地方法对付集体土地方法对付集体土地方法对付对付",
    monthMustTodo: "每月体土地方法集体土地方法对付集体土地方法对付集体土地方法对付集体土地方法对付集体土地方法对付对付",
    monthEffortodo: "每月体土地方法集体土地方法对付集体土地方法对付集体土地方法对付集体土地方法对付集体土地方法对付对付",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  tdToChange: function(e) {
    this.setData({
      tdHidden: !this.data.tdHidden
    })
  },
  weekToChange: function(e) {
    this.setData({
      weekHidden: !this.data.weekHidden
    })
  },
  monthToChange: function(e) {
    this.setData({
      monthHidden: !this.data.monthHidden
    })
  },
  diyToChange: function(e) {
    this.setData({
      diyHidden: !this.data.diyHidden
    })
  },
})