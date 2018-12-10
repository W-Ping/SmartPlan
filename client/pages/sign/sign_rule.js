// client/pages/sign/sign_rule.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    onOvTime: '18:30',
    offOvTime: '22:30',
    onWkTime: '09:30',
    offWkTime: '18:30',
    wkClockHidden: false,
    ovClockHidden: false,
    wkCheckboxItems: [{
        name: '1',
        value: '星期一',
        checked: 'true'
      },
      {
        name: '2',
        value: '星期二',
        checked: 'true'
      },
      {
        name: '3',
        value: '星期三',
        checked: 'true'
      },
      {
        name: '4',
        value: '星期四',
        checked: 'true'
      },
      {
        name: '5',
        value: '星期五',
        checked: 'true'
      },
      {
        name: '6',
        value: '星期六'
      },
      {
        name: '0',
        value: '星期日'
      },
    ],
    ovCheckboxItems: [{
        name: '6',
        value: '星期六',
        checked: 'true'
      },
      {
        name: '0',
        value: '星期日',
        checked: 'true'
      },
      {
        name: '1',
        value: '星期一'
      },
      {
        name: '2',
        value: '星期二',
      },
      {
        name: '3',
        value: '星期三'
      },
      {
        name: '4',
        value: '星期四'
      },
      {
        name: '5',
        value: '星期五'
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  // checkboxChange: function (e) {
  //   var checked = e.detail.value
  //   var changed = {}
  //   for (var i = 0; i < this.data.checkboxItems.length; i++) {
  //     if (checked.indexOf(this.data.checkboxItems[i].name) !== -1) {
  //       changed['checkboxItems[' + i + '].checked'] = true
  //     } else {
  //       changed['checkboxItems[' + i + '].checked'] = false
  //     }
  //   }
  //   this.setData(changed)
  // },
  switchWkChange: function(e) {
    this.setData({
      wkClockHidden: !this.data.wkClockHidden
    })
  },
  switchOvChange: function(e) {
    this.setData({
      ovClockHidden: !this.data.ovClockHidden
    })
  },
  changeOnOvTime: function(e) {
    this.setData({
      onOvTime: e.detail.value
    })
  },
  changeOffOvTime: function(e) {
    this.setData({
      offOvTime: e.detail.value
    })
  },
  changeOnWkTime: function(e) {
    this.setData({
      onWkTime: e.detail.value
    })
  },
  changeOffWkTime: function(e) {
    this.setData({
      offWkTime: e.detail.value
    })
  },
  submitClock: function(e) {
    console.log("submitClock", e.detail.value)
  },
  ovCheckboxChange: function(e) {
    var checked = e.detail.value
    var changed = {}
    for (var i = 0; i < this.data.ovCheckboxItems.length; i++) {
      if (checked.indexOf(this.data.ovCheckboxItems[i].name) !== -1) {
        changed['ovCheckboxItems[' + i + '].checked'] = true
      } else {
        changed['ovCheckboxItems[' + i + '].checked'] = false
      }
    }
    this.setData(changed)
  },
  wkCheckboxChange: function(e) {
    var checked = e.detail.value
    var changed = {}
    for (var i = 0; i < this.data.wkCheckboxItems.length; i++) {
      if (checked.indexOf(this.data.wkCheckboxItems[i].name) !== -1) {
        changed['wkCheckboxItems[' + i + '].checked'] = true
      } else {
        changed['wkCheckboxItems[' + i + '].checked'] = false
      }
    }
    this.setData(changed)
  },
})