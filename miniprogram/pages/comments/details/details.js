// pages/comments/details/details.js
const app = getApp();
const innerAudioContext = wx.createInnerAudioContext();
const { login, hasComment } = require("../../../utils/utils.js");
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
    mycid: "",
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
      let {type, content, uid, username, avatar, imdb, title, cover} = res.result
      this.setData({
        type,
        content,
        uid,
        username,
        avatar,
        imdb,
        title,
        cover,
      })

      // Check has the user published comment of same movie
      if (!app.globalData.userinfo) {
        login({
          success: res => {
            app.globalData.userinfo = res
            hasComment({
              imdb: this.data.imdb,
              success: res => {
                this.setData({ mycid: res })
              }
            })
          }
        })
      } else {
        hasComment({
          imdb: this.data.imdb,
          success: res => {
            this.setData({ mycid: res })
          }
        })
      }
    })

    const db = wx.cloud.database()

    // Check favorite status
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

  onTapPlay() {
    console.log("Start Playing")
    innerAudioContext.src = this.data.content
    this.setData({ length: innerAudioContext.duration })
    innerAudioContext.play()
    innerAudioContext.onPlay(() => {
      console.log("Playing")
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
    
  },

  onTapFav() {
    const favorites = wx.cloud.database().collection('favorites')
    if (this.data.uid === app.globalData.userinfo.openid) {
      wx.showToast({
        icon: 'none',
        title: '不能收藏自己的影评哦',
      })
    } else if (this.data.favorite) {
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