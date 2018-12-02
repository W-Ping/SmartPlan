// client/pages/plan/plan_list.js
let commonUtil = require('../../utils/commonUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    planList: [],
    startX: 0, //开始坐标
    startY: 0
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
    var that = this;
    for (var i = 0; i < 6; i++) {
      that.data.planList.push({
        id: "ID" + i,
        planNo: "PLAN-" + i,
        auther: "欧阳林",
        level: Math.ceil(Math.random() * 3),
        status: 0,
        content: i + "我的任务就是测试这个DEMO是不是可以如果可以就用这个模板来测试",
        isTouchMove: false //默认隐藏删除
      })
    }
    that.setData({
      planList: that.data.planList
    })
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

  touchstart: function(e) {
    console.log("touch start....");
    //开始触摸时 重置所有删除
    this.data.planList.forEach(function(v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      planList: this.data.planList

    })
  },
  touchmove: function(e) {
    console.log("touch move....");
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });
    that.data.planList.forEach(function(v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      console.log("angle:", Math.abs(angle))
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) { //右滑
          v.isTouchMove = false
        } else { //左滑
          v.isTouchMove = true
        }
      }
    })
    console.log(that.data.planList);
    console.log("touchMoveX:" + touchMoveX + "--touchMoveY:" + touchMoveY);
    console.log("startX:" + that.data.startX + "--startY:" + that.data.startY);
    //更新数据
    that.setData({
      planList: that.data.planList
    })
  },
  touchend: function(e) {
    console.log("touch end....");
  },
  angle: function(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  deletePlan: function(e) {
    var index = e.currentTarget.dataset.index;
    var planNo = e.currentTarget.dataset.planno;
    wx.showModal({
      title: '确认删除？',
      content: planNo,
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  topPlan: function(e) {
    var index = e.currentTarget.dataset.index;
    var planNo = e.currentTarget.dataset.planno;
    var planList = this.data.planList;
    planList = commonUtil.toArrayTop(planList, index);
    this.setData({
      planList: planList
    })
  },

})