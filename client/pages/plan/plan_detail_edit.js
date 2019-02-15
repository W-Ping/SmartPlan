const request = require("../../utils/request")
const config = require('../../config')
const util = require('../../utils/util')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        planDetailInfo: {},
        planEndTime: '',
        planStartTime: '',
        followUidList: [],
        maxTime: '',
        minTime: '',
        roleOpen: false,
        followNames: '',
        index: -1, //编辑数据的索引
        roleItems: [{
            name: '公开',
            value: 0,
            desc: '所有人可看',
            selected: true
        }, {
            name: '私密',
            value: 1,
            desc: '仅自己可看',
            selected: false
        }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var pdNo = options.pdNo;
        var index = options.index;
        request.getReq(config.service.getPlanDetailInfo, "pdNo=" + pdNo, res => {
            if (res.code == 1 && res.data) {
                var planDetailInfo = res.data.planDetailInfo;
                var planInfo = res.data.planInfo;
                planDetailInfo.plan_start_time = util.formatUnixTime(planDetailInfo.plan_start_time);
                planDetailInfo.plan_end_time = util.formatUnixTime(planDetailInfo.plan_end_time);
                this.data.roleItems.forEach((item, i) => {
                    if (item.value == planDetailInfo.auth_type) {
                        item.selected = true;
                    } else {
                        item.selected = false;
                    }
                })
                var planSuperviseList = res.data.planSuperviseList;
                var followNames = '';
                planSuperviseList.forEach((v, i) => {
                    this.data.followUidList.push(v.friend_uid);
                    followNames += (v.nickName + ',');
                })
                this.setData({
                    index: index,
                    followUidList: this.data.followUidList,
                    followNames: followNames.substring(0, followNames.lastIndexOf(",")),
                    maxTime: util.formatUnixTime(planInfo.end_time, 'Y-M-D'),
                    minTime: util.formatUnixTime(planInfo.start_time, 'Y-M-D'),
                    roleItems: this.data.roleItems,
                    planDetailInfo: planDetailInfo,
                    planStartTime: planDetailInfo.plan_start_time,
                    planEndTime: planDetailInfo.plan_end_time,
                })
            }
        })
    },
    onSelectRole: function (e) {
        var index = e.currentTarget.dataset.index;
        var roleItems = this.data.roleItems;
        if (!roleItems[index].selected) {
            for (var i = 0; i < roleItems.length; i++) {
                if (i == index) {
                    roleItems[i].selected = true;
                } else {
                    roleItems[i].selected = false;
                }
            }
        }
        this.setData({
            roleItems: roleItems
        });
    },
    submitEditPlanInfo: function (e) {
        var planDetailInfo = e.detail.value;
        if (!planDetailInfo.plan_detail_name) {
            util.showNone("请输入目标内容");
            return
        }
        var formId = e.detail.formId;
        console.log("formId", formId);
        planDetailInfo.followUidList = this.data.followUidList;
        request.postReq(config.service.savePlanDetailInfo, planDetailInfo, res => {
            if (res.code == 1) {
                request.postReq(config.service.collectFromid, {formId}, res => {
                    if (res.code !== 1) {
                        console.error("记录用户formId失败");
                    }
                })
                var pages = getCurrentPages();
                var prevPage = pages[pages.length - 2];
                if (this.data.index != -1 && "pages/plan/plan_page" == prevPage.__route__) {
                    if (planDetailInfo.status == 1) {
                        console.log(prevPage.data);
                        prevPage.data.doingPlanInfoList[this.data.index].plan_detail_name = planDetailInfo.plan_detail_name;
                        prevPage.setData({
                            doingPlanInfoList: prevPage.data.doingPlanInfoList
                        });
                    } else {
                        prevPage.data.todoPlanInfoList[this.data.index].plan_detail_name = planDetailInfo.plan_detail_name;
                        prevPage.setData({
                            todoPlanInfoList: prevPage.data.todoPlanInfoList
                        });
                    }
                    wx.navigateBack({
                        delta: 1
                    })
                }
            }
        })
    },
    changePlanStartTime: function (e) {

        if (this.data.planEndTime < e.detail.value) {
            this.data.planEndTime = this.data.maxTime;
        }
        this.setData({
            planStartTime: e.detail.value,
            planEndTime: this.data.planEndTime
        })
    },
    changePlanEndTime: function (e) {
        this.setData({
            planEndTime: e.detail.value,
        })
    },
    switchRoleBox: function (e) {
        this.setData({
            roleOpen: !this.data.roleOpen
        })
    },
    navigatorToFollow: function (e) {
        wx.navigateTo({
            url: '../friend/friend_handler',
        })
    }
})