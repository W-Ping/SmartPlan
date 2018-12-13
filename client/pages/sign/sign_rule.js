// client/pages/sign/sign_rule.js
const hours = [];
const minutes = [];
//获取小时
for (let i = 0; i < 24; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  hours.push("" + i);
}
//获取分钟
for (let i = 0; i < 60; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  minutes.push("" + i);
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    onOvTime: '18:30',
    offOvTime: '22:30',
    onWkTime: '09:30',
    offWkTime: '18:30',
    onWkRangeTime: '06:30~10:30',
    offWkRangeTime: '15:30~23:00',
    onOvRangeTime: '06:30~10:30',
    offOvRangeTime: '15:30~23:00',
    wkClockHidden: false,
    ovClockHidden: false,
    onWkRangeTimeIndex: [6, 30, 23, 0],
    offWkRangeTimeIndex: [16, 30, 23, 0],
    onOvRangeTimeIndex: [6, 30, 23, 0],
    offOvRangeTimeIndex: [16, 30, 23, 0],
    timeRange: [hours, minutes, hours, minutes],
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
  onReady: function() {},

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
  bindRangeChange: function(e) {
    var type = e.currentTarget.dataset.type;
    console.log(type);
    console.log(e.detail.value);
    var slected = e.detail.value;
    var timeRange = this.data.timeRange;
    var startH = timeRange[0][slected[0]];
    var startM = timeRange[1][slected[1]];
    var endH = timeRange[2][slected[2]];
    var endM = timeRange[3][slected[3]];
    var rangeTime = startH + ":" + startM + "~" + endH + ":" + endM;
    var changeData = {};
    switch (type) {
      case 'onWk':
        changeData.onWkRangeTime = rangeTime;
        break;
      case 'offWk':
        changeData.offWkRangeTime = rangeTime;
        break;
      case 'onOv':
        changeData.onOvRangeTime = rangeTime;
        break;
      case 'offOv':
        changeData.offOvRangeTime = rangeTime;
        break;
    }
    this.setData(changeData);
  },
  bindRangeColumnChange: function(e) {
    console.log(e.detail.value, e.detail.column)
  },
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