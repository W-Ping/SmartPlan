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

async function getUserByKeyword(ctx, next) {
    let {keyword} = ctx.params;
    await  mysql(CNF.DB_TABLE.user_info).select("uid", "nickName", "realName", "avatarUrl").where("status", 0).andWhere(function () {
        this.where("nickName", "like", "%" + keyword + "%").orWhere("realName", "like", "%" + keyword + "%")
    }).then(res => {
        SUCCESS(ctx, res);
    })
}

function getUserByOpenId(open_id) {
    return mysql(CNF.DB_TABLE.user_info).select("*").where({open_id, status: 0}).first();
}

/**
 *
 * @param uid
 * @param relation_uid
 * @param updateInfo
 * @returns {*|Promise<any>|PromiseLike<T>|Promise<T>}
 */
function saveOrUpdateBindUser(uid, relation_uid, updateInfo) {
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
                if (updateInfo.status && (updateInfo.status == 1 || updateInfo.status == 0)) {
                    up.status = updateInfo.status
                }
                up.update_time = nowTime;
                return mysql(CNF.DB_TABLE.user_relation_info).update(up).where('id', res.id).then(res => {
                    console.log("update userRelationInfo", res);
                    return Promise.resolve({code: 1, msg: '用户关系更新成功'});
                }).catch(e => {
                    debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_UPDATE_TO_DB, e)
                    throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_UPDATE_TO_DB}\n${e}`)
                })
            } else {
                console.log(uid, relation_uid, "用户关系已经绑定");
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
                    console.log("insert userRelationInfo", res);
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
 *
 * @param ctx
 * @param next
 * @returns {*|Promise<any>|PromiseLike<T>|Promise<T>}
 */
function getRelationUserList(ctx, next) {
    let params = ctx.request.body;//params 是查询好友参数
    let status = params && params.status || 0;
    let userInfo = ctx.state.$sysInfo.userinfo;
    return mysql(CNF.DB_TABLE.user_info).distinct(CNF.DB_TABLE.user_info + ".uid", "avatarUrl", "nickName", "realName", CNF.DB_TABLE.user_relation_info + ".relation_lable").select().innerJoin(CNF.DB_TABLE.user_relation_info, function () {
        this.on(CNF.DB_TABLE.user_info + '.uid', '=', CNF.DB_TABLE.user_relation_info + '.relation_uid')
    }).andWhere(CNF.DB_TABLE.user_relation_info + ".uid", userInfo.uid).andWhere(CNF.DB_TABLE.user_relation_info + ".status", status).andWhere(function () {
        if (params && params.uid) {
            this.where(CNF.DB_TABLE.user_info + ".uid", params.uid)
        }
    }).then(res => {
        SUCCESS(ctx, res)
        // return Promise.resolve({code: 1, data: res});
    }).catch(e => {
        debug('%s: %O', ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB, e)
        throw new Error(`${ERRORS_BIZ.DBERR.BIZ_ERR_WHEN_SELECT_TO_DB}\n${e}`)
    })

}

/**
 *  更新好友新
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function updateUserRelation(ctx, next) {
    let params = ctx.request.body;
    if (!params || !params.relation_uid) {
        FAILED(ctx, 'relation_uid is null');
        return
    }
    let relation_uid = params.relation_uid;
    let userInfo = ctx.state.$sysInfo.userinfo;
    let updateInfo = {};
    if (params.relation_phone) {
        updateInfo.relation_phone = params.relation_phone;
    }
    if (params.relation_lable) {
        updateInfo.relation_lable = params.relation_lable;
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

async function getRelationUserDetail(ctx, next) {
    const {uid} = ctx.query;
    await mysql(CNF.DB_TABLE.user_info).select(CNF.DB_TABLE.user_info + ".*", CNF.DB_TABLE.user_relation_info + ".relation_lable",CNF.DB_TABLE.user_relation_info + ".relation_phone").innerJoin(CNF.DB_TABLE.user_relation_info, function () {
        this.on(CNF.DB_TABLE.user_info + '.uid', '=', CNF.DB_TABLE.user_relation_info + '.relation_uid')
    }).andWhere(CNF.DB_TABLE.user_relation_info + ".relation_uid", uid).andWhere(CNF.DB_TABLE.user_relation_info + ".status", 0).first().then(res => {
        SUCCESS(ctx, res)
        // return Promise.resolve({code: 1, data: res});
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
    saveOrUpdateBindUser,
    getRelationUserList,
    getRelationUserDetail,
    updateUserRelation,
    getUserByKeyword,
}
