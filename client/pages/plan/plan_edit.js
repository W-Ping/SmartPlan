const request = require("../../utils/request")
const config = require('../../config')
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    planDetailInfo: {},
    planEndTime: util.nowDateAdd(),
    planStartTime: util.formatUnixTime(new Date(), 'Y-M-D'),
    maxTime: util.nowDateAdd(),
    minTime: util.formatUnixTime(new Date(), 'Y-M-D'),
    roleItems: [{
      name: '公开',
      value: 0,
      desc: '所有人可看',
      selected: true
    }, {
      name: '私密',
      value: 1,
      desc: '仅自己可看',
      selected: false
    }]
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
      var planInfo = this.data.planInfo;
      planInfo.id = "U0001";
      planInfo.level = 1;
      planInfo.handler = "王大雷";
      planInfo.handlerUid = "U0002";
      planInfo.estimateTime = 12;
      planInfo.estimateTimeType = 1;
      planInfo.remark = "宝贝宝贝";
      planInfo.content = "deom测热热热热热热热";
      this.setData({
        planInfo: planInfo,
        level: planInfo.level,
        estimateTimeType: planInfo.estimateTimeType,
      })
    }

    wx.setNavigationBarTitle({
      title: barTitle,
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
  onSelectRole: function(e) {
    var index = e.currentTarget.dataset.index;
    var roleItems = this.data.roleItems;
    if (!roleItems[index].selected) {
      for (var i = 0; i < roleItems.length; i++) {
        if (i == index) {
          roleItems[i].selected = true;
        } else {
          roleItems[i].selected = false;
        }
      }
    }

    this.setData({
      roleItems: roleItems
    });
  },
  changePlanStartTime: function(e) {
    if (this.data.planEndTime < e.detail.value) {
      this.data.planEndTime = this.data.maxTime;
    }
    this.setData({
      planStartTime: e.detail.value,
      planEndTime: this.data.planEndTime
    })
  },
  changePlanEndTime: function(e) {
    this.setData({
      planEndTime: e.detail.value,
    })
  },
  savTaskSubmit: function (e) {
    var planDetailInfo = e.detail.value;
      request.postReq(config.service.savePlanDetailInfo,planDetailInfo,res=>{
          util.showSuccess("保存成功");
      })
  },  
})