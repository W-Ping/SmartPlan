var util = require("../../utils/util");
const request = require("../../utils/request")
var config = require('../../config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authFlag: true,
    todayStepInfo: {},
    stepInfoList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    this.getWenRun();
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
  openSetting: function() {
    var that = this;
    //客户拒绝授权时
    wx.getSetting({
      success(res) {
        var statu = res.authSetting;
        if (!statu['scope.werun']) {
          wx.showModal({
            title: '是否授权微信运动',
            content: '需要获取您微信运动，请确认授权，否则无法查看您的运动步数',
            success(tip) {
              if (tip.confirm) {
                wx.openSetting({
                  success(data) {
                    if (data.authSetting["scope.werun"] === true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //授权成功之后
                      that.getWenRun();
                    }
                  }
                })
              }
            }
          })
        }
      }
    });
  },
  getWenRun: function() {
    var that = this;
    wx.getWeRunData({
      success(res) {
        if (res.errMsg == "getWeRunData:ok") {
          request.postReq(config.service.getUserWeRunInfo, {
            iv: res.iv,
            encryptedData: res.encryptedData
          }, res => {
            if (res.code == 1) {
              var wxStepInfoList = res.data.stepInfoList;
              var stepInfoList = [];
              for (var i = 0, j = wxStepInfoList.length - 1; i < wxStepInfoList.length; i++, j--) {
                var stepInfo = wxStepInfoList[i];
                stepInfo.timestamp = util.formatUnixTime(new Date(stepInfo.timestamp * 1000), 'Y年M月D日');
                stepInfoList[j] = stepInfo;
              }
              that.setData({
                authFlag: true,
                stepInfoList: stepInfoList,
                todayStepInfo: stepInfoList.length > 0 ? stepInfoList[0] : {}
              })
            }
          })
        }
      },
      fail() {
        console.log("用户拒绝授权");
        that.setData({
          authFlag: false
        })
      }
    })
  }
})