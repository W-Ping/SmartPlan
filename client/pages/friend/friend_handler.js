// client/pages/friend/friend_handler.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedId: -1,
    friendList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    for (var i = 0; i < 22; i++) {
      that.data.friendList.push({
        id: "ID" + i,
        uid: "UID" + i,
        avatarUrl: '../../images/default_avatar.png',
        nickName: "小布",
        realName: "王宇",
        userLabel: "朋友",
        status: 0,
        content: i + "我的任务就是测试这个DEMO是不是可以如果可以就用这个模板来测试",
        selected: false //默认隐藏删除
      })
    }
    that.setData({
      friendList: that.data.friendList,
      userInfo: app.globalData.userInfo,
      windowHeight: app.globalData.phoneInfo.windowHeight
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
  selecedFdItem: function(e) {
    var index = e.currentTarget.dataset.index;
    var uid = e.currentTarget.dataset.uid;
    var friendList = this.data.friendList;
    for (var i = 0; i < friendList.length; i++) {
      if (i == index) {
        friendList[i].selected = true;
      } else {
        friendList[i].selected = false;
      }
    }
    this.setData({
      selectedId: index,
      friendList: friendList
    })
  },
  selecedFdConfirm: function(e) {
    var selectedId = this.data.selectedId;
    if (selectedId != -1) {
      var selectedItem = this.data.friendList[selectedId];
      var pages = getCurrentPages();
      var previousPage = pages[pages.length - 2];
      if (previousPage.route == "pages/plan/plan_edit") {
        var planInfo = previousPage.data.planInfo;
        planInfo.handlerUid = selectedItem.uid;
        planInfo.handler = selectedItem.nickName;
        previousPage.setData({
          planInfo: planInfo
        })
      }
    } else {
      wx.showToast({
        icon: 'none',
        title: '请选择经办人',
      })
      return;
    }
    this.selecedFdCancel();
  },
  selecedFdCancel: function() {
    wx.navigateBack({
      delta: 1
    })
  },
})