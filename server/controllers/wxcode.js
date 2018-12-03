const {uploader} = require('../qcloud')
const {WX_A PI} = require('../wxapi')
const https = require('https');
var iconv = require("iconv-lite");

/**
 *  获取小程序二维码
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function getWXAQRCode(ctx, next) {
    console.log(ctx);
    var i = 49;
    var url = WX_API.getAccessToken + "&appid=wx1465f9a62bfea385" + "secret=7d68daf0fd22f23d280bfa17d09a9618";
      https.get(url, (res) => {
          var datas = [];
          var size = 0;
          res.on('data', function (data) {
              datas.push(data);
              size += data.length;
              //process.stdout.write(data);
          });
          res.on("end", function () {
              var buff = Buffer.concat(datas, size);
              var result = iconv.decode(buff, "utf8");//转码//var result = buff.toString();//不需要转编码,直接tostring
              console.log(result);
          });
      }).on("error", function (err) {
          // Logger.error(err.stack)
      });
}

/**
 * 获取小程序码
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function getWXACode(ctx, next) {
    console.log(ctx);
}

module.exports = {getWXAQRCode, getWXACode}