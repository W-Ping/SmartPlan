const request = require("../../utils/request")
const config = require('../../config')
const util = require('../../utils/util')
const commonUtil = require('../../utils/commonUtil');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startX: 0, //开始坐标
    startY: 0,
    planInfo: {},
    planDetailInfoList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var planNo = options.pNo;
    request.getReq(config.service.getPlanInfo, "planNo=" + planNo, (res) => {
      if (res.code == 1) {
        var planInfo = res.data.planInfo;
        var planDetailInfoList = res.data.planDetailInfoList;
        planDetailInfoList.forEach(function(item, i) {
          item.plan_start_time = util.formatUnixTime(item.plan_start_time, "Y.M.D");
          item.plan_end_time = util.formatUnixTime(item.plan_end_time, "Y.M.D");
          item.plan_actual_end_time = util.formatUnixTime(item.plan_actual_end_time, "Y.M.D");
          item.plan_actual_start_time = util.formatUnixTime(item.plan_actual_start_time, "Y.M.D");
          item.status_desc = item.status == 0 ? '未启动' : item.status == 1 ? '执行中' : '已完成';
          item.isTouchMove = false //默认隐藏删除
        })
        planInfo.start_time = util.formatUnixTime(planInfo.start_time, "Y.M.D");
        planInfo.end_time = util.formatUnixTime(planInfo.end_time, "Y.M.D");
        this.setData({
          planInfo: res.data.planInfo,
          planDetailInfoList: planDetailInfoList
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  planTouchstart: function(e) {
    console.log("todo touch start....");
    //开始触摸时 重置所有删除
    commonUtil.preTouchMoveBox(this.data.planDetailInfoList);
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      planDetailInfoList: this.data.planDetailInfoList
    })
  },
  planTouchmove: function(e) {
    console.log("todo touch move....");
    var index = e.currentTarget.dataset.index, //当前索引
      startX = this.data.startX, //开始X坐标
      startY = this.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY; //滑动变化坐标
    commonUtil.touchMoveBox(this.data.planDetailInfoList, index, startX, startY, touchMoveX, touchMoveY);
    //更新数据
    this.setData({
      planDetailInfoList: this.data.planDetailInfoList
    })
  },
  planTouchend: function(e) {
    console.log("todo touch end....");
  },
  planTouchstart: function(e) {
    console.log("doing touch start....");
    //开始触摸时 重置所有删除
    commonUtil.preTouchMoveBox(this.data.planDetailInfoList);
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      planDetailInfoList: this.data.planDetailInfoList
    })
  },
  planTouchmove: function(e) {
    console.log("doing touch move....");
    var index = e.currentTarget.dataset.index, //当前索引
      startX = this.data.startX, //开始X坐标
      startY = this.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY; //滑动变化坐标
    commonUtil.touchMoveBox(this.data.planDetailInfoList, index, startX, startY, touchMoveX, touchMoveY);
    //更新数据
    this.setData({
      planDetailInfoList: this.data.planDetailInfoList
    })
  },
  planTouchend: function(e) {
    console.log("doing touch end....");
  },
  planDetailToEdit: function(e) {

  },
  onToTop: function(e) {
    var index = e.currentTarget.dataset.index;
    var pdNo = e.currentTarget.dataset.pdno;
    var planDetailInfo = this.data.planDetailInfoList[index];
    console.log("plan top ....", planDetailInfo.priority);
    if (planDetailInfo.priority != 1) {
      request.postReq(config.service.topIndex, {
        pdNo: pdNo,
        priority: 1
      }, res => {
        if (res.code == 1) {
          this.data.planInfo.plan_title = res.data.plan_detail_name
          this.data.planDetailInfoList = commonUtil.toArrayTop(this.data.planDetailInfoList, index);
          this.setData({
            planInfo: this.data.planInfo,
            planDetailInfoList: this.data.planDetailInfoList
          })
        }
      })
    }
  },
  onDeletePlan: function(e) {
    var index = e.currentTarget.dataset.index;
    var priority = e.currentTarget.dataset.priority;
    var pdNo = e.currentTarget.dataset.pdno;
    var pNo = this.data.planInfo.plan_no;
    var pNo = this.data.planInfo.plan_no;
    var planLength = this.data.planDetailInfoList.length;
    if (pdNo && pNo) {
      request.deleteReq(config.service.delPlanDetailInfo, "pdNo=" + pdNo + "&pNo=" + pNo, res => {
        if (res.code == 1) {
          console.log("index", index);
          if (priority == 1 && planLength > 1) {
            this.data.planDetailInfoList.splice(index, 1);
            var planDetailInfo = this.data.planDetailInfoList[0];
            if (planDetailInfo) {
              this.data.planDetailInfoList[0].priority = 1;
              request.postReq(config.service.topIndex, {
                priority: 1,
                pdNo: planDetailInfo.plan_detail_no
              }, res => {
                if (res.code == 1) {
                  this.data.planInfo.plan_title = res.data.plan_detail_name
                  this.data.planDetailInfoList = commonUtil.toArrayTop(this.data.planDetailInfoList, 0);
                  this.setData({
                    planInfo: this.data.planInfo,
                    planDetailInfoList: this.data.planDetailInfoList
                  })
                }
              })
            }
          } else {
            this.data.planDetailInfoList.splice(index, 1);
            if (planLength == 1) {
              this.data.planInfo = {};
            }
            this.setData({
              planInfo: this.data.planInfo,
              planDetailInfoList: this.data.planDetailInfoList
            })
          }

        }
      })
    }
  },
  navigatorToAdd: function(e) {
    wx.switchTab({
      url: 'plan',
    })
  },
  navigatorToIndex:function(e){
    wx.switchTab({
      url: '../discovery/discovery',
    })
  }
})