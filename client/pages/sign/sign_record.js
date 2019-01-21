const util = require("../../utils/util");
const request = require("../../utils/request")
const config = require('../../config')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentTab: 0,
        sStartDate: util.monthFirstDay(),
        sEndDate: util.monthLastDay(),
        clockdList: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        util.showBusy("查询...")
        request.postReq(config.service.getClockRuleRecord, {
            startTime: this.data.sStartDate,
            endTime: this.data.sEndDate,
            clock_type: this.data.currentTab
        }, res => {
            if (res.code == 1) {
                this.setData({
                    clockdList: res.data
                })
            }
        }, null, function () {
            wx.hideToast();
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
      this.clockModal = this.selectComponent("#clockModal");
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    swichTab: function (e) {
        var currentTab = e.currentTarget.dataset.currenttab;
        this.setData({
            currentTab: currentTab
        })
        util.showBusy("查询...")
        request.postReq(config.service.getClockRuleRecord, {
            startTime: this.data.sStartDate,
            endTime: this.data.sEndDate,
            clock_type: currentTab
        }, res => {
            if (res.code == 1) {
                this.setData({
                    clockdList: res.data
                })
            }
        }, null, function () {
            wx.hideToast();
        })
    },
    changeStartDate: function (e) {
        this.setData({
            sStartDate: e.detail.value
        })
    },
    changeEndDate: function (e) {
        this.setData({
            sEndDate: e.detail.value
        })
    },
    onSearch: function (e) {
        util.showBusy("查询...")
        request.postReq(config.service.getClockRuleRecord, {
            startTime: this.data.sStartDate,
            endTime: this.data.sEndDate,
            clock_type: this.data.currentTab
        }, res => {
            if (res.code == 1) {
                this.setData({
                    clockdList: res.data
                })
            }
        }, null, function () {
            wx.hideToast();
        })
    },
  onClock:function(e){
    var index = e.currentTarget.dataset.index;
    var clockInfo = this.data.clockdList[index];
    var info = {};
    info.date = clockInfo.date_version;
    info.onClockTime = clockInfo.clock_on_time;
    info.offClockTime = clockInfo.clock_off_time;
    this.clockModal.onShow(e, info);
  }
})