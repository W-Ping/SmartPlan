const request = require("../../utils/request")
const config = require('../../config')
const util = require('../../utils/util')
const commonUtil = require('../../utils/commonUtil.js');
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
    onLoad: function (options) {
        var planNo = options.pNo;
        request.getReq(config.service.getPlanInfo, "planNo=" + planNo, (res) => {
            if (res.code == 1) {
                var planInfo = res.data.planInfo;
                var planDetailInfoList = res.data.planDetailInfoList;
                planDetailInfoList.forEach(function (item, i) {
                    item.plan_start_time = util.formatUnixTime(item.plan_start_time, "Y.M.D");
                    item.plan_end_time = util.formatUnixTime(item.plan_end_time, "Y.M.D");
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
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    planTouchstart: function (e) {
        console.log("todo touch start....");
        //开始触摸时 重置所有删除
        commonUtil.preTouchMoveBox(this.data.planDetailInfoList);
        this.setData({
            startX: e.changedTouches[0].clientX,
            startY: e.changedTouches[0].clientY,
            planDetailInfoList: this.data.planDetailInfoList
        })
    },
    planTouchmove: function (e) {
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
    planTouchend: function (e) {
        console.log("todo touch end....");
    },
    planTouchstart: function (e) {
        console.log("doing touch start....");
        //开始触摸时 重置所有删除
        commonUtil.preTouchMoveBox(this.data.planDetailInfoList);
        this.setData({
            startX: e.changedTouches[0].clientX,
            startY: e.changedTouches[0].clientY,
            planDetailInfoList: this.data.planDetailInfoList
        })
    },
    planTouchmove: function (e) {
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
    planTouchend: function (e) {
        console.log("doing touch end....");
    },
    planDetailToEdit: function (e) {

    },
    onToTop: function (e) {
        console.log("plan top ....");
        var index = e.currentTarget.dataset.index;
        var pdno = e.currentTarget.dataset.pdno;
        var planDetailInfoList = this.data.planDetailInfoList;
        var planDetailInfo = planDetailInfoList[index];
        if (planDetailInfo.priority != 1) {
            request.postReq(config.service.updatePlanDetailInfo, {
                plan_detail_no: pdno,
                priority: 1
            }, res => {
                if (res.code == 1) {
                    planDetailInfoList = commonUtil.toArrayTop(planDetailInfoList, index);
                    this.setData({
                        planDetailInfoList: planDetailInfoList
                    })
                }
            })
        }
    },
    onDeletePlan: function (e) {
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
    navigatorToAdd: function (e) {
        wx.switchTab({
            url: 'plan',
        })
    }
})