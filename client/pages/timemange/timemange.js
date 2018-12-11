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
        id: "ID000" + i,
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
    var type = e.currentTarget.dataset.type;
    var info = {};
    info.index = index;
    switch (type) {
      case 'diy':
        var plan = this.data.diyPlanList[index];
        info.id = plan.id
        info.title = plan.startDate + "~" + plan.endDate;
        info.content = plan.content;
        info.type = "diy";
        break;
      case 'day':
        var plan = this.data.dayPlanList[index];
        info.id = plan.id
        info.title = "";
        info.content = plan.content;
        info.type = "day";
        break;
      case 'week':
        var plan = this.data.weekPlanList[index];
        info.id = plan.id
        info.title = "";
        info.content = plan.content;
        info.type = "week";
        break;
      case 'month':
        var plan = this.data.monthPlanList[index];
        info.id = plan.id
        info.title = "";
        info.content = plan.content;
        info.type = "month";
        break;
    }
    this.msgModal.showModal(e, info);
  },
  confirmDelete: function(e) {
    console.log(e);
    console.log(this.msgModal.data.type, this.msgModal.data.id, this.msgModal.data.index);
    var type = this.msgModal.data.type;
    var index = this.msgModal.data.index;
    var id = this.msgModal.data.id;
    switch (type) {
      case 'diy':
        this.data.diyPlanList.splice(index, 1);
        this.setData({
          diyPlanList: this.data.diyPlanList
        })
        break;
      case 'day':
        this.data.dayPlanList.splice(index, 1);
        this.setData({
          dayPlanList: this.data.dayPlanList
        })
        break;
      case 'week':
        this.data.weekPlanList.splice(index, 1);
        this.setData({
          weekPlanList: this.data.weekPlanList
        })
        break;
      case 'month':
        this.data.monthPlanList.splice(this.msgModal.data.index, 1);
        this.setData({
          monthPlanList: this.data.monthPlanList
        })
        break;
    }
  }
})