// client/pages/plan/plan_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    planInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var planNo = options.planNo;
    var planInfo = {
      planNo: "P0009",
      auther: "欧阳林",
      handler: "刘伟丽",
      level: Math.ceil(Math.random() * 3),
      status: 2,
      content:"Demo我的任务就是测试这个DEMO是不是可以如果可以就用这个模板来测试",
      estimateTime: 2,
      estimateTimeType: '天',
      estimateStartTime: '2018-11-12',
      estimateEndTime: '2018-12-02',
      actualStartTime: '2018-11-14',
      actualEndTime: '2018-12-01',
      remark:"remark我的任务就是测试"
    }
    this.setData({
      planInfo: planInfo
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