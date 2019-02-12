//index.js
const config = require('../../config');
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * Page initial data
   */
  data: {
    movies: {},
    avatar: "https://avatars-1254341575.cos.ap-shanghai.myqcloud.com/user.png",
    username: "XXX",
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

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
    // Get recommend
    wx.cloud.callFunction({
      name: 'getRecommend',
    }).then(res => {
      let result = res.result
      let { movie, avatar, username } = result
      this.setData({ movie, avatar, username })
    })
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