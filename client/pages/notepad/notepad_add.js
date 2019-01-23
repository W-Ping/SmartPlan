// client/pages/notepad/notepad_add.js
const request = require("../../utils/request")
const config = require('../../config')
const util = require('../../utils/util')
const date = new Date()
const years = []
const months = []
const days = []
for (var i = date.getFullYear(); i <= 2030; i++) {
  years.push(i)
}

for (var i = date.getMonth() + 1; i <= 12; i++) {
  months.push(i)
}

for (var i = date.getDate(); i <= util.getMonthDays(); i++) {
  days.push(i)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    years: years,
    year: date.getFullYear(),
    months: months,
    month: date.getMonth(),
    days: days,
    day: date.getDate(),
    value: [0, 0, 0],
    noteRemindHidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

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
  submitNote: function(e) {
    var noteInfo = e.detail.value;
    if (noteInfo.note_title) {

    }
    if (!this.data.noteRemindHidden) {
      noteInfo.status = 1;
      noteInfo.remind_time = this.data.year + "-" + util.formatNumber(this.data.month <= 0 ? 1 : this.data.month) + "-" + util.formatNumber(this.data.day)
    } else {
      noteInfo.status = 0;
    }
    request.postReq(config.service.saveNoteInfo, noteInfo, res => {
      if (res.code == 1) {
        wx.navigateBack({
          delta: 1
        })
      }
    })
    // var pages = getCurrentPages();
    // var previousPage = pages[pages.length - 2];
    // if (previousPage.route == "pages/notepad/notepad") {
    //     previousPage.data.notpadList.unshift({
    //         content: val.content,
    //         title: val.title,
    //         createDate: util.formatUnixTime(new Date(), 'Y年M月D日'),
    //         id: Math.ceil(Math.random() * 100)
    //     })
    //     previousPage.setData({
    //         notpadList: previousPage.data.notpadList
    //     })
    // }

  },
  switchRemindChange: function(e) {
    this.setData({
      noteRemindHidden: !this.data.noteRemindHidden
    })
  },
  changeRemindTime: function(e) {
    var val = e.detail.value
    console.log(val);
    var changeItem = {};
    var selectYear = this.data.years[val[0]];
    var selectMonth = this.data.months[val[1]];
    var selectDay = this.data.days[val[2]];
    changeItem.year = selectYear;
    changeItem.month = selectMonth;
    changeItem.day = selectDay;
    if (this.data.year != selectYear) {
      var months = [];
      var startMonth = 1
      if (selectYear == date.getFullYear()) {
        startMonth = date.getMonth() + 1;
      }
      for (var i = startMonth; i <= 12; i++) {
        months.push(i)
      }
      changeItem.months = months;
      var days = [];
      var startDate = 1;
      if (selectYear == date.getFullYear() && selectMonth == date.getMonth() + 1) {
        startDate = date.getDate();
      }
      for (var i = startDate; i <= util.getMonthDays(selectYear + '-' + selectMonth + '-01'); i++) {
        days.push(i)
      }
      changeItem.days = days;
    }
    if (this.data.month != selectMonth) {
      var days = [];
      var startDate = 1;
      if (selectYear == date.getFullYear() && selectMonth == date.getMonth() + 1) {
        startDate = date.getDate();
      }
      for (var i = startDate; i <= util.getMonthDays(selectYear + '-' + selectMonth + '-01'); i++) {
        days.push(i)
      }
      changeItem.days = days;
    }
    this.setData(changeItem)
  }
})