var qcloud = require('../vendor/wafer2-client-sdk/index')
var config = require('../config')
var util = require('../utils/util')
const cache = require("./cache.js")

/**
 * get 请求
 */
function getReq(url, params, callback) {
    var session = qcloud.Session.get();
    console.log(session);
    var url = url+ (params ? "?" + params : '');
    console.log('get request：' + url);
    var that = this
    var options = {
        url: url,
        method: 'GET',
        success(result) {
            console.log('get request result', result);
            if (callback && typeof(callback) == 'function') {
                callback(result.data);
            }
        },
        fail(error) {
            console.log('get request fail：', error);
            util.showModel('请求失败', error);
        }
    }
    wx.request(options)
}

/**
 * Post 请求
 */
const postReq = (url, params, callback, tip) => {
    var session = qcloud.Session.get();
    console.log("post req session",session);
    params = params ? params : {};

    console.info("post request url：", url);
    console.info("post request params：", params);
    var options = {
        header:{
            'X-WX-SKEY':session.skey
        },
        url: url,
        data: params ? params : {},
        method: 'POST',
        success: (res) => {
            console.log("post result:", res);
            if (callback && typeof(callback) == 'function') {
                callback(res.data);
            }
        },
        fail: (error) => {
            console.log('post request fail', error);
            util.showModel('请求失败', error);
        }
    };
    wx.request(options);
    // qcloud.request(options)
};
/**
 * delete 请求
 */
const delReq = (funKey, params, callback) => {
    if (!params) {
        util.showModel('删除失败', "参数错误");
    }
    var session = qcloud.Session.get();
    console.log(session);
    var url = config.service[funKey] + "?" + params;
    console.info("delete request url：" + url);
    wx.showModal({
        content: "确定删除？",
        success: function (res) {
            if (res.confirm) {
                var options = {
                    url: url,
                    method: 'DELETE',
                    success(result) {
                        console.log(result);
                        if (callback && typeof(callback) == 'function') {
                            callback(result.data);
                        }
                    },
                    fail(error) {
                        console.log('delete request fail', error);
                        util.showModel('请求失败', error);
                    }
                }
                wx.request(options)
            } else if (res.cancel) {
            }
        }
    })
};

module.exports = {
    getReq,
    postReq,
    delReq
};