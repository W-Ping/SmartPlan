// client/pages/plan/plan_history.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    planList: [],
    year: new Date().getFullYear(), // 年份
    month: new Date().getMonth() + 1, // 月份
    day: new Date().getDate(),
    newPlanCount: 999,
    currFinishedPlanCount: 899,
    lastFinishedPlanCount: 200,

    demo5_days_style: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var date = options.date;
    var dateArr = date.split("."); //"2018.11"
    var year = parseInt(dateArr[0]);
    var month = parseInt(dateArr[1]);
    console.log("date...", date);
    var planList = [];
    for (var i = 0; i < 10; i++) {
      var createPlanList = [];
      var finishedPlanList = [];
      for (var j = 0; j < 4; j++) {
        var createPlan = {};
        createPlan.id = i;
        createPlan.content = "创建我的人额大师风范二创建我的人额大师风范二" + i;
        createPlan.auther = "王叔赫";
        createPlanList.push(createPlan);
      }
      for (var j = 0; j < 3; j++) {
        var finishedPlan = {};
        finishedPlan.id = i;
        finishedPlan.content = "完成我的人额大师风范二" + i;
        finishedPlan.auther = "王叔赫";
        finishedPlanList.push(createPlan);
      }
      planList.push({
        dateDate: '2018-12-' + (i + 1),
        createPlanList: createPlanList,
        finishedPlanList: finishedPlanList
      })
    }

    const days_count = new Date(year, month, 0).getDate();
    console.log("days_count", days_count);
    console.log("year", year);
    console.log("month", month);
    let demo5_days_style = new Array;
    for (let i = 1; i <= days_count; i++) {
      const date = new Date(year, month, i);
      if (date.getDay() == 0) {
        demo5_days_style.push({
          month: 'current',
          day: i,
          color: '#f488cd'
        });
      } else {
        demo5_days_style.push({
          month: 'current',
          day: i,
          color: '#a18ada'
        });
      }
    }
    demo5_days_style.push({
      month: 'current',
      day: 12,
      color: 'white',
      background: '#b49eeb'
    });
    demo5_days_style.push({
      month: 'current',
      day: 17,
      color: 'white',
      background: '#f5a8f0'
    });
    demo5_days_style.push({
      month: 'current',
      day: 20,
      color: 'white',
      background: '#aad4f5'
    });
    demo5_days_style.push({
      month: 'current',
      day: 25,
      color: 'white',
      background: '#84e7d0'
    });

    this.setData({
      year: year,
      month: month,
      demo5_days_style,
      planList: planList
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  dayClick: function(e) {
    console.log(e.detail);
    var dayObj = e.detail;
    var month = parseInt(dayObj.month) < 10 ? "0" + dayObj.month : dayObj.month;
    var day = parseInt(dayObj.day) < 10 ? "0" + dayObj.day : dayObj.day;
    wx.navigateTo({
      url: 'plan_history_detail?date=' + dayObj.year + "-" + month + "-" + day,
    })
  }
})