// client/pages/notepad/notepad.js
const request = require("../../utils/request")
const config = require('../../config')
const util = require('../../utils/util')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        notpadList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.msgModal = this.selectComponent("#msgModal");
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // util.showBusy("查询...")
        request.postReq(config.service.getNoteInfoList, null, res => {
            if (res.code == 1) {
                this.setData({
                    notpadList: res.data
                })
            }
        }, null, function () {
            // wx.hideToast();
        })
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
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    navigateToAdd: function (e) {
        wx.navigateTo({
            url: 'notepad_add',
        })
    },
    openMsgModal: function (e) {
        var index = e.currentTarget.dataset.index;
        var notepad = this.data.notpadList[index];
        var info = {};
        info.index = index;
        info.id = notepad.id;
        info.title = notepad.note_title;
        info.content = notepad.note_content;
        this.msgModal.showModal(e, info);
    },
    confirmDelete: function (e) {
        var index = this.msgModal.data.index;
        var id = this.msgModal.data.id;
        request.deleteNoConfirmReq(config.service.deletedNoteInfo, "id=" + id, res => {
            if (res.code == 1) {
                this.data.notpadList.splice(this.msgModal.data.index, 1);
                this.setData({
                    notpadList: this.data.notpadList
                })
            }
        })

    },
})