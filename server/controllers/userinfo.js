const {mysql} = require("../qcloud");
const debug = require('debug');
const uuidGenerator = require('uuid/v1')
const {SUCCESS, FAILED, CNF, ERRORS_BIZ} = require("./constants")
const util = require('../tools/util')


/**
 * 更新用户信息
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function update(ctx, next) {
    const condition = ctx.request.body;
    const uid = condition.uid;
    await mysql(CNF.DB_TABLE.user_info).update(condition).where({uid}).then(async res => {
        SUCCESS(ctx, res)
    }).catch(e => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_UPDATE_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_UPDATE_TO_DB}\n${e}`)
    })
}

/**
 * 获取用户信息
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function get(ctx, next) {
    const {uid} = ctx.query;
    await mysql(CNF.DB_TABLE.user_info).select('*').where({uid}).first().then(async res => {
        SUCCESS(ctx, res)
    }).catch(e => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB}\n${e}`)
    })
}

/**
 *  查询用户
 * @param uid
 * @returns {*}
 */
function getUserInfoByUid(uid) {
    if (!uid) throw new Error(ERRORS.DBERR.BIZ_ERR_NO_UID_ON_CALL_GETUSERINFOFUNCTION);
    return mysql(CNF.DB_TABLE.user_info).select('uid', 'nickName', 'realName', 'avatarUrl').where("uid", uid).first();
}

/***
 *  登录 创建/更新用户信息
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
function updateWithLogin(userInfo) {
    var userInfo = userInfo.userinfo || {};
    var nowTime = util.nowTime();
    var open_id = userInfo.openId;
    return mysql(CNF.DB_TABLE.user_info).select('version', 'uid').where({open_id}).first()
        .then(res => {
            //如果存在就更新
            if (res) {
                var updateUserInfo = {};
                updateUserInfo.version = res.version + 1;
                updateUserInfo.nickName = userInfo.nickName;
                updateUserInfo.gender = userInfo.gender;
                updateUserInfo.avatarUrl = userInfo.avatarUrl;
                updateUserInfo.update_time = userInfo.nowTime;
                //设置uid
                userInfo.uid = res.uid;
                return mysql(CNF.DB_TABLE.user_info).update(updateUserInfo).where({open_id});
            } else {
                //获取最新的用户
                return mysql(CNF.DB_TABLE.user_info).select('uid').orderBy('create_time', 'desc').first()
                    .then(lastUser => {
                        var newUserInfo = {};
                        const uid = util.generateUid(CNF.UID_PREFIX, lastUser ? lastUser.uid : null);
                        newUserInfo.id = uuidGenerator().replace(/-/g, '');
                        newUserInfo.nickName = userInfo.nickName;
                        newUserInfo.open_id = open_id;
                        newUserInfo.province = userInfo.province;
                        newUserInfo.city = userInfo.city;
                        newUserInfo.country = userInfo.country;
                        newUserInfo.avatarUrl = userInfo.avatarUrl;
                        newUserInfo.gender = userInfo.gender;
                        newUserInfo.uid = uid
                        newUserInfo.version = 0;
                        newUserInfo.update_time = nowTime;
                        newUserInfo.create_time = nowTime;
                        //设置uid
                        userInfo.uid = uid;
                        return mysql(CNF.DB_TABLE.user_info).insert(newUserInfo);
                    })
            }
        }).then(() => {
            return Promise.resolve(userInfo)
        }).catch((e) => {
            debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_INSERT_TO_DB, e)
            throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_INSERT_TO_DB}\n${e}`)
        });
}

/**
 *  用户好友查询
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function getUserByKeyword(ctx, next) {
    let {keyword} = ctx.params;
    let userInfo = ctx.state.$sysInfo.userinfo;
    await  mysql(CNF.DB_TABLE.user_info).select("uid", "nickName", "realName", "avatarUrl").where("status", 0).andWhere(function () {
        this.where("nickName", "like", "%" + keyword + "%").orWhere("realName", "like", "%" + keyword + "%")
    }).whereExists(function () {
        this.select('id').from(CNF.DB_TABLE.user_relation_info).whereRaw(CNF.DB_TABLE.user_relation_info + '.relation_uid = ' + CNF.DB_TABLE.user_info + '.uid').andWhere("uid", userInfo.uid).andWhere('status', 0)
    }).then(res => {
        SUCCESS(ctx, res);
    }).catch((e) => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB}\n${e}`)
    })
}

/**
 *
 * @param open_id
 * @returns {Promise<any> | Promise<T>}
 */
