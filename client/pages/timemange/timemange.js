// client/pages/timemange/timemange.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    diyHidden: false,
    tdHidden: false,
    weekHidden: true,
    monthHidden: true,
    diyPlanList: [],
    dayPlanList: [],
    weekPlanList: [],
    monthPlanList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    for (var i = 0; i < 2; i++) {
      this.data.dayPlanList.push({
        id: i,
        content: "每天要做的事情" + i
      })
      this.data.diyPlanList.push({
        id: "ID000"+i,
        content: "自己定义要做的事情" + i,
        startDate: "2018." + (10 + i) + ".12",
        endDate: "2019.0" + (i + 1) + ".13",
      })
      this.data.weekPlanList.push({
        id: i,
        content: "每周要做的事情每周要做的事情每周要做的事情每周要做的事情每周要做的事情每周要做的事情" + i
      })
      this.data.monthPlanList.push({
        id: i,
        content: "每月要做的事情" + i
      })
    }
    this.setData({
      diyPlanList: this.data.diyPlanList,
      dayPlanList: this.data.dayPlanList,
      weekPlanList: this.data.weekPlanList,
      monthPlanList: this.data.monthPlanList,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.msgModal = this.selectComponent("#msgModal");
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
  navigatorToEdit: function(e) {
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: 'timemange_edit?type=' + type,
    })
  },
  openQuery: function(e) {
    var index = e.currentTarget.dataset.index;
    var diyPlan = this.data.diyPlanList[index];
    this.msgModal.showModal(e, {
      id: diyPlan.id,
      title: diyPlan.startDate + "~" + diyPlan.endDate,
      content: diyPlan.content,
      index: index
    });
  },
  confirmDelete: function(e) {
    console.log(e);
    console.log(this.msgModal.data.id, this.msgModal.data.index);
  }
})