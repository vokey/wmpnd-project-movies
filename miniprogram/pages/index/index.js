//index.js

Page({

  /**
   * Page initial data
   */
  data: {
    cover: "https://covers-1254341575.cos.ap-shanghai.myqcloud.com/p2496940327.jpg",
    title: "海边的曼彻斯特",
    avatar: "https://avatars-1254341575.cos.ap-shanghai.myqcloud.com/user.png",
    username: "XXX",
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

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

  onTapMovie() {
    wx.navigateTo({
      url: '/pages/movies/details/details',
    })
  },

  onTapRecommend() {
    wx.navigateTo({
      url: '/pages/comments/details/details',
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