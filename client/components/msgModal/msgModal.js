// components/msgModal/msgModal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: String,
    content: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    isHidden: true,
    delHidden: true,
    index: 0,
    id: "",
    title: "",
    content: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showModal: function(e, info) {
      console.log(info);
      this.setData({
        isHidden: false,
        delHidden: true,
        index: info.index,
        id: info.id,
        content: info.content,
        title: info.title,
      })
    },
    closeModal: function(e) {
      this.setData({
        isHidden: true
      })
      this.triggerEvent("closeModal", {
        composed: true
      });
    },
    _bindDelete: function(e) {
      this.setData({
        delHidden: !this.data.delHidden
      })
    },
    confirmDelete: function(e) {
      this.setData({
        isHidden: true
      })
      this.triggerEvent("confirmDelete", {
        composed: true
      });
    },
  }
})