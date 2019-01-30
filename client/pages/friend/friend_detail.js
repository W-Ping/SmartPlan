// client/pages/friend/friend_detail.js
const request = require("../../utils/request.js")
var config = require('../../config')
const util = require('../../utils/util')
var app = new getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        friendInfo: {},
        planInfoList: [],
        hidden: true,
        mailHidden: true,
        mobilePhone: '',
        mail: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var refUid = options.refUid;
        request.getReq(config.service.getRelationUserDetail, "refUid=" + refUid, res => {
            if (res && res.code == 1) {
                var friendInfo = res.data;
                this.setData({
                    friendInfo: friendInfo,
                    mobilePhone: friendInfo.relation_phone ? friendInfo.relation_phone : '',
                    mail: friendInfo.relation_mail ? friendInfo.relation_mail : ''
                })
            }
        })
        request.getReq(config.service.getRelationPlanDetail, "rUid=" + refUid + "&pNum=" + 0 + "&pSize=" + 3, res => {
            if (res && res.code == 1) {
                this.setData({
                    planInfoList: res.data
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    previewImage: function (e) {
        var url = e.currentTarget.dataset.avatar;
        wx.previewImage({
            urls: [url],
        })
    },
    focusPhone: function (e) {
        this.setData({
            hidden: false,
        })
    },
    blurPhone: function (e) {
        this.setData({
            hidden: true,
        })
    },
    inputPhone: function (e) {
        this.setData({
            mobilePhone: e.detail.value
        })
    },
    inputMail: function (e) {
        this.setData({
            mail: e.detail.value
        })
    },
    focusMail: function (e) {
        this.setData({
            mailHidden: false,
        })
    },
    blurMail: function (e) {
        this.setData({
            mailHidden: true,
        })
    },
    inputMail: function (e) {
        this.setData({
            mail: e.detail.value
        })
    },
    addFriendMobilePhone: function (e) {
        var mobilePhone = this.data.mobilePhone;
        if (!mobilePhone) {
            util.showNone("填写电话号码");
            return;
        }
        var friendInfo = this.data.friendInfo;
        friendInfo.relation_phone = mobilePhone;
        request.postReq(config.service.updateUserRelation, {
            relation_uid: friendInfo.uid,
            relation_phone: mobilePhone
        }, res => {
            if (res.code == 1) {
                util.showSuccess("添加电话成功")
                this.setData({
                    mobilePhone: mobilePhone,
                    friendInfo: friendInfo,
                    hidden: true
                });
            } else {
                util.showNone("添加电话失败")
            }
        })
    },
    addFriendMail: function (e) {
        var mail = this.data.mail;
        if (!mail) {
            util.showNone("填写联系邮件");
            return;
        }
        var friendInfo = this.data.friendInfo;
        friendInfo.relation_mail = mail;
        request.postReq(config.service.updateUserRelation, {
            relation_uid: friendInfo.uid,
            relation_mail: mail
        }, res => {
            if (res.code == 1) {
                util.showSuccess("添加邮件成功")
                this.setData({
                    mail: mail,
                    friendInfo: friendInfo,
                    mailHidden: true
                });
            } else {
                util.showNone("添加联系邮件失败")
            }
        })
    },
    clickAddPhone: function (e) {
        this.setData({
            hidden: !this.data.hidden
        })
    },
    clickAddMail: function (e) {
        this.setData({
            mailHidden: !this.data.mailHidden
        })
    },
    callingMobilePhone: function (e) {
        var mobilePhone = this.data.mobilePhone
        console.log("拨打电话：", mobilePhone);
        if (!mobilePhone) {
            wx.showToast({
                icon: 'none',
                title: '请添加电话号码',
            })
        } else {
            wx.makePhoneCall({
                phoneNumber: mobilePhone,
                success: function () {
                    console.log("拨打电话成功！", mobilePhone);
                },
                fail: function () {
                    console.log("拨打电话失败！", mobilePhone);
                }
            })
        }
    },
    navigatorToRelation: function (e) {
        util.showNone("暂不支持")
    },
    deleteRealtionUser: function (e) {
      var friendInfo = this.data.friendInfo;
      var refUid = friendInfo.uid;
        wx.showModal({
          title:'确定删除？',
          content: "您要将好友 '"+friendInfo.nickName+"' 删除",
            success: function (res) {
                if (res.confirm) {
                  request.postReq(config.service.updateUserRelation, {relation_uid: refUid, status: -1}, res => {
                        if (res.code == 1) {
                            wx.navigateBack({
                                delta: 1
                            })
                        }
                    })
                }
            }
        })
    }
})