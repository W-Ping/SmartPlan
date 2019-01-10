/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名

// var host = 'https://taflgi5t.qcloud.la';
var host = 'http://127.0.0.1:5757';
var config = {
    default_page: '../plan/plan',

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/weapp/user`,

        // 测试的信道服务地址
        tunnelUrl: `${host}/weapp/tunnel`,

        // 上传图片接口
        uploadUrl: `${host}/weapp/upload`,
        //获取小程序二维码
        createwxaqrcode: `${host}/weapp/createwxaqrcode`,
        ///获取小程序码
        getwxacodeunlimit: `${host}/weapp/getwxacodeunlimit`,
        //获取小程序码 （菊花码）
        getwxacode: `${host}/weapp/getwxacode`,
        //获取用户信息
        getUserInfo: `${host}/weapp/userinfo/get`,
        //更新用户信息
        updateUserInfo: `${host}/weapp/userinfo/update`,
        //计划信息
        getPlanInfo: `${host}/weapp/plan/get`,
        savePlanDetailInfo: `${host}/weapp/plan/detail/save`,
        updatePlanDetailInfo: `${host}/weapp/plan/detail/update`,
        topIndex: `${host}/weapp/plan/detail/topIndex`,
        getPlanDetailInfo: `${host}/weapp/plan/detail/get`,
        delPlanDetailInfo: `${host}/weapp/plan/detail/del`,
        queryPlanDetailInfo: `${host}/weapp/plan/detail/query`,
    }
};

module.exports = config;