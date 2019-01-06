// client/pages/myself/setting.js
const request = require("../../utils/request.js")
const config = require("../../config.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    request.getReq(config.service.getUserInfo, "uid=" + options.uid, res => {
      this.setData({
        userInfo: res.data
      })
    })

    // this.setData({
    //   userInfo: {
    //     uid: 'UID00001',
    //     realName: "邓仙",
    //     gender: 0,
    //     birthday: '1993-06-28',
    //     mobilePhone: '138023133433',
    //     email: '434398845@qq.com',
    //     open: 0
    //   }
    // })
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
    var userInfo = this.data.userInfo;
    wx.showActionSheet({
      itemList: ["女", "男"],
      success: function(res) {
        userInfo.gender = res.tapIndex;
        request.postReq(config.service.updateUserInfo, {
          uid: userInfo.uid,
          gender: userInfo.gender
        }, res => {
          that.setData({
            userInfo: userInfo
          })
        })
      }
    })
  },
  bindDateChange: function(e) {
    var userInfo = this.data.userInfo;
    userInfo.birthday = e.detail.value;
    request.postReq(config.service.updateUserInfo, {
      uid: userInfo.uid,
      birthday: userInfo.birthday
    }, res => {
      this.setData({
        userInfo: userInfo
      })
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
      url: 'setting_edit?opt=' + opt + '&uid=' + uid + '&v=' + (value || "")
    })
  },
  navigatorToRight: function(e) {
    var uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: 'setting_auth?uid=' + uid
    })
  },
  refreshUserInfo: function(e) {
    var uid = e.currentTarget.dataset.uid;
    wx.showLoading({
      title: '更新中。。。',
    })
    var that=this;
    wx.getUserInfo({
      withCredentials: false,
      lang: 'zh_CN',
      success: function(res) {
        console.log(res);
        if (res && res.errMsg =="getUserInfo:ok"){
          var wxUserInfo=res.userInfo;
        }
        request.postReq(config.service.updateUserInfo, {
          uid: uid,
          nickName: wxUserInfo.nickName,
          avatarUrl: wxUserInfo.avatarUrl
        }, res => {
          that.data.userInfo.nickName = wxUserInfo.nickName;
          that.data.userInfo.avatarUrl = wxUserInfo.avatarUrl;
          that.setData({
            userInfo: that.data.userInfo
          })
        })
      },
      fail: function(res) {

      },
      complete: function(res) {
        wx.hideLoading();
      }
    })
  }
})