const WX_API = {
    /**
     * 获取小程序二维码 通过该接口生成的小程序码，永久有效，有数量限制
     */
    createwxaqrcode: "https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode",
    /**
     * 获取小程序码 通过该接口生成的小程序码，永久有效，有数量限制
     */
    getwxacode: "https://api.weixin.qq.com/wxa/getwxacode",
    /**
     * 获取小程序码 通过该接口生成的小程序码，永久有效，数量暂无限制
     */
    getwxacodeunlimit: "https://api.weixin.qq.com/wxa/getwxacodeunlimit",
    /*
     * 获取 access_token
     */
    getAccessToken: "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential",
    /**
     * 获取用户 access_token
     */
    getSNSAccessToken: "https://api.weixin.qq.com/sns/userinfo",

    sendTemplate: "https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send",
}
const MESSAGE_TEMP = {
    notifyRemindTemplate: 'GFU24H1U4dpyxPtebi9dCQdxn1JPE6F8nymj8pZz0Wg'
}
module.exports = {WX_API, MESSAGE_TEMP}