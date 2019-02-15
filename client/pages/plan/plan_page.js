// client/pages/plan/plan_page.js
const sliderWidth = 96;
const request = require("../../utils/request")
const config = require('../../config')
const util = require('../../utils/util')
const commonUtil = require('../../utils/commonUtil.js');
const app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["待办", "进行中", "完成"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    planNo: -1,
    startX: 0, //开始坐标
    startY: 0,
    todoPlanInfoList: [],
    doingPlanInfoList: [],
    donePlanInfoList: [],
    query_type: 0, //0：我的；1：好友
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var planNo = options.pNo;
    var query_type = options.tp;
    var phoneInfo = app.globalData.phoneInfo;
    if (!phoneInfo) {
      wx.getSystemInfo({
        success: res => {
          phoneInfo = res;
          app.globalData.phoneInfo = res;
        }
      });
    }
    this.setData({
      query_type: query_type,
      planNo: planNo,
      sliderLeft: (phoneInfo.windowWidth / this.data.tabs.length - sliderWidth) / 2,
      sliderOffset: phoneInfo.windowWidth / this.data.tabs.length * this.data.activeIndex
    });
    this.queryPlanDetailInfo("doingPlanInfoList", planNo, 1, query_type);
    wx.setNavigationBarTitle({
      title: query_type == 0 ? '我的小目标' : '好友的小目标',
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
  swtichBar: function(e) {
    var id = e.currentTarget.id;
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: id
    });
    if (id == 0) {
      this.queryPlanDetailInfo("todoPlanInfoList", this.data.planNo, 0, this.data.query_type)
    } else if (id == 1) {
      this.queryPlanDetailInfo("doingPlanInfoList", this.data.planNo, 1, this.data.query_type);
    } else if (id == 2) {
      this.queryPlanDetailInfo("donePlanInfoList", this.data.planNo, 2, this.data.query_type);
    }
  },
  queryPlanDetailInfo: function(queryType, plan_no, status, query_type, auth_type) {
    if (!auth_type) {
      if (query_type == 1) {
        auth_type = [0];
      } else {
        auth_type = [0, 1];
      }
    }
    request.postReq(config.service.queryPlanDetailInfo, {
      status: status,
      plan_no: plan_no,
      auth_type: auth_type,
      query_type: query_type
    }, res => {
      if (res.code == 1 && res.data) {
        res.data.forEach(function(item, i) {
          item.plan_start_time = util.formatUnixTime(item.plan_start_time, "Y.M.D");
          item.plan_end_time = util.formatUnixTime(item.plan_end_time, "Y.M.D");
          item.isTouchMove = false;
        })
        var result = {};
        result[queryType] = res.data;
        this.data[queryType] = res.data;
        this.setData(result);
      }
    })
  },
  todoTouchstart: function(e) {
    console.log("todo touch start....");
    //开始触摸时 重置所有删除
    commonUtil.preTouchMoveBox(this.data.todoPlanInfoList);
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      todoPlanInfoList: this.data.todoPlanInfoList
    })
  },
  todoTouchmove: function(e) {
    console.log("todo touch move....");
    var index = e.currentTarget.dataset.index, //当前索引
      startX = this.data.startX, //开始X坐标
      startY = this.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY; //滑动变化坐标
    commonUtil.touchMoveBox(this.data.todoPlanInfoList, index, startX, startY, touchMoveX, touchMoveY);
    //更新数据
    this.setData({
      todoPlanInfoList: this.data.todoPlanInfoList
    })
  },
  todoTouchend: function(e) {
    console.log("todo touch end....");
  },
  doingTouchstart: function(e) {
    console.log("doing touch start....");
    //开始触摸时 重置所有删除
    commonUtil.preTouchMoveBox(this.data.doingPlanInfoList);
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      doingPlanInfoList: this.data.doingPlanInfoList
    })
  },
  doingTouchmove: function(e) {
    console.log("doing touch move....");
    var index = e.currentTarget.dataset.index, //当前索引
      startX = this.data.startX, //开始X坐标
      startY = this.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY; //滑动变化坐标
    commonUtil.touchMoveBox(this.data.doingPlanInfoList, index, startX, startY, touchMoveX, touchMoveY);
    //更新数据
    this.setData({
      doingPlanInfoList: this.data.doingPlanInfoList
    })
  },
  doingTouchend: function(e) {
    console.log("doing touch end....");
  },
  navigatorToDetail: function(e) {
    var pdNo = e.currentTarget.dataset.pdno;
    wx.navigateTo({
      url: './plan_detail?pdNo=' + pdNo,
    })
  },
  navigatorToEdit: function(e) {
    var pdNo = e.currentTarget.dataset.pdno;
    var index = e.currentTarget.dataset.index;
    var opt = e.currentTarget.dataset.opt;
    wx.navigateTo({
      url: './plan_detail_edit?pdNo=' + pdNo + "&index=" + index + "&editType=" + opt,
    })
  },
  onAddProgress: function(e) {
    console.log("add progress....");
    var index = e.currentTarget.dataset.index; //当前索引
    var doingPlanInfo = this.data.doingPlanInfoList[index];
    var newProgress = doingPlanInfo.progress + 10;
    if (newProgress >= 100) {
      newProgress = 100;
      var that = this;
      wx.showModal({
        title: '确定完成目标',
        content: '目标完成不可更改！！！',
        success(res) {
          if (res.confirm) {
            wx.vibrateLong();
            that.data.doingPlanInfoList[index].progress = newProgress;
            doingPlanInfo.progress = newProgress;
            //新增进度
            request.postReq(config.service.addPlanProgress, {
              progress: doingPlanInfo.progress,
              plan_detail_no: doingPlanInfo.plan_detail_no,
              plan_no: doingPlanInfo.plan_no
            }, res => {
              that.data.doingPlanInfoList.splice(index, 1);
              that.setData({
                doingPlanInfoList: that.data.doingPlanInfoList
              })
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.vibrateLong();
      this.data.doingPlanInfoList[index].progress = newProgress;
      request.postReq(config.service.addPlanProgress, {
        progress: newProgress,
        plan_detail_no: doingPlanInfo.plan_detail_no,
        plan_no: doingPlanInfo.plan_no
      }, res => {
        if (res.code == 1) {
          this.setData({
            doingPlanInfoList: this.data.doingPlanInfoList
          })
        }
      })
    }
  },
  onStartPlan: function(e) {
    var index = e.currentTarget.dataset.index;
    var pdNo = e.currentTarget.dataset.pdno;
    var pNo = e.currentTarget.dataset.pno;
    request.postReq(config.service.startPlanDetailInfo, {
      pNo: pNo,
      pdNo: pdNo
    }, res => {
      if (res.code == 1) {
        this.data.todoPlanInfoList.splice(index, 1);
        this.setData({
          todoPlanInfoList: this.data.todoPlanInfoList
        })
      }
    })
  },
  onDeletePlan: function(e) {
    var pdNo = e.currentTarget.dataset.pdno;
    var pNo = e.currentTarget.dataset.pno;
    var opt = e.currentTarget.dataset.opt;
    request.deleteReq(config.service.delPlanDetailInfo, "pdNo=" + pdNo + "&pNo=" + pNo, res => {
      if (res.code == 1) {
        if (opt == 0) {
          this.queryPlanDetailInfo("todoPlanInfoList", pNo, 0);
        } else if (opt == 1) {
          this.queryPlanDetailInfo("doingPlanInfoList", pNo, 1);
        }
      }
    })
  },
  onToTop: function(e) {
    var index = e.currentTarget.dataset.index;
    var pdNo = e.currentTarget.dataset.pdno;
    var planDetailInfo = this.data.doingPlanInfoList[index];
    if (planDetailInfo.priority != 1) {
      request.postReq(config.service.topIndex, {
        pdNo: pdNo,
        priority: 1
      }, res => {
        if (res.code == 1) {
          this.data.doingPlanInfoList = commonUtil.toArrayTop(this.data.doingPlanInfoList, index);
          this.setData({
            doingPlanInfoList: this.data.doingPlanInfoList
          })
        }
      })
    }
  },
  remindPlanToFriend: function(e) {
    var pdNo = e.currentTarget.dataset.pdno;
    var status = e.currentTarget.dataset.status;
    var uid = e.currentTarget.dataset.uid;//被通知用户uid
    // var formId = e.detail.formId;
    // console.log("formId", formId);
    request.postReq(config.service.notifyRemindTemplate, {
      'pdNo': pdNo,
      'uid': uid,
      'status': status,
    }, res => {
      if (res.code == 1) {
        util.showSuccess("提醒成功！");
      } else {
        util.showNone("提醒失败！");
      }
    })
  }
})