const request = require("../../utils/request")
const config = require('../../config')
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    followUidList:[],
    followNames:'',
    planDetailInfo: {},
    planEndTime: '',
    planStartTime: '',
    maxTime: '',
    minTime: '',
    roleOpen:false,
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
    request.getReq(config.service.getLastPlanInfo, null, res => {
      console.log(res);
      if (res.code == 1 && res.data.plan_no) {
        var startTime = util.formatUnixTime(res.data.start_time, 'Y-M-D');
        var endTime = util.formatUnixTime(res.data.end_time, 'Y-M-D');
        this.data.planDetailInfo.plan_no = res.data.plan_no
        this.data.planStartTime = startTime;
        this.data.planEndTime = endTime;
        this.data.minTime = startTime;
        this.data.maxTime = endTime;
      } else {
        this.data.minTime = util.formatUnixTime(new Date(), 'Y-M-D');
        this.data.maxTime = util.nowDateAdd();
        this.data.planStartTime = this.data.minTime;
        this.data.planEndTime = this.data.maxTime;
      }
      this.setData({
        planDetailInfo: this.data.planDetailInfo,
        maxTime: this.data.maxTime,
        minTime: this.data.minTime,
        planStartTime: this.data.planStartTime,
        planEndTime: this.data.planEndTime,
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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
  submitPlanInfo: function(e) {
    var planDetailInfo = e.detail.value;
    planDetailInfo.followUidList = this.data.followUidList;
    request.postReq(config.service.savePlanDetailInfo, planDetailInfo, res => {
      if (res.code == 1) {
        wx.navigateTo({
          url: 'plan_info?pNo=' + res.data.plan_no,
        })
      }
    })
  },
  switchRoleBox:function(e){
    this.setData({
      roleOpen: !this.data.roleOpen
    })
  },
  navigatorToFollow:function(e){
    wx.navigateTo({
      url: '../friend/friend_handler',
    })
  }
})