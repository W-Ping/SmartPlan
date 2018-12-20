// client/pages/notepad/notepad.js
var config = require('../../config');
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notpadList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    for (var i = 0; i < 3; i++) {
      that.data.notpadList.push({
        id: "ID" + i,
        title: "Demo" + i,
        createDate: util.formatUnixTime(new Date(), 'Y年M月D日'),
        content: i + "我的任务就是测试这个DEMO是不是可以如果可以就用这个模板来测试",
      })
    }
    that.setData({
      notpadList: that.data.notpadList
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
  navigateToAdd: function(e) {
    wx.navigateTo({
      url: 'notepad_add',
    })
  },
  openMsgModal: function(e) {
    var index = e.currentTarget.dataset.index;
    console.log(index);
    var notepad = this.data.notpadList[index];
    console.log(notepad);
    var info = {};
    info.index = index;
    info.id = notepad.id;
    info.title = notepad.title;
    info.content = notepad.content;
    this.msgModal.showModal(e, info);
  },
  confirmDelete: function(e) {
    var index = this.msgModal.data.index;
    var id = this.msgModal.data.id;
    this.data.notpadList.splice(this.msgModal.data.index, 1);
    this.setData({
      notpadList: this.data.notpadList
    })
  },
})