function getUserByOpenId(open_id) {
    return mysql(CNF.DB_TABLE.user_info).select("*").where({open_id, status: 0}).first().catch(e => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB}\n${e}`)
    });
}

/**
 * 保存或绑定好友信息
 * @param uid
 * @param relation_uid
 * @param updateInfo
 * @returns {*|Promise<any>|PromiseLike<T>|Promise<T>}
 */
function saveBindRelationUser(uid, relation_uid, updateInfo) {
    let nowTime = util.nowTime();
    return mysql(CNF.DB_TABLE.user_relation_info).select("id").where({
        uid: uid,
        relation_uid: relation_uid
    }).first().then(res => {
        if (res && res.id) {
            if (updateInfo) {
                let up = {};
                if (updateInfo.relation_lable) {
                    up.relation_lable = updateInfo.relation_lable;
                }
                if (updateInfo.relation_phone) {
                    up.relation_phone = updateInfo.relation_lable;
                }
                up.status = 0
                up.update_time = nowTime;
                return mysql(CNF.DB_TABLE.user_relation_info).update(up).where('id', res.id).then(res => {
                    return Promise.resolve({code: 1, msg: '用户关系更新成功'});
                }).catch(e => {
                    debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_UPDATE_TO_DB, e)
                    throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_UPDATE_TO_DB}\n${e}`)
                })
            } else {
                return Promise.resolve({code: 1, msg: '用户关系已经绑定'});
            }
        } else {
            return mysql(CNF.DB_TABLE.user_relation_info).select("id").first().where({
                uid: relation_uid,
                relation_uid: uid
            }).then(res => {
                let userRelationInfoArr = [];
                if (!res || !res.id) {
                    let userRelationInfo1 = {};
                    userRelationInfo1.id = uuidGenerator().replace(/-/g, '');
                    userRelationInfo1.status = 0;
                    userRelationInfo1.relation_uid = uid;
                    userRelationInfo1.uid = relation_uid
                    userRelationInfo1.relation_lable = CNF.USER_RELATION.Friend;
                    userRelationInfo1.create_time = nowTime;
                    userRelationInfo1.update_time = nowTime;
                    userRelationInfo1.inviter_uid = relation_uid;
                    userRelationInfoArr.push(userRelationInfo1)
                }
                let userRelationInfo2 = {};
                userRelationInfo2.id = uuidGenerator().replace(/-/g, '');
                userRelationInfo2.status = 0;
                userRelationInfo2.relation_uid = relation_uid;
                userRelationInfo2.uid = uid;
                userRelationInfo2.relation_lable = CNF.USER_RELATION.Friend;
                userRelationInfo2.create_time = nowTime;
                userRelationInfo2.update_time = nowTime;
                userRelationInfo2.inviter_uid = relation_uid;
                if (updateInfo && updateInfo.mobile_phone) {
                    userRelationInfo2.relation_phone = updateInfo.mobile_phone;
                }
                userRelationInfoArr.push(userRelationInfo2)
                return mysql(CNF.DB_TABLE.user_relation_info).insert(userRelationInfoArr).then(res => {
                    return Promise.resolve({code: 1, msg: '用户关系绑定成功'});
                }).catch(e => {
                    debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_INSERT_TO_DB, e)
                    throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_INSERT_TO_DB}\n${e}`)
                })
            })
        }
    })
}

/**
 * 获取好友信息列表
 * @param ctx
 * @param next
 * @returns {*|Promise<any>|PromiseLike<T>|Promise<T>}
 */
async function getRelationUserList(ctx, next) {
    let params = ctx.request.body;//params 是查询好友参数
    let status = params && params.status || 0;
    let userInfo = ctx.state.$sysInfo.userinfo;
    let sql = mysql.raw("SELECT  usr.*,us.avatarUrl, us.nickName, us.realName FROM cauth.user_info AS us " +
        "INNER JOIN (SELECT DISTINCT uid, relation_uid, status, inviter_uid, relation_lable, relation_mail, relation_name, relation_phone FROM cauth.user_relation_info where `status`=0) AS usr ON us.uid=usr.relation_uid ").wrap('(', ') tmp');
    await mysql.select('*').from(sql).where('tmp.uid', userInfo.uid).andWhere(function () {
        if (params.refUid) {
            this.where('tmp.relation_uid', params.refUid)
        }
    }).then(res => {
        SUCCESS(ctx, res)
    }).catch(e => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB}\n${e}`)
    })
}

/**
 *  更新好友信息
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function updateUserRelation(ctx, next) {
    let params = ctx.request.body;
    if (!params || !params.relation_uid) throw new Error("relation_uid is null");
    let relation_uid = params.relation_uid;
    let userInfo = ctx.state.$sysInfo.userinfo;
    let updateInfo = {};
    if (params.relation_phone) {
        updateInfo.relation_phone = params.relation_phone;
    }
    if (params.relation_lable) {
        updateInfo.relation_lable = params.relation_lable;
    }
    if (params.relation_mail) {
        updateInfo.relation_mail = params.relation_mail;
    }
    if (params.relation_name) {
        updateInfo.relation_name = params.relation_name;
    }
    if (params.status) {
        updateInfo.status = params.status;
    }
    updateInfo.update_time = util.nowTime();
    await mysql(CNF.DB_TABLE.user_relation_info).update(updateInfo).where({
        uid: userInfo.uid,
        relation_uid: relation_uid
    }).then(res => {
        SUCCESS(ctx, res);
    }).catch(e => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_UPDATE_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_UPDATE_TO_DB}\n${e}`)
    })
}

/**
 *  获取好友信息明细
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function getRelationUserDetail(ctx, next) {
    let {refUid} = ctx.query;
    let userInfo = ctx.state.$sysInfo.userinfo;
    await mysql(CNF.DB_TABLE.user_info).select(CNF.DB_TABLE.user_info + ".*", CNF.DB_TABLE.user_relation_info + ".relation_lable", CNF.DB_TABLE.user_relation_info + ".relation_name", CNF.DB_TABLE.user_relation_info + ".relation_phone", CNF.DB_TABLE.user_relation_info + ".relation_mail").innerJoin(CNF.DB_TABLE.user_relation_info, function () {
        this.on(CNF.DB_TABLE.user_info + '.uid', '=', CNF.DB_TABLE.user_relation_info + '.relation_uid')
    }).andWhere(CNF.DB_TABLE.user_relation_info + ".relation_uid", refUid).andWhere(CNF.DB_TABLE.user_relation_info + '.uid', userInfo.uid).andWhere(CNF.DB_TABLE.user_relation_info + ".status", 0).first().then(res => {
        SUCCESS(ctx, res)
    }).catch(e => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB}\n${e}`)
    })
}

module.exports = {
    get,
    update,
    updateWithLogin,
    getUserByOpenId,
    getUserInfoByUid,
    saveBindRelationUser,
    getRelationUserList,
    getRelationUserDetail,
    updateUserRelation,
    getUserByKeyword,
}
