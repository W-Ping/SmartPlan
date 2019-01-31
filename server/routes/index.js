/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const {auth: {authorizationMiddleware, validationMiddleware}} = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)

// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)
// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)

router.post('/template/notify', controllers.template.notifyRemindTemplate)
//获取小程序二维码
// router.get('/createwxaqrcode', controllers.wxcode.createwxaqrcode)
//获取小程序码
// router.get('/getwxacode', controllers.wxcode.getwxacode)
//获取小程序码
// router.get('/getwxacodeunlimit', controllers.wxcode.getwxacodeunlimit)
//用户信息
router.get('/userinfo/get', controllers.userinfo.get)
router.post('/userinfo/update', controllers.userinfo.update)
//计划信息
router.post('/plan/save', controllers.plan.saveOrUpdatePlanInfo)
router.get('/plan/get', controllers.plan.getPlanInfo)
router.get('/plan/last/get', controllers.plan.getLastPlanInfo)
router.post('/plan/query', controllers.plan.queryPlanInfo)
router.post('/plan/list/query', controllers.plan.getPlanInfoStat)
router.post('/plan/detail/query', controllers.plan.query)
router.get('/plan/detail/get', controllers.plan.get)
router.post('/plan/detail/save', controllers.plan.save)
router.post('/plan/detail/update', controllers.plan.update)
router.delete('/plan/detail/del', controllers.plan.del)
router.get('/plan/relation/get', controllers.plan.getRelationPlanDetail)
router.post('/plan/detail/topIndex', controllers.plan.topIndex)
router.post('/plan/detail/progress/add', controllers.plan.addProgress)
router.post('/plan/detail/start', controllers.plan.startPlanDetailInfo)

router.post('/share/user/get', controllers.share.getShareInfo)
router.get('/share/user/get/:uid', controllers.share.getShareInfoByUid)
router.post('/share/user/bind', controllers.share.bindShareUser)

router.post('/user/relation/get', controllers.userinfo.getRelationUserList)
router.get('/user/info/get/:keyword', controllers.userinfo.getUserByKeyword)
router.get('/user/detail/relation/get', controllers.userinfo.getRelationUserDetail)
router.post('/user/relation/update', controllers.userinfo.updateUserRelation)
router.get('/user/share/relation/check', controllers.share.checkUserRelation)

router.post('/clock/rule/save', controllers.clock.saveClockRuleInfo)
router.get('/clock/rule/get', controllers.clock.getClockRuleInfo)
router.post('/clock/save', controllers.clock.save)
router.get('/clock/get', controllers.clock.get)
router.post('/clock/record/get', controllers.clock.getClockRuleRecord)
router.post('/clock/record/supplement', controllers.clock.supplementClockRecord)


router.post('/note/update', controllers.note.update)
router.post('/note/save', controllers.note.save)
router.post('/note/query', controllers.note.query)
router.get('/note/get', controllers.note.get)
router.delete('/note/del', controllers.note.deleteNote)
router.get('/note/remind/count', controllers.note.getRemindNoteCount)
router.get('/note/remind/query', controllers.note.getRemindNoteList)


router.post('/werun/get', controllers.werun.getUserWeRunInfo)




module.exports = router
