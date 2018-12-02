// client/pages/plan/plan_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    isAssign: false,
    position: "static",
    textareaShow: true,
    levelIndex: 0,
    levelArray: ['1级别', '2级别', '3级别'],
    timeIndex: 0,
    timeArray: ['小时', '天', '周'],
    taskInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var opt = options.opt;
    var planNo = options.planNo || null;
    console.log(planNo);
    var barTitle = null;
    if (opt == 'add') {
      barTitle = '新建';
    } else {
      barTitle = '编辑';
      //TODO 查询计划明细
    }
    wx.setNavigationBarTitle({
      title: barTitle,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.selectable = this.selectComponent("#selectable");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
  selectHandler: function(e) {
    var items = [];
    var handlerUid = this.data.taskInfo.handlerUid || '';
    items.push({
      handlerUid: "U0001",
      handlerName: "我自己"
    })
    for (var i = 0; i < 10; i++) {
      items.push({
        handlerUid: "U00" + (i + 2),
        handlerName: "王丽丽" + (i + 2)
      })
    }
    this.setData({
      items: items,
    })
    this.selectable.showSelect(e);
  },
  levelChange: function(e) {
    console.log('picker发送选择改变，携带值为', e)
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      levelIndex: e.detail.value
    })
  },
  timeChange: function(e) {
    console.log('picker time 发送选择改变，携带值为', e.detail.value)
    this.setData({
      timeIndex: e.detail.value
    })
  },
  savTaskSubmit: function(e) {
    var taskInfo = e.detail.value;
    console.log('创建任务信息', taskInfo)
  },
  closeSelect: function(e) {
    console.log("关闭", e);
    this.setData({
      position: "static",
      textareaShow: true,
    })
  },
  confirmSelect: function(e) {
    var selectedItems = this.selectable.data.selectedItems;
    var selectedItem = selectedItems[0];
    console.log('选择经办人信息', selectedItem)
    this.data.taskInfo.handlerUid = selectedItem.handlerUid ? selectedItem.handlerUid : "";
    this.data.taskInfo.handlerName = selectedItem.handlerName ? selectedItem.handlerName : "";
    console.log('选择经办人信息', this.data.taskInfo)
    this.setData({
      taskInfo: this.data.taskInfo
    })
  },
  inputText: function(e) {
    var text = this.selectable.data.inputText;
    console.log("查询文字：", text);
    //TODO
  },
})