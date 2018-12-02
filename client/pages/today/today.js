// client/pages/today/today.js
let commonUtil = require('../../utils/commonUtil.js');
var sliderWidth = 96;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["待办中", "进行中", "已完成"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    todoPlanList: [],
    doingPlanList: [],
    finishPlanList: [],
    startX: 0, //开始坐标
    startY: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    for (var i = 0; i < 6; i++) {
      that.data.todoPlanList.push({
        id: "ID" + i,
        planNo: "PLAN-" + i,
        auther: "欧阳林",
        level: Math.ceil(Math.random() * 3),
        status: 0,
        content: i + "我的任务就是测试这个DEMO是不是可以如果可以就用这个模板来测试",
        isTouchMove: false //默认隐藏删除
      })
    }

    for (var i = 0; i < 4; i++) {
      that.data.doingPlanList.push({
        id: "ID" + i,
        planNo: "PLAN-" + i,
        progress: Math.ceil(Math.random() * 100),
        level: Math.ceil(Math.random() * 3),
        status: 1,
        content: i + "我的任务就是测试这个DEMO是不是可以如果可以就用这个模板来测试"
      })
    }
    for (var i = 0; i < 4; i++) {
      that.data.finishPlanList.push({
        id: "ID" + i,
        planNo: "PLAN-" + i,
        finisher: "欧阳林",
        quality: "正常", //‘提前’，'正常'；‘超时’；
        status: 2,
        content: i + "我的任务就是测试这个DEMO是不是可以如果可以就用这个模板来测试"
      })
    }
    that.setData({
      todoPlanList: that.data.todoPlanList,
      doingPlanList: that.data.doingPlanList,
      finishPlanList: that.data.finishPlanList,
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
  onShareAppMessage: function() {},
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  todoTouchstart: function(e) {
    console.log("todo touch start....");
    //开始触摸时 重置所有删除
    commonUtil.preTouchMoveBox(this.data.todoPlanList);
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      todoPlanList: this.data.todoPlanList
    })
  },
  todoTouchmove: function(e) {
    console.log("todo touch move....");
    var index = e.currentTarget.dataset.index, //当前索引
      startX = this.data.startX, //开始X坐标
      startY = this.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY; //滑动变化坐标
    commonUtil.touchMoveBox(this.data.todoPlanList, index, startX, startY, touchMoveX, touchMoveY);
    //更新数据
    this.setData({
      todoPlanList: this.data.todoPlanList
    })
  },
  todoTouchend: function (e) {
    console.log("todo touch end....");
  },
   doingTouchstart: function (e) {
    console.log("doing touch start....");
    //开始触摸时 重置所有删除
    commonUtil.preTouchMoveBox(this.data.doingPlanList);
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      doingPlanList: this.data.doingPlanList
    })
  },
  doingTouchmove: function (e) {
    console.log("doing touch move....");
    var index = e.currentTarget.dataset.index, //当前索引
      startX = this.data.startX, //开始X坐标
      startY = this.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY; //滑动变化坐标
    commonUtil.touchMoveBox(this.data.doingPlanList, index, startX, startY, touchMoveX, touchMoveY);
    //更新数据
    this.setData({
      doingPlanList: this.data.doingPlanList
    })
  },
  doingTouchend: function(e) {
    console.log("doing touch end....");
  },
  startPlan: function(e) {
    console.log("plan start ....");
    var index = e.currentTarget.dataset.index; //当前索引
    var planNo = e.currentTarget.dataset.planno;
  },
  deletePlan: function(e) {
    console.log("plan start ....");
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
    console.log("plan top ....");
    var index = e.currentTarget.dataset.index;
    var doingPlanList = this.data.doingPlanList;
    doingPlanList = commonUtil.toArrayTop(doingPlanList, index);
    this.setData({
      doingPlanList: doingPlanList
    })
  },
  addprogress: function(e) {
    console.log("add progress....");
    var index = e.currentTarget.dataset.index; //当前索引
    this.data.doingPlanList.forEach(function(v, i) {
      if (index == i) {
        var newProgress = v.progress + 10;
        if (newProgress >= 100) {
          newProgress = 100;
          //TODO 确认任务完成,从列表删除，更新任务状态
          wx.showModal({
            title: '确定完成',
            content: '确定已完成当前任务',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                console.log("当前任务进度2：", v.progress);
                v.progress = newProgress;
                console.log("新增务进度2：", v.progress);
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          v.progress = newProgress;
          //新增进度
        }
      }
    })
    this.setData({
      doingPlanList: this.data.doingPlanList
    })
  },
  //任务详情
  planDetail: function(e) {
    var status = e.currentTarget.dataset.status;
    var id = e.currentTarget.dataset.id;
    console.log("任务ID:" + id + ";任务状态:" + status)
    wx.navigateTo({
      url: 'today_detail',
    })
  }
})