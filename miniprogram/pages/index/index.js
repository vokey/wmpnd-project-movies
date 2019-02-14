//index.js
const app = getApp();
const db = wx.cloud.database();
const { login } = require("../../utils/utils.js");
Page({

  /**
   * Page initial data
   */
  data: {
    movie: {},
    avatar: "",
    username: "",
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    // If cannot retrieve userinfo, call login
    if (!app.globalData.userinfo) {
      let userinfo = login({
        success: res => {
          console.log(res)
          app.globalData.userinfo = res
          this.showRecommend()
        }
      })
    } else {
      this.showRecommend()
    }
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },
  
  showRecommend() {
    // Get recommend
    wx.cloud.callFunction({
      name: 'getRecommend',
    }).then(res => {
      let result = res.result
      let { movie, avatar, username, cid } = result
      this.setData({ movie, avatar, username, cid })
    })
  },

  onTapMovie() {
    wx.navigateTo({
      url: '/pages/movies/details/details?imdb=' + this.data.movie.imdb,
    })
  },

  onTapRecommend() {
    wx.navigateTo({
      url: '/pages/comments/details/details?cid=' + this.data.cid,
    })
  },

  onTapHot() {
    wx.navigateTo({
      url: '/pages/movies/list/list',
    })
  },

  onTapMine() {
    wx.navigateTo({
      url: '/pages/user/user',
    })
  }
})