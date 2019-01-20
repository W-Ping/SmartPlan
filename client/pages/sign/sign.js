// client/pages/work/work.js
var util = require("../../utils/util");
const request = require("../../utils/request")
var config = require('../../config')
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        wkHidden: false, //工作打卡显示
        otHidden: false, //加班打卡显示
        normalOnWkTimeFlag: 0, //0:未打卡 1：正常打卡 2：异常打卡
        normalOffWkTimeFlag: 0,
        normalOnOvTimeFlag: 0,
        normalOffOvTimeFlag: 0,
        onWkMaxTime: "",
        onWkMinTime: "",
        offWkMaxTime: "",
        offWkMinTime: "",
        onWkOvMaxTime: "",
        onWkOvMinTime: "",
        offWkOvMaxTime: "",
        offWkOvMinTime: "",
        onWkTime: "", //上班时间
        offWkTime: "", //下班时间
        onWkOvTime: "", //加班上班时间
        offWkOvTime: "", //加班 下班时间
        onWkActualTime: "", //上班打卡时间
        offWkActualTime: "", //下班打卡时间
        onActualWkOverTime: "", //加班上班打卡时间
        offActualWkOverTime: "", //加班下班打卡时间
        weekDay: util.getWeek(),
        today: util.formatUnixTime(new Date(), 'Y年M月D日')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var dateVersion = util.formatUnixTime(new Date(), "Y-M-D");
        request.getReq(config.service.getClockRecord, "dv=" + dateVersion, res => {
            if (res.code == 1) {
                var init = {};
                var workClockRuleInfo = res.data.workClockRuleInfo;
                var overtimeWorkClockRuleInfo = res.data.overtimeWorkClockRuleInfo;
                if (workClockRuleInfo && Object.keys(workClockRuleInfo).length > 0) {
                    init.onWkMaxTime = util.getDateTime(workClockRuleInfo.clock_on_max_time);
                    init.onWkMinTime = util.getDateTime(workClockRuleInfo.clock_on_min_time);
                    init.offWkMaxTime = util.getDateTime(workClockRuleInfo.clock_off_max_time);
                    init.offWkMinTime = util.getDateTime(workClockRuleInfo.clock_off_min_time);
                    init.onWkTime = util.getDateTime(workClockRuleInfo.clock_on_time);
                    init.offWkTime = util.getDateTime(workClockRuleInfo.clock_off_time);
                    init.wkHidden = false;
                } else {
                    init.wkHidden = true;
                }
                if (overtimeWorkClockRuleInfo && Object.keys(overtimeWorkClockRuleInfo).length > 0) {
                    init.onWkOvMaxTime = util.getDateTime(overtimeWorkClockRuleInfo.clock_on_max_time);
                    init.onWkOvMinTime = util.getDateTime(overtimeWorkClockRuleInfo.clock_on_min_time);
                    init.offWkOvMaxTime = util.getDateTime(overtimeWorkClockRuleInfo.clock_off_max_time);
                    init.offWkOvMinTime = util.getDateTime(overtimeWorkClockRuleInfo.clock_off_min_time);
                    init.onWkOvTime = util.getDateTime(overtimeWorkClockRuleInfo.clock_on_time);
                    init.offWkOvTime = util.getDateTime(overtimeWorkClockRuleInfo.clock_off_time);
                    init.otHidden = false;
                } else {
                    init.otHidden = true;
                }
                var workClockInfo = res.data.workClockInfo;
                var overtimeWorkClockInfo = res.data.overtimeWorkClockInfo;
                var onWkActualTime = util.getDateTime(workClockInfo.clock_on_time);
                var offWkActualTime = util.getDateTime(workClockInfo.clock_off_time);
                var onActualWkOverTime = util.getDateTime(overtimeWorkClockInfo.clock_on_time);
                var offActualWkOverTime = util.getDateTime(overtimeWorkClockInfo.clock_off_time);
                if (onWkActualTime) {
                    init.onWkActualTime = onWkActualTime;
                    init.normalOnWkTimeFlag = 1;
                }
                if (offWkActualTime) {
                    init.offWkActualTime = offWkActualTime;
                    init.normalOffWkTimeFlag = 1;
                }
                if (onActualWkOverTime) {
                    init.onActualWkOverTime = onActualWkOverTime;
                    init.normalOnOvTimeFlag = 1;
                }
                if (offActualWkOverTime) {
                    init.offActualWkOverTime = offActualWkOverTime;
                    init.normalOffOvTimeFlag = 1;
                }
                userInfo: app.globalData.userInfo
                this.setData(init);
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
    workClock: function (e) {
        var nowTime = util.getNowTime();
        var onWkActualTime = this.data.onWkActualTime;
        var offWkActualTime = this.data.offWkActualTime;
        var onWkMinTime = this.data.onWkMinTime;
        var onWkMaxTime = this.data.onWkMaxTime;
        var onWkMinFlag = util.compareTime(nowTime, onWkMinTime);
        var onWkMaxFlag = util.compareTime(onWkMaxTime, nowTime);
        //上班打卡
        if (onWkMinFlag && onWkMaxFlag) {
            console.log("工作上班打卡", util.getNowTime());
            if (!onWkActualTime) {
                wx.vibrateLong();
                request.postReq(config.service.saveClockRecord, {
                    clock_type: 0,
                    clock_on_time: nowTime
                }, res => {
                    if (res.code == 1) {
                        this.setData({
                            onWkActualTime: nowTime,
                            normalOnWkTimeFlag: 1
                        })
                    }
                })
            }else{
                util.showNone("上班已经打卡成功")
            }
            return
        } else if (!onWkMinFlag) {
            util.showModel("", onWkMinTime + "后才能打卡上班哦？")
            return
        }
        //下班打卡
        if (!offWkActualTime) {
            var offWkMinTime = this.data.offWkMinTime;
            var offWkMaxTime = this.data.offWkMaxTime;
            var offWkMinFlag = util.compareTime(nowTime, offWkMinTime);
            var offWkMaxFlag = util.compareTime(offWkMaxTime, nowTime);
            if (offWkMinFlag && offWkMaxFlag) {
                console.log("工作下班打卡", util.getNowTime());
                wx.vibrateLong();
                request.postReq(config.service.saveClockRecord, {
                    clock_type: 0,
                    clock_off_time: nowTime
                }, res => {
                    if (res.code == 1) {
                        this.setData({
                            offWkActualTime: nowTime,
                            normalOffWkTimeFlag: 1,
                        })
                    }
                })
            } else if (!offWkMinFlag) {
                util.showModel("", offWkMinTime + "后才能打卡下班哦？")
            }
        } else {
            util.showNone("下班已经打卡成功")
        }

    },
    overtimeClock: function (e) {
        console.log("加班打卡", util.getNowTime());
        var nowTime = util.getNowTime();
        var onActualWkOverTime = this.data.onActualWkOverTime;
        var onWkOvMinTime = this.data.onWkOvMinTime;
        var onWkOvMaxTime = this.data.onWkOvMaxTime;
        var onWkOvMinFlag = util.compareTime(nowTime, onWkOvMinTime);
        var onWkOvMaxFlag = util.compareTime(onWkOvMaxTime, nowTime);
        if (onWkOvMinFlag && onWkOvMaxFlag) {
            if (!onActualWkOverTime) {
                wx.vibrateLong();
                request.postReq(config.service.saveClockRecord, {
                    clock_type: 1,
                    clock_on_time: nowTime
                }, res => {
                    if (res.code == 1) {
                        this.setData({
                            onActualWkOverTime: nowTime,
                            normalOnOvTimeFlag: 1
                        })
                    }
                })
            } else {
                util.showNone("上班已经打卡成功")
            }
            return
        } else if (!onWkOvMinFlag) {
            util.showModel("", onWkOvMinTime + "后才能打卡上班哦？")
            return
        }
        var offActualWkOverTime = this.data.offActualWkOverTime;
        if (!offActualWkOverTime) {
            var offWkOvMinTime = this.data.offWkOvMinTime;
            var offWkOvMaxTime = this.data.offWkOvMaxTime;
            var offWkOvMinFlag = util.compareTime(nowTime, offWkOvMinTime);
            var offWkOvMaxFlag = util.compareTime(offWkOvMaxTime, nowTime);
            if (offWkOvMinFlag && offWkOvMaxFlag) {
                wx.vibrateLong();
                request.postReq(config.service.saveClockRecord, {
                    clock_type: 1,
                    clock_off_time: nowTime
                }, res => {
                    if (res.code == 1) {
                        this.setData({
                            offActualWkOverTime: nowTime,
                            normalOffOvTimeFlag: 1
                        })
                    }
                })
            } else if (!offWkOvMinFlag) {
                util.showModel("", offWkOvMinTime + "后才能打卡下班哦？")
            }
        } else {
            util.showNone("下班已经成功")
        }
    },
    navigateToRule: function () {
        wx.navigateTo({
            url: 'sign_rule',
        })
    },
    navigatorToRecord: function () {
        wx.navigateTo({
            url: 'sign_record',
        })
    },
})