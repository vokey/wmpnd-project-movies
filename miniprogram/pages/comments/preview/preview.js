// pages/comments/preview/preview.js
const config = require('../../../config');
const app = getApp();
const innerAudioContext = wx.createInnerAudioContext();
Page({

  /**
   * Page initial data
   */
  data: {
    imdb:"",
    title: "",
    cover: "",
    type: "",
    content: "",
    cid: "",
    status: "",
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    // Get passed GET parameters
    if (options.imdb && options.status === 'draft') {
      this.setData({
        imdb: options.imdb,
      })
      wx.getStorage({
        key: `draft_${this.data.imdb}`,
        success: res => {
          let { title, cover, type, content, cid } = res.data
          this.setData({ title, cover, type, content, cid })
        },
      })
    } else if (options.cid && options.status === 'published') {
      wx.cloud.callFunction({
        name: 'getComment',
        data: {
          filter: 'cid',
          value: options.cid,
        }
      }).then(res => {
        let { cid, imdb, title, cover, type, content } = res.result
        this.setData({ cid, imdb, title, cover, type, content, status: 'published' })
      })
    }
    
    this.setData({
      username: app.globalData.userinfo.username,
      avatar: app.globalData.userinfo.avatar,
    })

    if (this.data.type === "audio") {
      innerAudioContext.src = this.data.content
    }
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
    this.setData({length: innerAudioContext.duration})
    innerAudioContext.play()
    innerAudioContext.onPlay(() => {
      console.log("Playing")
    })
  },
  
  onTapEdit() {
    // If came from edit page, back to edit page
    if (this.data.status === "draft") {
      wx.navigateBack({
        delta: 1,
      })
    } else {
      // If came from comment detail page, set content to storage and then navigate to edit page
      let draft = {
        imdb: this.data.imdb,
        title: this.data.title,
        cover: this.data.cover,
        type: this.data.type,
        content: this.data.content,
        cid: this.data.cid,
      }
      wx.setStorage({
        key: `draft_${this.data.imdb}`,
        data: draft,
      })
      wx.navigateTo({
        url: `/pages/comments/edit/edit?mode=edit&imdb=${this.data.imdb}`,
      })
    }
    
  },

  onTapPublish() {
    const db = wx.cloud.database()
    const comments = db.collection('comments')
    
    if (!this.data.cid) {
      wx.removeStorageSync(`draft_${this.data.imdb}`)
      let comment = comments.add({
        data: {
          imdb: this.data.imdb,
          title: this.data.title,
          cover: this.data.cover,
          type: this.data.type,
          content: this.data.content,
          username: this.data.username,
          avatar: this.data.avatar,
          createTime: new Date(),
          updateTime: new Date(),
        }
      })
      comment.then(res => {
        wx.showToast({
          title: '发布成功',
        })
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/comments/list/list?imdb=' + this.data.imdb,
          })
        }, 1500)
      })
    } else if (this.data.cid) {
      wx.removeStorageSync(`draft_${this.data.imdb}`)
      let comment = comments.doc(this.data.cid).update({
        data: {
          title: this.data.title,
          cover: this.data.cover,
          type: this.data.type,
          content: this.data.content,
          username: this.data.username,
          avatar: this.data.avatar,
          updateTime: new Date(),
        }
      })
      comment.then(res => {
        wx.showToast({
          title: '更新成功',
        })
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/comments/list/list?imdb=' + this.data.imdb,
          })
        }, 1500)
      })
    }
    
  }
})