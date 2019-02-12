// pages/comments/details/details.js
const config = require('../../../config');
Page({

  /**
   * Page initial data
   */
  data: {
    cover: "",
    title: "",
    cid: "",
    type: "",
    content: "",
    username: "",
    avatar: "",
    favorite: "",
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    // Get passed GET parameters
    if (options.cid) {
      this.setData({
        cid: options.cid,
      })
    }

    wx.cloud.callFunction({
      name: 'getComment',
      data: {
        filter: 'cid',
        value: this.data.cid
      }
    }).then(res => {
      let {type, content, username, avatar, imdb, title, cover} = res.result
      this.setData({
        type,
        content,
        username,
        avatar,
        imdb,
        title,
        cover,
      })
    })

    const db = wx.cloud.database()
    const favorites = db.collection('favorites')
    let fav = favorites.where({cid: this.data.cid}).get()
    fav.then(res => {
      if (res.data[0]) {
        this.setData({
          favorite: res.data[0]._id,
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
  },

  onTapFav() {
    const favorites = wx.cloud.database().collection('favorites')
    if (this.data.favorite) {
      favorites.doc(this.data.favorite).remove()
        .then(res => {
          this.setData({favorite: ""})
          wx.showToast({
            title: '取消收藏',
          })
        })
    } else {
      favorites.add({
        data: {
          cid: this.data.cid,
          imdb: this.data.imdb,
          createTime: new Date(),
        }
      }).then(res => {
        this.setData({favorite: res._id})
        wx.showToast({
          title: '收藏成功',
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }
})