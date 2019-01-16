// client/pages/friend/friend.js
const request = require("../../utils/request.js")
var config = require('../../config')
const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        relationUserList: [],
        userInfo: {},
        portrait_temp: '',
        qrcode_temp: '',
        qrcode_url: '',
        imageUrl: '',
        windowHeight: 300,
        searchResult: []
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true
        })
        request.postReq(config.service.getRelationUserList, null, res => {
            if (res.code == 1) {
                this.setData({
                    relationUserList: res.data,
                })
            }
        })
        this.setData({
            userInfo: app.globalData.userInfo,
            windowHeight: app.globalData.phoneInfo.windowHeight
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.downloadFile();
        this.searchbar = this.selectComponent("#search");
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        wx.showShareMenu({
            withShareTicket: true
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
    onShareAppMessage: function (res) {
        console.log(res);
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: (app.globalData.userInfo.nickName || '我') + ' 请您来做他的目标监督人',
            path: 'pages/friend_bind/friend_bind',
            imageUrl: this.data.imageUrl,
            success: function (res) {
                // 转发成功
                console.log("转发成功", res);
                wx.showToast({
                    title: '分享成功',
                })
            },
            fail: function (res) {
                // 转发失败
                console.log("转发失败", res);
            }
        }
    },
    downloadFile: function () {
        var that = this;
        var url = app.globalData.userInfo.avatarUrl;
        console.log("头像地址", url);
        wx.downloadFile({
            url: url,
            success: function (res1) {
                console.log(res1);
                //缓存头像图片
                that.setData({
                    portrait_temp: res1.tempFilePath
                })
                //缓存canvas绘制小程序二维码
                wx.downloadFile({
                    url: config.service.getwxacodeunlimit + "?uid=999",
                    success: function (res2) {
                        console.log('二维码：' + res2.tempFilePath)
                        //缓存二维码
                        that.setData({
                            qrcode_temp: res2.tempFilePath
                        })
                        console.log('开始绘制图片')
                        that.drawImage();
                        wx.hideLoading();
                        setTimeout(function () {
                            that.canvasToImage()
                        }, 200)
                    }
                })
            }
        })
    },
    drawImage: function () {
        //绘制canvas图片
        var that = this
        const ctx = wx.createCanvasContext('myCanvas')
        var bgPath = '../../images/背景.png';
        // var bgPath = '../../images/背景.png';
        var portraitPath = that.data.portrait_temp; //头像
        var hostNickname = app.globalData.userInfo.nickName //昵称

        var qrPath = that.data.qrcode_temp; //二维码
        var windowWidth = app.globalData.phoneInfo.windowWidth; //手机屏幕宽度
        that.setData({
            scale: 1.6
        })
        //绘制背景图片
        ctx.drawImage(bgPath, 0, 0, windowWidth, that.data.scale * windowWidth)
        //绘制头像
        ctx.save()
        ctx.beginPath()
        ctx.arc(windowWidth / 2, 0.32 * windowWidth, 0.15 * windowWidth, 0, 2 * Math.PI);
        ctx.clip()
        ctx.drawImage(portraitPath, 0.7 * windowWidth / 2, 0.17 * windowWidth, 0.3 * windowWidth, 0.3 * windowWidth)
        ctx.restore()
        //绘制第一段文本
        ctx.setFillStyle('#ffffff')
        ctx.setFontSize(0.037 * windowWidth)
        ctx.setTextAlign('center')
        ctx.fillText(hostNickname, windowWidth / 2, 0.52 * windowWidth)
        //绘制第二段文本
        ctx.setFillStyle('#ffffff')
        ctx.setFontSize(0.037 * windowWidth)
        ctx.setTextAlign('center')
        ctx.fillText('邀您一起来制定7天小目标', windowWidth / 2, 0.57 * windowWidth)
        //绘制二维码
        // ctx.drawImage(qrPath, 0.64 * windowWidth / 2, 0.65 * windowWidth, 0.36 * windowWidth, 0.36 * windowWidth)
        //绘制第三段文本
        // ctx.setFillStyle('#ffffff')
        // ctx.setFontSize(0.037 * windowWidth)
        // ctx.setTextAlign('center')
        // ctx.fillText('长按识别小程序码', windowWidth / 2, 1.10 * windowWidth)
        ctx.draw();
    },
    canvasToImage: function () {
        var that = this
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: that.data.windowWidth,
            height: that.data.windowWidth * that.data.scale,
            destWidth: that.data.windowWidth * 4,
            destHeight: that.data.windowWidth * 4 * that.data.scale,
            canvasId: 'myCanvas',
            success: function (res) {
                console.log('朋友圈分享图生成成功:' + res.tempFilePath)
                // wx.previewImage({
                //   current: res.tempFilePath, // 当前显示图片的http链接
                //   urls: [res.tempFilePath] // 需要预览的图片http链接列表
                // })
                that.setData({
                    imageUrl: res.tempFilePath
                })
            },
            fail: function (err) {
                console.log('失败')
                console.log(err)
            }
        })
    },
    navigatorDetail: function (e) {
        var uid = e.currentTarget.dataset.uid;
        wx.navigateTo({
            url: 'friend_detail?uid=' + uid,
        })
    },
    inputConfirm: function (e) {
        console.log("search inputConfirm ", this.searchbar)
        var keyword = this.searchbar.data.keyword;
        console.log("搜索关键字", keyword)
        var searchResult = [];
        for (var i = 0; i < 3; i++) {
            searchResult.push({
                url: "friend_detail?uid=UID00" + i,
                text: "小布" + i
            })
        }
        console.log("搜索关结果", searchResult);
        this.searchbar.setData({
            searchResult: searchResult
        })
    },
    inputChange: function (e) {
        console.log("search inputChange ", this.searchbar)
        var keyword = this.searchbar.data.keyword;
        var searchResult = [];
        for (var i = 0; i < 3; i++) {
            searchResult.push({
                url: "friend_detail?uid=UID00" + i,
                text: "小布" + i
            })
        }
        this.searchbar.setData({
            searchResult: searchResult
        })
    }
})