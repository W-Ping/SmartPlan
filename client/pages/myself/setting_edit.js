// client/pages/myself/setting_edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',
    value: '',
    placeholder: "请填写",
    type: 'text',
    maxlength: 100,
    name: "name"

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var opt = options.opt;
    var value = options.v;
    var uid = options.uid;
    var placeholder = this.data.placeholder;
    var maxlength = this.data.maxlength;
    var name = this.data.name;
    var type = this.data.type;
    if (opt == 'mp') {
      name = "mobilePhone";
      placeholder = "请输入您的手机号码";
      maxlength = 11;
      type = "number";
    } else if (opt == 'em') {
      name = "email";
      placeholder = "请输入您的邮箱号码";
    } else if (opt == 'rn') {
      name = "realName";
      placeholder = "请输入您的真实姓名";
    }
    this.setData({
      opt: opt,
      name: name,
      type: type,
      placeholder: placeholder,
      value: value,
      uid: uid,
      maxlength: maxlength
    })
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
  updateUserinfo: function(e) {
    console.log("更新用户信息，类型", this.data.opt);
    console.log("更新用户信息，值", e.detail.value);
    var condition = e.detail.value;
    //TODO 更新
    //设置上一个页面值
    var pages = getCurrentPages();
    var previousPage = pages[pages.length - 2];
    if (previousPage.route == "pages/myself/setting") {
      var name = this.data.name;
      var userinfo = previousPage.data.userinfo;
      userinfo[name] = condition[name];
      previousPage.setData({
        userinfo: userinfo
      })
    }
    wx.navigateBack({
      delta: 1
    })
  }
})