// client/pages/plan/plan_history_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    planCreateList: [],
    planFinishedList: [],
    date: '',
    currentTab: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var date = options.date;
    var planCreateList = [],
      planFinishedList = [];
    for (var i = 0; i < 6; i++) {
      planCreateList.push({
        id: i,
        content: "恶风鹅热热的反对风热人热热的反对风热人热热热热热的反对风热人热的反对风热人" + i,
        status: Math.ceil(Math.random() * 3),
      })
    }
    for (var i = 0; i < 6; i++) {
      planFinishedList.push({
        id: i,
        content: "恶风鹅热热热恶风鹅热热热热热的反对风热人热热的反对风热人" + i,
        status: Math.ceil(Math.random() * 3),
        author: "王易",
        handler: "欧阳林",
        createTime:"2018.12.12 18:28:32",
      })
    }
    this.setData({
      date: date,
      planFinishedList: planFinishedList,
      planCreateList: planCreateList,
    })
    wx.setNavigationBarTitle({
      title: date
    });
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
    var currenttab = e.currentTarget.dataset.currenttab;
    console.log(currenttab);
    this.setData({
      currentTab: currenttab
    })
  },
})