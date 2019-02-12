// pages/movies/details/details.js
const config = require('../../../config');
const app = getApp();
Page({

  /**
   * Page initial data
   */
  data: {
    imdb: "",
    title: "",
    cover: "",
    description: "",
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    if (options.imdb) {
      this.setData({
        imdb: options.imdb,
      })

      wx.cloud.callFunction({
        name: 'getMovie',
        data: {
          filter: 'imdb',
          value: this.data.imdb
        }
      }).then(res => {
        let {title, cover, description} = res.result
        this.setData({ title, cover, description })
      })
    }

    // Check has the user published comment of this movie
    const db = wx.cloud.database()
    const comments = db.collection('comments')
    let comment = comments.where({ _openid: app.globalData.userinfo.openid, imdb: this.data.imdb }).get()
    comment.then(res => {
      if (res.data[0]) {
        this.setData({
          mycid: res.data[0]._id,
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
      url: '/pages/comments/list/list?imdb=' + this.data.imdb,
    })
  },

  onTapComment() {
    if (this.data.mycid) {
      wx.navigateTo({
        url: `/pages/comments/preview/preview?status=published&cid=${this.data.mycid}&type=${this.data.type}`,
      })
    } else {
      wx.showActionSheet({
        itemList: ["文字", "音频"],
        success: res => {
          console.log(res.tapIndex)
          switch (res.tapIndex) {
            case 0:
              wx.navigateTo({
                url: `/pages/comments/edit/edit?type=text&mode=add&imdb=${this.data.imdb}`,
              });
              break;
            case 1:
              wx.navigateTo({
                url: `/pages/comments/edit/edit?type=audio&mode=add&imdb=${this.data.imdb}`,
              });
              break;
          }
        },
        fail: err => {
          console.log(err)
        }
      })
    }
  }
})