// client/pages/friend/friend_detail.js

var app=new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friendInfo: {},
    hidden: true,
    mobilePhone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var planInfoList = [];
    for (var i = 0; i < 2; i++) {
      planInfoList.push({
        id: "ID" + i,
        planNo: "PLAN-" + i,
        auther: "欧阳林",
        level: Math.ceil(Math.random() * 3),
        status: 0,
        content: i + "我的任务就是测试这个DEMO是不是可以如果可以就用这个模板来测试",
      })
    }
    console.log(planInfoList);
    this.setData({
      friendInfo: {
        uid: "UID0002",
        nickName: "小布",
        userLabel: "同事",
        mobilePhone: '',
        avatarUrl: '../../images/default_avatar.png',
        planInfoList: planInfoList
      },

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
  previewImage:function(e){
    var url = app.globalData.userInfo.avatarUrl;
     wx.previewImage({
       urls: [url],
     })
  },
  focusPhone: function(e) {
    this.setData({
      hidden: false,
    })
  },
  blurPhone: function(e) {
    this.setData({
      hidden: true,
    })
  },
  inputPhone: function(e) {
    this.setData({
      mobilePhone: e.detail.value
    })
  },
  addFriendMobilePhone: function(e) {
    var mobilePhone = this.data.mobilePhone;
    var friendInfo = this.data.friendInfo;
    console.log("添加好友手机号码", mobilePhone, friendInfo.uid);
    friendInfo.mobilePhone = mobilePhone;
    //TODO 
    this.setData({
      friendInfo: friendInfo,
      hidden: true
    });
  },
  clickAddPhone: function(e) {
    console.log("点击添加好友手机号码");
    this.setData({
      hidden: !this.data.hidden
    })
  },
  callingMobilePhone: function(e) {
    var mobilePhone = e.currentTarget.dataset.mobilephone;
    console.log("拨打电话：", mobilePhone);
    wx.makePhoneCall({
      phoneNumber: mobilePhone,
      success: function() {
        console.log("拨打电话成功！", mobilePhone);
      },
      fail: function() {
        console.log("拨打电话失败！", mobilePhone);
      }
    })
  }
})