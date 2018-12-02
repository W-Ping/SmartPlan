// client/pages/myself/distribution_auth.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authUserList: [],
    uid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var uid = options.uid;
    var that = this;
    for (var i = 0; i < 5; i++) {
      that.data.authUserList.push({
        id: "ID" + i,
        uid: "U000" + Math.ceil(Math.random() * 1000),
        realName: '王里' + i,
        userLabel: '同事',
        distributionAuth: Math.ceil(Math.random() * 2)
      })
    }
    that.setData({
      authUserList: that.data.authUserList,
      uid: uid
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
  authOpt: function(e) {
    var authUid = e.currentTarget.dataset.uid;
    var distributionAuth = e.currentTarget.dataset.distributionauth;
    var title = "确定"
    if (distributionAuth == 1) {
      title += "授权?";
    } else {
      title += "停止授权?";
    }
    var uid = this.data.uid;
    wx.showModal({
      title: title,
      content: authUid,
      success:function(res){
        if(res.confirm){
          console.log(title+" success");
        }else{

        }
      }
    })
  }
})