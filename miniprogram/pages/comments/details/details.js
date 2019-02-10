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
    comment: "",
    username: "",
    avatar: "",
    favorite: "",
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    // Get passed GET parameters
    if (options.imdb && options.cid) {
      this.setData({
        imdb: options.imdb,
        cid: options.cid,
      })
    }

    const db = wx.cloud.database()
    const comments = db.collection('comments')
    const movies = db.collection('movies')
    const users = db.collection('users')
    const favorites = db.collection('favorites')
    let comment = comments.doc(this.data.cid).get()
    let movie = movies.where({imdb: this.data.imdb}).field({title:true, image:true}).get()
    let user = users.where({_openid: this.data.uid}).get()
    let fav = favorites.where({cid: this.data.cid}).get()
    movie.then(res => {
      let result = res.data[0]
      this.setData({
        title: result.title,
        cover: config.url.covers + result.image,
      })
    })
    comment.then(res => {
      let result = res.data
      this.setData({
        type: result.type,
        comment: result.content,
        uid: result._openid,
      })
    })
    user.then(res => {
      let result = res.data[0]
      this.setData({
        username: result.username,
        avatar: config.url.avatars + result.avatar,
      })
    })
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