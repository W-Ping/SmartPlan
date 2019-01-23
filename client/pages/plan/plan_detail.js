// client/pages/plan/plan_detail.js

const request = require("../../utils/request")
const config = require('../../config')
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    planDetailInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var pdNo = options.pdNo;
    request.getReq(config.service.getPlanDetailInfo, "pdNo=" + pdNo, res => {
      if (res.code == 1) {
        var pdInfo = res.data.planDetailInfo;
        var planDetailInfo = {};
        planDetailInfo.plan_detail_name = pdInfo.plan_detail_name;
        planDetailInfo.avatarUrl = pdInfo.avatarUrl;
        planDetailInfo.plan_start_time = util.formatUnixTime(pdInfo.plan_start_time, "Y.M.D");
        planDetailInfo.plan_end_time = util.formatUnixTime(pdInfo.plan_end_time, "Y.M.D");
        planDetailInfo.plan_actual_start_time = util.formatUnixTime(pdInfo.plan_actual_start_time, "Y.M.D");
        planDetailInfo.plan_actual_end_time = util.formatUnixTime(pdInfo.plan_actual_end_time, "Y.M.D");
        planDetailInfo.remark = pdInfo.remark;
        planDetailInfo.progress = pdInfo.progress;
        planDetailInfo.creator_name = pdInfo.creator_name;
        this.setData({
          planDetailInfo: planDetailInfo
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

})