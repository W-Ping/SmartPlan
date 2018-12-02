// client/pages/myself/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userinfo: {
        uid: 'UID00001',
        realName: "邓仙",
        gender: 0,
        birthday: '1993-06-28',
        mobilePhone: '138023133433',
        email: '434398845@qq.com',
        open: 0
      }
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
  changeGender: function(e) {
    var that = this;
    var userinfo = this.data.userinfo;
    wx.showActionSheet({
      itemList: ["女", "男"],
      success: function(res) {
        userinfo.gender = res.tapIndex;
        that.setData({
          userinfo: userinfo
        })
      }
    })
  },
  bindDateChange: function(e) {
    var userinfo = this.data.userinfo;
    userinfo.birthday = e.detail.value;
    this.setData({
      userinfo: userinfo
    })
  },
  switchDistributionChange: function(e) {
    console.log('switchDistributionChange 发生 change 事件，携带值为', e.detail.value);
    var openFlag = e.detail.value;
    var userinfo = this.data.userinfo;
    userinfo.distribution = openFlag == true ? 0 : 1;
    console.log(userinfo);
    this.setData({
      userinfo: userinfo,
    });
  },
  switchOpenChange: function(e) {
    console.log('switchOpenChange 发生 change 事件，携带值为', e.detail.value);
    var openFlag = e.detail.value;
    var userinfo = this.data.userinfo;
    userinfo.open = openFlag == true ? 0 : 1;
    console.log(userinfo);
    this.setData({
      userinfo: userinfo,
    });
  },
  navigatorToEdit: function(e) {
    console.log("编辑页面");
    var opt = e.currentTarget.dataset.opt;
    var value = e.currentTarget.dataset.value;
    var uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: 'setting_edit?opt=' + opt + '&uid=' + uid + '&v=' + value
    })
  },
  navigatorToRight: function(e) {
    var uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: 'setting_auth?uid=' + uid
    })
  }
})