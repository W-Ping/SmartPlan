// pages/today/today_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskDetail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      planDetail: {
        level: '1级',
        conent: "我的任务就是测试这个DEMO是不是可以如果可以就用这个模板来测试",
        estimateStartTime: "2018年10年10日",
        estimateEndTime: "2018年11年16日",
        estimateTime: "1",
        estimateType: "天",
        startTime: "2018年11月10日",
        finishTime: "2018年11月16日",
        auther: "王大力",
        finisher: "邓林凌"
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

  }
})