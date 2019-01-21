// client/pages/sign/sign_rule.js
const hours = [];
const minutes = [];
//获取小时
for (let i = 0; i < 24; i++) {
    if (i < 10) {
        i = "0" + i;
    }
    hours.push("" + i);
}
//获取分钟
for (let i = 0; i < 60; i++) {
    if (i < 10) {
        i = "0" + i;
    }
    minutes.push("" + i);
}
var util = require("../../utils/util");
const request = require("../../utils/request")
var config = require('../../config')
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        wkClockHidden: false,
        ovClockHidden: false,
        ovWeekendClockHidden: false,
        onOvTime: '20:00',//加班上班时间
        offOvTime: '23:00',//加班下班时间
        onOvWeekendTime: '09:30',//双休日加班上班时间
        offOvWeekendTime: '18:30',//双休日加班下班时间
        onWkTime: '09:00',//上班时间
        offWkTime: '18:00',//下班时间
        onWkRangeTime: '06:00~10:00',//上班打卡有效范围
        offWkRangeTime: '15:30~20:00',//下班打开有效范围
        onOvRangeTime: '20:00~21:00',//加班上班打开有效范围
        offOvRangeTime: '21:00~23:30',//加班下班打开有效范围
        onOvWeekendRangeTime: '06:00~11:00',//双休日加班上班打开有效范围
        offOvWeekendRangeTime: '15:00~23:30',//双休日加班下班打开有效范围
        onWkRangeTimeIndex: [9, 0, 10, 0],
        offWkRangeTimeIndex: [16, 30, 19, 0],
        onOvRangeTimeIndex: [20, 0, 21, 0],
        offOvRangeTimeIndex: [21, 0, 23, 30],
        onOvWeekendRangeTimeIndex: [9, 0, 11, 0],
        offOvWeekendRangeTimeIndex: [15, 0, 19, 0],
        timeRange: [hours, minutes, hours, minutes],
        wkCheckboxItems: [{
            name: '1',
            value: '星期一',
            checked: true
        },
            {
                name: '2',
                value: '星期二',
                checked: true
            },
            {
                name: '3',
                value: '星期三',
                checked: true
            },
            {
                name: '4',
                value: '星期四',
                checked: true
            },
            {
                name: '5',
                value: '星期五',
                checked: true
            },
        ],
        ovCheckboxItems: [{
            name: '1',
            value: '星期一',
            checked: true
        },
            {
                name: '2',
                value: '星期二',
                checked: true
            },
            {
                name: '3',
                value: '星期三',
                checked: true
            },
            {
                name: '4',
                value: '星期四',
                checked: true
            },
            {
                name: '5',
                value: '星期五',
                checked: true
            },
        ],
        ovWeekendCheckboxItems: [{
            name: '0',
            value: '星期日',
            checked: true
        },
            {
                name: '6',
                value: '星期六',
                checked: true
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        request.getReq(config.service.getClockRuleInfo, null, res => {
            if (res.code == 1 && res.data) {
                var workClockRuleInfo = res.data.workClockRuleInfo;
                var overtimeWorkClockRuleInfo = res.data.overtimeWorkClockRuleInfo;
                var overtimeWeekendClockRuleInfo = res.data.overtimeWeekendClockRuleInfo;
                var init = {};
                if (Object.keys(workClockRuleInfo).length > 0) {
                    init.onWkTime = util.getDateTime(workClockRuleInfo.clock_on_time);
                    init.offWkTime = util.getDateTime(workClockRuleInfo.clock_off_time);
                    init.onWkRangeTime = util.getDateTime(workClockRuleInfo.clock_on_min_time) + "~" + util.getDateTime(workClockRuleInfo.clock_on_max_time);
                    init.offWkRangeTime = util.getDateTime(workClockRuleInfo.clock_off_min_time) + "~" + util.getDateTime(workClockRuleInfo.clock_off_max_time);
                    init.onWkRangeTimeIndex = util.convertTimeToArr(workClockRuleInfo.clock_on_min_time, workClockRuleInfo.clock_on_max_time);
                    init.offWkRangeTimeIndex = util.convertTimeToArr(workClockRuleInfo.clock_off_min_time, workClockRuleInfo.clock_off_max_time);
                    init.wkClockHidden = workClockRuleInfo.status == 0 ? false : true;
                    var workClockValidWeek = workClockRuleInfo.clock_valid_week;
                    var wkCheckboxItems = this.data.wkCheckboxItems;
                    for (var i = 0; i < wkCheckboxItems.length; i++) {
                        if (workClockValidWeek && workClockValidWeek.indexOf(wkCheckboxItems[i].name) != -1) {
                            wkCheckboxItems[i].checked = true;
                        } else {
                            wkCheckboxItems[i].checked = false;
                        }
                    }
                    init.wkCheckboxItems = wkCheckboxItems;
                }
                if (Object.keys(overtimeWorkClockRuleInfo).length > 0) {
                    init.onOvTime = util.getDateTime(overtimeWorkClockRuleInfo.clock_on_time);
                    init.offOvTime = util.getDateTime(overtimeWorkClockRuleInfo.clock_off_time);
                    init.onOvRangeTime = util.getDateTime(overtimeWorkClockRuleInfo.clock_on_min_time) + "~" + util.getDateTime(overtimeWorkClockRuleInfo.clock_on_max_time);
                    init.offOvRangeTime = util.getDateTime(overtimeWorkClockRuleInfo.clock_off_min_time) + "~" + util.getDateTime(overtimeWorkClockRuleInfo.clock_off_max_time);
                    init.onOvRangeTimeIndex = util.convertTimeToArr(overtimeWorkClockRuleInfo.clock_on_min_time, overtimeWorkClockRuleInfo.clock_on_max_time);
                    init.offOvRangeTimeIndex = util.convertTimeToArr(overtimeWorkClockRuleInfo.clock_off_min_time, overtimeWorkClockRuleInfo.clock_off_max_time);
                    init.ovClockHidden = overtimeWorkClockRuleInfo.status == 0 ? false : true;
                    var ovWorkClockValidWeek = overtimeWorkClockRuleInfo.clock_valid_week;
                    var ovCheckboxItems = this.data.ovCheckboxItems;
                    for (var i = 0; i < ovCheckboxItems.length; i++) {
                        if (ovWorkClockValidWeek && ovWorkClockValidWeek.indexOf(ovCheckboxItems[i].name) != -1) {
                            ovCheckboxItems[i].checked = true;
                        } else {
                            ovCheckboxItems[i].checked = false;
                        }
                    }
                    init.ovCheckboxItems = ovCheckboxItems;
                }
                if (Object.keys(overtimeWeekendClockRuleInfo).length > 0) {
                    init.onOvWeekendTime = util.getDateTime(overtimeWeekendClockRuleInfo.clock_on_time);
                    init.offOvWeekendTime = util.getDateTime(overtimeWeekendClockRuleInfo.clock_off_time);
                    init.onOvWeekendRangeTime = util.getDateTime(overtimeWeekendClockRuleInfo.clock_on_min_time) + "~" + util.getDateTime(overtimeWeekendClockRuleInfo.clock_on_max_time);
                    init.offOvWeekendRangeTime = util.getDateTime(overtimeWeekendClockRuleInfo.clock_off_min_time) + "~" + util.getDateTime(overtimeWeekendClockRuleInfo.clock_off_max_time);
                    init.onOvWeekendRangeTimeIndex = util.convertTimeToArr(overtimeWeekendClockRuleInfo.clock_on_min_time, overtimeWeekendClockRuleInfo.clock_on_max_time);
                    init.offOvWeekendRangeTimeIndex = util.convertTimeToArr(overtimeWeekendClockRuleInfo.clock_off_min_time, overtimeWeekendClockRuleInfo.clock_off_max_time);
                    init.ovWeekendClockHidden = overtimeWeekendClockRuleInfo.status == 0 ? false : true;
                    var ovWeekendClockValidWeek = overtimeWeekendClockRuleInfo.clock_valid_week;
                    var ovWeekendCheckboxItems = this.data.ovWeekendCheckboxItems;
                    for (var i = 0; i < ovWeekendCheckboxItems.length; i++) {
                        if (ovWeekendClockValidWeek && ovWeekendClockValidWeek.indexOf(ovWeekendCheckboxItems[i].name) != -1) {
                            ovWeekendCheckboxItems[i].checked = true;
                        } else {
                            ovWeekendCheckboxItems[i].checked = false;
                        }
                    }
                    init.ovWeekendCheckboxItems = ovWeekendCheckboxItems;
                }

                this.setData(init)
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
    bindRangeChange: function (e) {
        var type = e.currentTarget.dataset.type;
        console.log(type);
        console.log(e.detail.value);
        var slected = e.detail.value;
        var timeRange = this.data.timeRange;
        var startH = timeRange[0][slected[0]];
        var startM = timeRange[1][slected[1]];
        var endH = timeRange[2][slected[2]];
        var endM = timeRange[3][slected[3]];
        var rangeTime = startH + ":" + startM + "~" + endH + ":" + endM;
        var changeData = {};
        switch (type) {
            case 'onWk':
                changeData.onWkRangeTime = rangeTime;
                break;
            case 'offWk':
                changeData.offWkRangeTime = rangeTime;
                break;
            case 'onOv':
                changeData.onOvRangeTime = rangeTime;
                break;
            case 'offOv':
                changeData.offOvRangeTime = rangeTime;
                break;
            case 'onOvWd':
                changeData.onOvWeekendRangeTime = rangeTime;
                break;
            case 'offOvWd':
                changeData.offOvWeekendRangeTime = rangeTime;
                break;
        }
        this.setData(changeData);
    },
    bindRangeColumnChange: function (e) {
        console.log(e.detail.value, e.detail.column)
    },
    switchWkChange: function (e) {
        this.setData({
            wkClockHidden: !this.data.wkClockHidden
        })
    },
    switchOvChange: function (e) {
        this.setData({
            ovClockHidden: !this.data.ovClockHidden
        })
    },
    switchOvWeekedChange: function (e) {
        this.setData({
            ovWeekendClockHidden: !this.data.ovWeekendClockHidden
        })
    },
    changeOnOvTime: function (e) {
        this.setData({
            onOvTime: e.detail.value
        })
    },
    changeOffOvTime: function (e) {
        this.setData({
            offOvTime: e.detail.value
        })
    },
    changeOnOvWeekendTime: function (e) {
        this.setData({
            onOvWeekendTime: e.detail.value
        })
    },
    changeOffOvWeekendTime: function (e) {
        this.setData({
            offOvWeekendTime: e.detail.value
        })
    },
    changeOnWkTime: function (e) {
        this.setData({
            onWkTime: e.detail.value
        })
    },
    changeOffWkTime: function (e) {
        this.setData({
            offWkTime: e.detail.value
        })
    },
    submitClock: function (e) {
        console.log("submitClock", e.detail.value)
        request.postReq(config.service.saveClockRuleInfo, e.detail.value, res => {
            if (res.code == 1) {
                util.showSuccess("保存成功")
            }
        })

    },
    ovCheckboxChange: function (e) {
        var checked = e.detail.value
        var changed = {}
        for (var i = 0; i < this.data.ovCheckboxItems.length; i++) {
            if (checked.indexOf(this.data.ovCheckboxItems[i].name) !== -1) {
                changed['ovCheckboxItems[' + i + '].checked'] = true
            } else {
                changed['ovCheckboxItems[' + i + '].checked'] = false
            }
        }
        this.setData(changed)
    },
    ovWeekendCheckboxChange: function (e) {
        var checked = e.detail.value
        var changed = {}
        for (var i = 0; i < this.data.ovWeekendCheckboxItems.length; i++) {
            if (checked.indexOf(this.data.ovWeekendCheckboxItems[i].name) !== -1) {
                changed['ovWeekendCheckboxItems[' + i + '].checked'] = true
            } else {
                changed['ovWeekendCheckboxItems[' + i + '].checked'] = false
            }
        }
        this.setData(changed)
    },
    wkCheckboxChange: function (e) {
        var checked = e.detail.value
        var changed = {}
        for (var i = 0; i < this.data.wkCheckboxItems.length; i++) {
            if (checked.indexOf(this.data.wkCheckboxItems[i].name) !== -1) {
                changed['wkCheckboxItems[' + i + '].checked'] = true
            } else {
                changed['wkCheckboxItems[' + i + '].checked'] = false
            }
        }
        this.setData(changed)
    },
})