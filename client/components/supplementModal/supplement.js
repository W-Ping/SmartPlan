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
    modalShowed: false,
    date:'',
    onClockTime: '',
    offClockTime: '',
    type: 0,
    typeName: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onShow: function() {
      this.setData({
        modalShowed: true
      });
    },
    onCancel: function(e) {
      this.setData({
        modalShowed: false
      });
    },
    onConfirm: function(e) {
      var selectedid = e.currentTarget.dataset.selectedid;
      this.setData({
        selectedId: selectedid
      })
      this.triggerEvent("onConfirm");
    }
  }
})