// pages/comments/list/list.js
const app = getApp();
const innerAudioContext = wx.createInnerAudioContext();
Page({

  /**
   * Page initial data
   */
  data: {
    imdb: "",
    comments: [],
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    // Get passed GET parameter
    if (options.imdb) {
      this.setData({
        imdb: options.imdb,
      })
    }

    // Get comments list
    wx.cloud.callFunction({
      name: 'getComment',
      data: {
        filter: 'imdb',
        value: this.data.imdb
      }
    }).then(res => {
      if (res.result.length == 0) {
        this.setData({ empty: true })
      } else {
        this.setData({ comments: res.result })
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

  onTapComment(event) {
    let cid = event.currentTarget.dataset.cid
    wx.navigateTo({
      url: '/pages/comments/details/details?cid=' + cid,
    })

  },

  onTapPlay(event) {
    let id = event.currentTarget.dataset.id
    console.log(event)
    innerAudioContext.src = this.data.comments[id].content
    this.setData({ length: innerAudioContext.duration })
    innerAudioContext.play()
    innerAudioContext.onPlay(() => {
      console.log("Playing")
    })
  },

  onTapHome() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  }
})