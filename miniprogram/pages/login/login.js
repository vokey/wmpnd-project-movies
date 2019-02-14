// miniprogram/pages/login/login.js
const app = getApp();

Page({

  /**
   * Page initial data
   */
  data: {
    nickName: "登录后方可使用",
    avatarUrl: "/images/avatar.png",
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

  onGetUserInfo(event) {
    // If user authorized and got the userinfo
    if (event.detail.userInfo) {
      // Hide login button
      this.setData({ authorized: true })
      let { nickName, avatarUrl } = event.detail.userInfo

      // Update dataset
      this.setData({ nickName, avatarUrl })

      wx.showLoading({
        title: '登录中...',
      })
      wx.cloud.callFunction({
        name: 'login',
        data: {},
      }).then(res => {
        let userinfo = res.result
        userinfo.username = nickName
        userinfo.avatar = avatarUrl
        app.globalData.userinfo = userinfo
        console.log("globalData:", app.globalData.userinfo)

        // Set longterm cache
        wx.setStorage({
          key: 'userinfo',
          data: userinfo,
        })

        wx.hideLoading()

        // Relaunch index page
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }).catch(() => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '登录失败，请再试一次',
        })
      })
    } else {
      // If user refused to authorize
      wx.showModal({
        title: '登录失败',
        content: '我们需要您的授权来访问用户资料',
        confirmText: '前往授权',
        success: res => {
          if (res.confirm) {
            wx.openSetting({
              success: res => {
                if (res.authSetting['scope.userInfo']) {
                  // If user changed to authorize
                  // Hide login button
                  this.setData({ authorized: true })
                  wx.getUserInfo({
                    // If could get userinfo, call cloudfunction login
                    success: res => {
                      let { nickName, avatarUrl } = res.userInfo
                      this.setData({ nickName, avatarUrl })

                      wx.showLoading({
                        title: '登录中...',
                      })
                      wx.cloud.callFunction({
                        name: 'login',
                        data: {},
                      }).then(res => {
                        let userinfo = res.result.userinfo
                        app.globalData.userinfo = userinfo

                        // Set longterm cache
                        wx.setStorage({
                          key: 'userinfo',
                          data: userinfo,
                        })

                        wx.hideLoading()

                        wx.reLaunch({
                          url: '/pages/index/index',
                        })
                      })
                    },
                  })
                }
              }
            })
          }
        }
      })
    }
  }
})