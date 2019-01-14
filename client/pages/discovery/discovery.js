// client/pages/discovery/discovery.js
const sliderWidth = 96;
const request = require("../../utils/request")
const config = require('../../config')
const util = require('../../utils/util')
const app = new getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: ["我的目标", "好友目标"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        myselfPlanList: [],
        friendPlanList: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var phoneInfo = app.globalData.phoneInfo;
        console.log("phoneInfo", phoneInfo);
        if (!phoneInfo) {
            wx.getSystemInfo({
                success: res => {
                    phoneInfo = res;
                    app.globalData.phoneInfo = res;
                }
            });
        }
        this.queryPlanList("myselfPlanList")
        this.setData({
            sliderLeft: (phoneInfo.windowWidth / this.data.tabs.length - sliderWidth) / 2,
            sliderOffset: phoneInfo.windowWidth / this.data.tabs.length * this.data.activeIndex
        });


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
        return {
            title: (app.globalData.userInfo.nickName || '我') + '的火星计划',
            path: 'pages/discovery/discovery?openid=999999999',
            // imageUrl: this.data.imageUrl,
            success: function(res) {
                // 转发成功
                console.log("转发成功", res);
                wx.showToast({
                    title: '分享成功',
                })
                wx.showShareMenu({
                    // 要求小程序返回分享目标信息
                    withShareTicket: true
                });
            },
            fail: function(res) {
                // 转发失败
                console.log("转发失败", res);
            }
        }

    },
    swtichBar: function (e) {
        var id = e.currentTarget.id;
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: id
        });
        if (id == 0) {
            this.queryPlanList("myselfPlanList");
        } else if (id == 1) {
            this.queryPlanList("friendPlanList", {type: 1});
        }
    },
    onClickPlan: function (e) {
        var pNo = e.currentTarget.dataset.pno;
        wx.navigateTo({
            url: '../plan/plan_page?tp=' + this.data.activeIndex + '&pNo=' + pNo,
        })
    },
    queryPlanList: function (queryType, condition) {
        console.log(queryType)
        request.postReq(config.service.queryPlanInfo, condition, res => {
            if (res.code == 1 && res.data) {
                res.data.forEach(function (item, i) {
                    item.start_time = util.formatUnixTime(item.start_time, "Y.M.D");
                    item.end_time = util.formatUnixTime(item.end_time, "Y.M.D");
                })
                var result = {};
                result[queryType] = res.data;
                this.setData(result);
            }
        })
    }
})