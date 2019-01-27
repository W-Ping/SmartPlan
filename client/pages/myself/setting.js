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
    if (!options.uid){
      wx.hideToast();
      wx.showModal({
        title,
        content: '获取用户信息失败',
        showCancel: false
      })
    }
    request.getReq(config.service.getUserInfo, "uid=" + options.uid, res => {
      this.setData({
        userInfo: res.data
      })
    })
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
    var openFlag = e.detail.value;
    var userinfo = this.data.userinfo;
    userinfo.distribution = openFlag == true ? 0 : 1;
    console.log(userinfo);
    this.setData({
      userinfo: userinfo,
    });
  },
  switchOpenChange: function(e) {
    var openFlag = e.detail.value;
    var userinfo = this.data.userinfo;
    userinfo.open = openFlag == true ? 0 : 1;
    console.log(userinfo);
    this.setData({
      userinfo: userinfo,
    });
  },
  navigatorToEdit: function(e) {
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
      title: '更新中...',
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