// pages/user/user.js
const app = getApp();
const innerAudioContext = wx.createInnerAudioContext();
Page({

  /**
   * Page initial data
   */
  data: {
    filter: {type: "fav", text: "收藏的影评"},
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.getFavorite()
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

  getWritten(callback) {
    wx.cloud.callFunction({
      name: 'getComment',
      data: {
        filter: 'openid',
        value: '',
      }
    }).then(res => {
      this.setData({ written: res.result, shown: res.result })
      callback && callback()
    })
  },

  getFavorite(callback) {
    wx.cloud.callFunction({
      name: 'getFavorite',
      data: {},
    }).then(res => {
      this.setData({ favorite: res.result, shown: res.result })
      callback && callback()
    })
  },

  onTapFilter() {
    wx.showActionSheet({
      itemList: ["收藏的影评", "我写的影评"],
      success: res => {
        switch(res.tapIndex) {
          case 0:
            this.setData({ filter: { type: "fav", text: "收藏的影评" } });
            (!this.data.favorite) ? this.getFavorite() : this.setData({ shown: this.data.favorite })
            break;
          case 1:
            this.setData({ filter: { type: "written", text: "我写的影评" } });
            (!this.data.written) ? this.getWritten() : this.setData({ shown: this.data.written })
            break;
        }
      }
    })
  },

  onTapPlay(event) {
    let id = event.currentTarget.dataset.id
    console.log(event)
    innerAudioContext.src = this.data.shown[id].content
    this.setData({ length: innerAudioContext.duration })
    innerAudioContext.play()
    innerAudioContext.onPlay(() => {
      console.log("Playing")
    })
  },

  onTapItem(event) {
    let cid = event.currentTarget.dataset.cid

    // If user tapped own comment, goto preview page
    if (this.data.filter.type === "written") {
      wx.navigateTo({
        url: '/pages/comments/preview/preview?status=published&cid=' + cid,
      })
    } else {
      wx.navigateTo({
        url: '/pages/comments/details/details?cid=' + cid,
      })
    }
  },

  onTapHome() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  }
})