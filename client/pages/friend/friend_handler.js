const request = require("../../utils/request")
const config = require('../../config')
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friendList: [],
    selectedList: [],
    maxSelectCount: 3, //-1忽略最大限制
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // var pages = getCurrentPages();
    // var previousPage = pages[pages.length - 2];
    // var followUidList = previousPage.data.followUidList
    // var that = this;
    // for (var i = 0; i < 22; i++) {
    //     that.data.friendList.push({
    //         id: "ID" + i,
    //         uid: "UID" + i,
    //         avatarUrl: '../../images/default_avatar.png',
    //         nickName: "小布小布" + i,
    //         realName: "王宇",
    //         userLabel: "朋友",
    //         status: 0,
    //         content: i + "我的任务就是测试这个DEMO是不是可以如果可以就用这个模板来测试",
    //         selected: false //默认隐藏删除
    //     })
    // }
    request.postReq(config.service.getRelationUserList, {
      status: 0
    }, res => {
      if (res.code == 1 && res.data.length > 0) {
        let friendList = [];
        res.data.forEach(function(item, i) {
          item.selected = false //默认隐藏删除
          friendList.push(item);
        })
        this.setData({
          friendList: friendList,
        })
      }
    })

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
  selecedFdItem: function(e) {
    var index = e.currentTarget.dataset.index;
    var uid = e.currentTarget.dataset.uid;
    var friendList = this.data.friendList;
    var selectedList = this.data.selectedList;
    var selected = friendList[index].selected;
    if (this.data.maxSelectCount != -1 && selectedList.length == this.data.maxSelectCount && !selected) {
      util.showModel("不可再选", "最多只能选" + this.data.maxSelectCount + "个好友监督")
    } else {
      friendList[index].selected = !selected
      selectedList = [];
      var count = 0;
      for (var i = 0; i < friendList.length; i++) {

        if (friendList[i].selected && (this.data.maxSelectCount == -1 || this.data.maxSelectCount > count)) {
          selectedList.push(friendList[i]);
          count++;
        }
      }
      if (selectedList.length <= this.data.maxSelectCount || this.data.maxSelectCount == -1) {
        this.setData({
          selectedId: index,
          friendList: friendList,
          selectedList: selectedList
        })
      }
    }
  },
  selecedFdConfirm: function(e) {
    var selectedList = this.data.selectedList;
    if (selectedList.length >= 1) {
      var followNames = "";
      var followUidList = [];
      selectedList.forEach(function(v, i) {
        followNames += (v.nickName + ",");
        followUidList.push(v.uid);
      })
      var pages = getCurrentPages();
      var previousPage = pages[pages.length - 2];
      if (previousPage.route == "pages/plan/plan_detail_add" || previousPage.route == "pages/plan/plan_detail_edit") {
        previousPage.setData({
          followNames: followNames.substring(0, followNames.lastIndexOf(",")),
          followUidList: followUidList
        })
      }
    } else {
      wx.showToast({
        icon: 'none',
        title: this.data.friendList.length <= 0 ? '您还没有好友~~~' : '请选择您的监督人~~~',
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