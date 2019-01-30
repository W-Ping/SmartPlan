// client/pages/notepad/notepad_add.js
const request = require("../../utils/request")
const config = require('../../config')
const util = require('../../utils/util')
const date = new Date()
const years = []
const months = []
const days = []
for (var i = date.getFullYear(); i <= 2030; i++) {
    years.push(i)
}

for (var i = date.getMonth() + 1; i <= 12; i++) {
    months.push(i)
}

for (var i = date.getDate(); i <= util.getMonthDays(); i++) {
    days.push(i)
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        years: years,
        year: date.getFullYear(),
        months: months,
        month: date.getMonth(),
        days: days,
        day: date.getDate(),
        value: [0, 0, 0],
        noteRemindHidden: true
    },
    onShow:function(){

    },
    submitNote: function (e) {
        var noteInfo = e.detail.value;
        if (!noteInfo.note_title) {
          util.showNone("请输入记事标题");
            return
        }
        if (!noteInfo.note_content) {
          util.showNone("请输入记事内容");
            return
        }
        if (!this.data.noteRemindHidden) {
            noteInfo.status = 1;
            noteInfo.remind_time = this.data.year + "-" + util.formatNumber(this.data.month <= 0 ? 1 : this.data.month) + "-" + util.formatNumber(this.data.day)
        } else {
            noteInfo.status = 0;
        }
        request.postReq(config.service.saveNoteInfo, noteInfo, res => {
            if (res.code == 1) {
                wx.navigateBack({
                    delta: 1
                })
            }
        })
    },
    switchRemindChange: function (e) {
        this.setData({
            noteRemindHidden: !this.data.noteRemindHidden
        })
    },
    changeRemindTime: function (e) {
        var val = e.detail.value
        var changeItem = {};
        var selectYear = this.data.years[val[0]];
        var selectMonth = this.data.months[val[1]];
        var selectDay = this.data.days[val[2]];
        changeItem.year = selectYear;
        changeItem.month = selectMonth;
        changeItem.day = selectDay;
        if (this.data.year != selectYear) {
            var months = [];
            var startMonth = 1
            if (selectYear == date.getFullYear()) {
                startMonth = date.getMonth() + 1;
            }
            for (var i = startMonth; i <= 12; i++) {
                months.push(i)
            }
            changeItem.months = months;
            var days = [];
            var startDate = 1;
            if (selectYear == date.getFullYear() && selectMonth == date.getMonth() + 1) {
                startDate = date.getDate();
            }
            for (var i = startDate; i <= util.getMonthDays(selectYear + '-' + (selectMonth+1) + '-01'); i++) {
                days.push(i)
            }
            changeItem.days = days;
        }
        if (this.data.month != selectMonth) {
            var days = [];
            var startDate = 1;
            if (selectYear == date.getFullYear() && selectMonth == date.getMonth() + 1) {
                startDate = date.getDate();
            }
            for (var i = startDate; i <= util.getMonthDays(selectYear + '-' + (selectMonth+1) + '-01'); i++) {
                days.push(i)
            }
            changeItem.days = days;
        }
        this.setData(changeItem)
    }
})