// 此处主机域名修改成腾讯云解决方案分配的域名

// var host = 'https://taflgi5t.qcloud.la';
// var host = 'https://745390919.smalldiary.club';
var host = 'http://127.0.0.1:5757';
var config = {
    default_page: '../discovery/discovery',
    boot_page: './pages/boot/boot',

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
        getLastPlanInfo: `${host}/weapp/plan/last/get`,
        savePlanDetailInfo: `${host}/weapp/plan/detail/save`,
        updatePlanDetailInfo: `${host}/weapp/plan/detail/update`,
        topIndex: `${host}/weapp/plan/detail/topIndex`,
        getPlanDetailInfo: `${host}/weapp/plan/detail/get`,
        delPlanDetailInfo: `${host}/weapp/plan/detail/del`,
        queryPlanDetailInfo: `${host}/weapp/plan/detail/query`,
        queryPlanInfo: `${host}/weapp/plan/query`,
        getPlanInfoStat: `${host}/weapp/plan/list/query`,
        startPlanDetailInfo: `${host}/weapp/plan/detail/start`,
        addPlanProgress: `${host}/weapp/plan/detail/progress/add`,
        getShareInfo: `${host}/weapp/share/user/get`,
        getShareInfoByUid: `${host}/weapp/share/user/get`,
        bindShareUser: `${host}/weapp/share/user/bind`,
        getRelationUserList: `${host}/weapp/user/relation/get`,
        getRelationUserDetail: `${host}/weapp/user/detail/relation/get`,
        getRelationPlanDetail: `${host}/weapp/plan/relation/get`,
        checkUserRelation: `${host}/weapp/user/share/relation/check`,
        updateUserRelation: `${host}/weapp/user/relation/update`,
        getUserByKeyword: `${host}/weapp/user/info/get`,
        saveClockRecord: `${host}/weapp/clock/save`,
        getClockRecord: `${host}/weapp/clock/get`,
        getClockRuleInfo: `${host}/weapp/clock/rule/get`,
        saveClockRuleInfo: `${host}/weapp/clock/rule/save`,
        getClockRuleRecord: `${host}/weapp/clock/record/get`,
        supplementClockRecord: `${host}/weapp/clock/record/supplement`,
        saveNoteInfo: `${host}/weapp/note/save`,
        updateNoteInfo: `${host}/weapp/note/update`,
        deletedNoteInfo: `${host}/weapp/note/del`,
        getNoteInfo: `${host}/weapp/note/get`,
        getNoteInfoList: `${host}/weapp/note/query`,
        getRemindNoteCount: `${host}/weapp/note/remind/count`,
        getRemindNoteList: `${host}/weapp/note/remind/query`,
    }
};

module.exports = config;