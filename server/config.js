const CONF = {
    port: '5757',
    rootPathname: '',

    // 微信小程序 App ID
    appId: 'wx1465f9a62bfea385',

    // 微信小程序 App Secret
    appSecret: '',

    // 是否使用腾讯云代理登录小程序
    useQcloudLogin: true,

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     * cAuth
     * lwp30801admin
     */
    mysql: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        db: 'cAuth',
        pass: 'lwp30801admin',
        char: 'utf8mb4'
    },

    cos: {
        /**
         * 地区简称
         * @查看 https://cloud.tencent.com/document/product/436/6224
         */
        region: 'ap-shanghai',
        // Bucket 名称
        fileBucket: 'file',
        imageBucket: 'image',
        videoBucket: 'video',
        // 文件夹
        uploadFolder: '',
        maxSize: 20, //最大文件限制，单位M
        /**
         * 判断文件类型
         * 为保证安全默认支持的文件类型有：
         * 图片：jpg jpg2000 git bmp png
         * 音频：mp3 m4a mp4
         * 文件：pdf
         */
        mimetypes: ['image/jpeg', 'image/jp2', 'image/jpm', 'image/jpx', 'image/gif', 'image/bmp', 'image/png', 'audio/mpeg', 'audio/mp3', 'video/mp4', 'audio/m4a', 'application/pdf']
    },

    serverHost: "https://taflgi5t.qcloud.la",
    tunnelServerUrl: "https://taflgi5t.qcloud.la",
    tunnelSignatureKey: "27fb7d1c161b7ca52d73cce0f1d833f9f5b5ec89",
    // 腾讯云相关配置可以查看云 API 秘钥控制台：https://console.cloud.tencent.com/capi
    qcloudAppId: "1256808148",
    qcloudSecretId: "AKIDLrGkTUPHkSo4EIGymRxRp38T2TlsqZAb",
    qcloudSecretKey: "ymRvMenkWxKXZRDpJbmphRzN5c1GKDvS",
    // 微信登录态有效期
    wxLoginExpires: 7200,
    wxMessageToken: 'abcdefgh'
}

module.exports = CONF
