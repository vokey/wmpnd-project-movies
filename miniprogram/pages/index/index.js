//index.js
const config = require('../../config');
const app = getApp();
const db = wx.cloud.database();
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
    // If cannot retrieve userinfo, check userinfo authorization
    if (!app.globalData.userinfo) {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // If authorized, try to get userinfo
            this.getUserInfo()
          } else {
            this.setData({needLogin: true})
          }
        }
      })
    }

    // Get recommend
    wx.cloud.callFunction({
      name: 'getRecommend',
    }).then(res => {
      let result = res.result
      let { movie, avatar, username, cid} = result
      this.setData({ movie, avatar, username, cid })
    })

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

  onGetUserInfo() {
    this.getUserInfo()
    this.setData({needLogin: false})
  },

  getUserInfo() {
    console.log("[Getting userinfo from db...]")
    wx.cloud.callFunction({
      name: "login",
      data: {},
    }).then(res => {
      let userinfo = res.result.userinfo
      // Set globalData after getting userinfo
      if (userinfo && userinfo.username && userinfo.avatar) {
        app.globalData.userinfo = {
          openid: res.result.openid,
          username: userinfo.username,
          avatar: userinfo.avatar,
        }
      } else {
        wx.getUserInfo({
          success: res => {
            console.log("[Get userinfo from WeChat] ")
            let { nickName, avatarUrl } = res.userInfo
            this.register({ nickName, avatarUrl })
          }
        })
      }
    })
  },

  register(userinfo) {
    db.collection('users').add({
      data: {
        username: userinfo.nickName,
        avatar: userinfo.avatarUrl,
      }
    }).then(res => {
      this.getUserInfo()
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