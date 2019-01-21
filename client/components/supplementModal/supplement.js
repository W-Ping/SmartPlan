// components/searchbar/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    index: -1,
    onClockPic: true,
    offClockPic: true,
    modalShowed: true,
    selectedid: '',
    date: '',
    onClockTime: '',
    offClockTime: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onShow: function(params) {
      this.setData({
        modalShowed: false,
        index: params.index,
        id: params.id,
        date: params.date,
        onClockTime: params.onClockTime,
        offClockTime: params.offClockTime,
        onClockPic: params.onClockTime,
        offClockPic: params.offClockTime
      });
    },
    onCancel: function(e) {
      this.setData({
        modalShowed: true
      });
    },
    onConfirm: function(e) {
      this.triggerEvent("onConfirm");
    },
    onChangeClockOnWkTime: function(e) {
      this.setData({
        onClockTime: e.detail.value
      })
      // this.triggerEvent("onChangeClockOnWkTime");
    },
    onChangeClockOffWkTime: function(e) {
      this.setData({
        offClockTime: e.detail.value
      })
      // this.triggerEvent("onChangeClockOffWkTime");
    }
  }
})