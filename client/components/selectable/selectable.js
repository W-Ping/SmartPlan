// components/selectable.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  // externalClasses: ['selectable','selectable-box'],
  attached: function() {

  },
  /**
   * 组件的属性列表
   */
  properties: {
    items: Array,
    multiSelect: Boolean,
    name_key: String,
    value_key: String,
    image_key: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    animation: {},
    inputText: "",
    isHidden: true,
    multiSelect: false, //false:单选；true:多选
    items: [], //数据
    selectedItems: [], //选中的数据
    name_key: 'name',
    value_key: 'value',
    image_key: 'image'
  },
  detached: function() {},
  /**
   * 组件的方法列表
   */
  methods: {
    closeSelect(e) {
      this.setData({
        isHidden: !this.data.isHidden,
      })
      this.triggerEvent("closeSelect");
    },
    confirmSelect(e) {
      var checked = e.detail.value
      var index = e.currentTarget.dataset.index;
      var changed = {}
      var items = this.data.items;
      var selectedItems = this.data.selectedItems;
      var multiSelect = this.data.multiSelect
      for (var i = 0; i < items.length; i++) {
        if (index == i) {
          var currIndex = selectedItems.indexOf(items[i]);
          if (currIndex !== -1) {
            changed['items[' + i + '].checked'] = false;
            selectedItems.splice(currIndex, 1);
          } else {
            if (!multiSelect) { //单选
              selectedItems = [];
              changed['items[' + i + '].checked'] = true;
              selectedItems.push(items[i]);
            } else {
              changed['items[' + i + '].checked'] = true;
              selectedItems.push(items[i]);
            }
          }
        } else {
          if (!multiSelect) {
            changed['items[' + i + '].checked'] = false;
          }
        }
      }
      changed.selectedItems = selectedItems;
      changed.isHidden = !this.data.isHidden;
      this.setData(changed)
      this.triggerEvent("confirmSelect", {
        composed: true
      });
    },
    showSelect(e) {
      console.log(e);
      var items = this.data.items;
      // console.log("数据格式转换前", items)
      var name_key = this.data.name_key;
      var value_key = this.data.value_key;
      var image_key = this.data.image_key;
      if (items && items.length > 0) {
        //数据格式转换
        for (var i = 0; i < items.length; i++) {
          var item = items[i]
          item['name'] = item[name_key];
          item['value'] = item[value_key];
          item['image'] = item[image_key];

        }
        // console.log("数据格式转换后", selectItems)
      }
      //默认选中第一条
      items[0]['checked'] = true;
      this.data.selectedItems.push(items[0]);
      //加载动画
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease-in-out',
        delay: 0
      })
      this.animation = animation;
      animation.height('0').step();
      this.setData({
        isHidden: !this.data.isHidden,
        items: items,
        selectedItems: this.data.selectedItems,
        animation: this.animation.export()
      })
      setTimeout(function() {
        animation.height('300px').step()
        this.setData({
          animation: animation
        })
      }.bind(this), 200)
    },
    _bindinputText: function(e) {
      var value = e.detail.value;
      this.setData({
        inputText: value
      })
      this.triggerEvent("inputText", {
        composed: true
      });
    },
    _selectedItem: function(e) {
      // console.log(e);
      var checked = e.detail.value
      var index = e.currentTarget.dataset.index;
      var changed = {}
      var items = this.data.items;
      var selectedItems = this.data.selectedItems;
      var multiSelect = this.data.multiSelect
      for (var i = 0; i < items.length; i++) {
        if (index == i) {
          var currIndex = selectedItems.indexOf(items[i]);
          if (currIndex !== -1) {
            changed['items[' + i + '].checked'] = false;
            selectedItems.splice(currIndex, 1);
          } else {
            if (!multiSelect) { //单选
              selectedItems = [];
              changed['items[' + i + '].checked'] = true;
              selectedItems.push(items[i]);
            } else {
              changed['items[' + i + '].checked'] = true;
              selectedItems.push(items[i]);
            }
          }
        } else {
          if (!multiSelect) {
            changed['items[' + i + '].checked'] = false;
          }
        }
      }
      changed.selectedItems = selectedItems;
      this.setData(changed)
      this.triggerEvent("selected", {
        composed: true
      });
    }
  }
})