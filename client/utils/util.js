const formatTime = (date, joinSymbol) => {
    if (!joinSymbol) {
        joinSymbol = ".";
    }
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join(joinSymbol) + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}
const nowTime = (joinSymbol) => {
    return formatTime(new Date(), joinSymbol).trim();
};
const getNowTime = () => {
    return formatTime(new Date()).substr(10).substr(0, 6).trim();
}
/**
 *  时间格式 17:20:00 转 17:20
 * @param timeStr
 * @returns {*}
 */
const getDateTime = (timeStr) => {
    if (timeStr && timeStr.indexOf(":")) {
        var timeArr = timeStr.split(":");
        if (timeArr.length == 3) {
            timeStr = timeArr[0] + ":" + timeArr[1];
        }
    }
    return timeStr;
}
const formatUnixTime = (date, format) => {
    if (!date) return '';
    format = format ? format : 'Y-M-D'
    var formateArr = ["Y", "M", "D", "h", "m", "s"];
    var returnArr = [];
    if (date.constructor == String) {
        date = new Date(date);
    }
    returnArr.push(date.getFullYear());
    returnArr.push(formatNumber(date.getMonth() + 1));
    returnArr.push(formatNumber(date.getDate()));

    returnArr.push(formatNumber(date.getHours()));
    returnArr.push(formatNumber(date.getMinutes()));
    returnArr.push(formatNumber(date.getSeconds()));

    for (var i in returnArr) {
        format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;
};

/**
 * 时间新增（小时）
 * @param startDate
 * @param hours
 * @returns {string}
 */
function dateIncrease(startStr, hours) {
    if (!hours || !startStr) {
        return null;
    }
    startStr = new Date(startStr);
    startStr = new Date(startStr.getTime() + hours * 60 * 60 * 1000);
    return formatTime(startStr);
}

/**
 * 获取星期
 */
function getWeek(day) {
    var week = new Array("日", "一", "二", "三", "四", "五", "六");
    day = day || new Date().getDay();
    return week[day];
}

function nowDateAdd(day) {
    day = day || 7;
    var nowDate = new Date(formatUnixTime(new Date(), "Y-M-D"));
    return nowDate = formatUnixTime(new Date(nowDate.getTime() + day * 24 * 60 * 60 * 1000), "Y-M-D");
}

/**
 *   计算两时间之差
 *
 * @param bigDateStr 格式：yyyy/mm/dd HH:mm:ss
 * @param smallDateStr
 * @param diffType 时间差类型【秒，分钟，小时，天】
 * @returns {number}
 */
function dateDiff(bigDateStr, smallDateStr, diffType) {
    bigDateStr = new Date(bigDateStr);
    smallDateStr = new Date(smallDateStr);
    diffType = diffType ? diffType.toLowerCase() : 'minute';
    var timeType = 1;
    var diff = 0;
    switch (diffType) {
        case "second":
            timeType = 1000;
            diff = parseFloat((bigDateStr.getTime() - smallDateStr.getTime()) / parseInt(timeType)).toFixed(2);
            break;
        case "minute":
            timeType = 1000 * 60;
            diff = parseFloat((bigDateStr.getTime() - smallDateStr.getTime()) / parseInt(timeType)).toFixed(2);
            break;
        case "hour":
            timeType = 1000 * 3600;
            diff = parseFloat((bigDateStr.getTime() - smallDateStr.getTime()) / parseInt(timeType)).toFixed(2);
            break;
        case "day":
            timeType = 1000 * 3600 * 24;
            diff = parseInt((bigDateStr.getTime() - smallDateStr.getTime()) / parseInt(timeType));
            break;
        default:
            break;
    }
    return diff;
}

/**
 *  时间转换数组
 *
 * @param timeStr1  19:30
 * @param timeStr2  20:50
 * @returns {*} [19,30,20,50]
 */
function convertTimeToArr(timeStr1, timeStr2) {
    if (timeStr1 && timeStr1.indexOf(":") != -1 && timeStr2 && timeStr2.indexOf(":") != -1) {
        var timeStr1Arr = timeStr1.split(":");
        var timeStr2Arr = timeStr2.split(":");
        var result = [];
        result[0] = parseInt(timeStr1Arr[0]);
        result[1] = parseInt(timeStr1Arr[1]);
        result[2] = parseInt(timeStr2Arr[0]);
        result[3] = parseInt(timeStr2Arr[1]);
        return result;
    }
    return null;

}

/**
 * 比较两个时间大小【格式 时:分:秒 或 时间:分】
 *
 */
function compareTime(timeStr1, timeStr2) {
    var begin_ = timeStr1.split(":");
    var end_ = timeStr2.split(":");
    var begin_time = begin_[0] * 3600 + begin_[1] * 60
    if (begin_.size == 3) {
        begin_time += (begin_[2] * 1);
    }
    var end_time = end_[0] * 3600 + end_[1] * 60;
    if (end_.size == 3) {
        end_time += (end_[2] * 1);
    }
    var result = begin_time >= end_time;
    console.log("timeStr1", timeStr1, "timeStr2", timeStr2, "result", result);
    return result;
}

function monthFirstDay(month) {
    var date = new Date();
    month = month ? month : date.getMonth() + 1;
    if (month < 1 || month > 12) {
        throw new Error("month is error");
    }
    var y = date.getFullYear();
    date = new Date(y, month - 1, 1);
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(formatNumber).join('-');
}

function monthLastDay(month) {
    var date = new Date();
    month = month ? month : date.getMonth() + 1;
    if (month < 1 || month > 12) {
        throw new Error("month is error");
    }
    var y = date.getFullYear();
    date = new Date(y, month, 0);
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(formatNumber).join('-');

}

/**
 *
 * @param unit
 * @returns {string|*}
 */
function dateUnit(unit) {
    unit = unit ? unit : "minute";
    switch (unit) {
        case "second":
            unit = "秒";
            break;
        case "minute":
            unit = "分钟";
            break;
        case "hour":
            unit = "小时";
            break;
        case "day":
            unit = "天";
            break;
        default:
            break;
    }
    return unit;
}


// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})
// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: content ? content : '',
        showCancel: false
    })
}
var showConfirm = (title, content, ok_cb, no_cb) => {
    wx.showModal({
        title: title || "确定",
        content: content || "",
        success(res) {
            if (res.confirm) {
                if (typeof(ok_cb) === "function")
                    ok_cb()
            } else if (res.cancel) {
                if (typeof(no_cb) === "function")
                    no_cb()
            }

        }
    })
}
var showNone = text => wx.showToast({
    title: text,
    icon: 'none'
})

module.exports = {
    nowDateAdd,
    formatTime,
    formatUnixTime,
    monthFirstDay,
    monthLastDay,
    nowTime,
    getNowTime,
    getDateTime,
    convertTimeToArr,
    getWeek,
    compareTime,
    dateIncrease,
    dateDiff,
    dateUnit,
    showBusy,
    showSuccess,
    showModel,
    showConfirm,
    showNone
}