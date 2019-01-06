const formatTime = (date, joinSymbol) => {
    if (!joinSymbol) {
        joinSymbol = "-";
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
const formatUnixTime = (date, format) => {
    var formateArr = ["Y", "M", "D", "h", "m", "s"];
    var returnArr = [];
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
    return nowDate = formatUnixTime(new Date(nowDate.getTime() + day * 24 * 60 * 60 * 1000),"Y-M-D");
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
 * 比较两个时间大小【格式 时:分:秒 或 时间:分】
 *
 */
function compareTime(timeStr1, timeStr2) {
    var bagin_ = timeStr1.split(":");
    var end_ = timeStr2.split(":");
    var bagin_time = bagin_[0] * 3600 + bagin_[1] * 60
    if (bagin_.size == 3) {
        bagin_time += (bagin_[2] * 1);
    }
    var end_time = end_[0] * 3600 + end_[1] * 60;
    if (end_.size == 3) {
        end_time += (end_[2] * 1);
    }
    if (bagin_time >= end_time) {
        return true;
    }
    return false;
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

/**
 *  生成UID 前缀+[1~12]随机数+(数据库+增量数)
 * @param prefix
 * @param lastUid
 * @returns {string}
 */
function generateUid(prefix, lastUid, incr) {
    prefix = prefix || "U";
    lastUid = lastUid || Math.ceil(Math.random() * 99999);
    incr = incr || Math.ceil(Math.random() * 5);
    var rand = Math.ceil(Math.random() * 99);
    rand = rand < 10 ? "0" + rand : rand;
    if (String(lastUid).indexOf(prefix) != -1) {
        lastUid = lastUid.substr(prefix.length + 2);
    }
    lastUid = Number(lastUid) + incr;
    return prefix + rand + lastUid;
}

function generateNo(prefix, lastNo, incr) {
    prefix = prefix || "P";
    lastNo = lastNo || Math.ceil(Math.random() * 999999);
    incr = incr || Math.ceil(Math.random() * 5);
    var rand = Math.ceil(Math.random() * 99);
    rand = rand < 10 ? "0" + rand : rand;
    if (String(lastNo).indexOf(prefix) != -1) {
        lastNo = lastNo.substr(prefix.length+ 2);
    }
    lastNo = String(Number(lastNo) + incr);
    return prefix + rand  + lastNo;
}

module.exports = {formatTime, formatUnixTime, nowTime, nowDateAdd,dateDiff, dateUnit, generateUid, generateNo};