// components/searchbar/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    size: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    size: 14,
    searchResult: [],
    inputShowed: false,
    keyword: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showInput: function() {
      this.setData({
        inputShowed: true
      });
    },
    hideInput: function() {
      this.setData({
        keyword: "",
        inputShowed: false
      });
    },
    clearInput: function() {
      this.setData({
        keyword: ""
      });
    },
    inputblur: function(e) {
      this.triggerEvent("inputblur", {
        composed: true
      });
    },
    inputChange: function(e) {
      this.setData({
        keyword: e.detail.value
      });
      this.triggerEvent("inputChange", {
        composed: true
      });
    },
    inputConfirm: function(e) {
      this.setData({
        keyword: e.detail.value
      });
      this.triggerEvent("inputConfirm", {
        composed: true
      });
    }
  }
})