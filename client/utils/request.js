const qcloud = require('../vendor/wafer2-client-sdk/index')
const util = require('../utils/util')

/**
 * get 请求
 */
function getReq(url, params, callback, fail) {
    var url = url + (params ? "?" + params : '');
    console.log('get request：' + url);
    var options = {
        url: url,
        method: 'GET',
        success(res) {
            console.log('get request result', res);
            if (callback && typeof(callback) == 'function') {
                callback(res.data);
            }
        },
        fail(error) {
            console.log('get request fail', error);
            if (fail && typeof(fail) == 'function') {
                fail(error);
            } else {
                util.showModel('请求失败', error);
            }
        }
    }
    wx.request(options)
}

/**
 * Post 请求
 */
const postReq = (url, params, callback, fail) => {
    params = params ? params : {};
    console.info("post request url：", url);
    console.info("post request params：", params);
    var session = qcloud.Session.get();
    console.log("post req session", session);
    var options = {
        header: {
            'X-WX-SKEY': session.skey
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
            if (fail && typeof(fail) == 'function') {
                fail(error);
            } else {
                util.showModel('请求失败', error);
            }
        }
    };
    wx.request(options);
};
/**
 * delete 请求
 */
const deleteReq = (url, params, callback, fail) => {
    if (!params) {
        util.showModel('删除失败', "参数不能为空");
    }
    var session = qcloud.Session.get();
    console.log(session);
    url = url + (params ? "?" + params : '');
    console.info("delete request url：" + url);
    wx.showModal({
        content: "确定删除？",
        success: function (res) {
            if (res.confirm) {
                var options = {
                    header: {
                        'X-WX-SKEY': session.skey
                    },
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
                        if (fail && typeof(fail) == 'function') {
                            fail(error);
                        } else {
                            util.showModel('请求失败', error);
                        }
                    }
                }
                wx.request(options)
            } else if (res.cancel) {
                //取消操作
            }
        }
    })
};

module.exports = {
    getReq,
    postReq,
    deleteReq
};