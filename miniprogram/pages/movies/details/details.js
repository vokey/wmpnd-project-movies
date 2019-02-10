// pages/movies/details/details.js
const config = require('../../../config');
Page({

  /**
   * Page initial data
   */
  data: {
    cover: "",
    title: "",
    description: "",
    imdb: "",
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    if (options.imdb) {
      this.setData({
        imdb: options.imdb,
      })
    }
    const db = wx.cloud.database()
    db.collection('movies').where({
      imdb: this.data.imdb,
    }).get()
      .then(res => {
        let result = res.data[0]
        if (result.imdb === this.data.imdb) {
          this.setData({
            title: result.title,
            cover: config.url.covers + result.image,
            description: result.description,
          })
        }
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

  onTapView() {
    wx.navigateTo({
      url: '/pages/comments/list/list',
    })
  },

  onTapComment() {
    wx.showActionSheet({
      itemList: ["文字", "音频"],
      success: res => {
        console.log(res.tapIndex)
      },
      fail: err => {
        console.log(err)
      }
    })
  }
})