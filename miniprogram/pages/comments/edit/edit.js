// pages/comments/edit/edit.js
const app = getApp();
const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext();
Page({

  /**
   * Page initial data
   */
  data: {
    imdb: "",
    type: "text",
    content: "",
    mode: "add"
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    if (options.mode === "add") {
      // Get passed GET parameters
      this.setData({
        imdb: options.imdb,
        type: options.type,
      })

      wx.cloud.callFunction({
        name: 'getMovie',
        data: {
          filter: 'imdb',
          value: this.data.imdb,
        }
      }).then(res => {
        let { title, cover } = res.result
        this.setData({ title, cover })
      })
    } else if (options.mode === "edit") {
      console.log("[Edit Mode]")
      // Get passed GET parameters
      this.setData({
        imdb: options.imdb,
      })
      wx.getStorage({
        key: `draft_${this.data.imdb}`,
        success: res => {
          let { title, cover, type, content, cid } = res.data
          this.setData({ title, cover, type, draft: content, cid })
        },
      })
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

  onTextInput(event) {
    this.setData({
      content: event.detail.value.trim()
    })
  },

  onTapToAudio(event) {
    if (this.data.content) {
      wx.showModal({
        title: '确定转为录音吗',
        content: '转为录音将会舍弃当前文字内容',
        success: res => {
          if (res.confirm) {
            this.setData({
              type: 'audio',
              content: '',
            })
          }
        }
      })
    } else {
      this.setData({
        type: 'audio',
        content: '',
      })
    }
  },

  onTapToText(event) {
    if (this.data.content) {
      wx.showModal({
        title: '确定转为文字吗',
        content: '转为文字将会舍弃当前录音内容',
        success: res => {
          if (res.confirm) {
            this.setData({
              type: 'text',
              content: '',
            })
          }
        }
      })
    } else {
      this.setData({
        type: 'text',
        content: '',
      })
    }
  },

  onStartRecord() {
    const options = {
      duration: 60000,
      sampleRate: 16000,
      encodeBitRate: 48000,
      format: 'aac'
    }

    recorderManager.start(options)

    recorderManager.onStart(() => {
      console.log("Start recording")
    })
  
  },

  onStopRecord() {
    recorderManager.stop()
    recorderManager.onStop(res => {
      console.log("Stop recording")
      innerAudioContext.src = res.tempFilePath
      this.setData({
        content: res.tempFilePath,
      })
      
      
    })
  },

  onPlay() {
    innerAudioContext.play()
    innerAudioContext.onPlay(() => {
    })

  },


  onTapSubmit() {
    if (this.data.content && this.data.type === "text") {
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
        url: `/pages/comments/preview/preview?imdb=${this.data.imdb}&type=${this.data.type}&status=draft`,
      })
    } else if (this.data.content && this.data.type === "audio") {
      wx.showLoading({
        title: '音频处理中',
      })
      let random = Math.random()
      wx.cloud.uploadFile({
        cloudPath: `uploads/records/${app.globalData.userinfo.openid}_${this.data.imdb}/${random}.aac`,
        filePath: this.data.content,
        success: res => {
          wx.hideLoading()
          // get resource ID
          console.log(res.fileID)
          let draft = {
            imdb: this.data.imdb,
            title: this.data.title,
            cover: this.data.cover,
            type: this.data.type,
            content: res.fileID,
            cid: this.data.cid,
          }
          wx.setStorage({
            key: `draft_${this.data.imdb}`,
            data: draft,
          })
          wx.navigateTo({
            url: `/pages/comments/preview/preview?imdb=${this.data.imdb}&type=${this.data.type}&status=draft`,
          })

        },
        fail: err => {
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '请再试一次',
          })
        }
      })
    }
  },

  // onTapRecord() {
  //   const recorderManager = wx.getRecorderManager()

  //   recorderManager.onStart(() => {
  //     console.log('recorder start')
  //   })
  //   recorderManager.onPause(() => {
  //     console.log('recorder pause')
  //   })
  //   recorderManager.onStop((res) => {
  //     console.log('recorder stop', res)
  //     const { tempFilePath } = res
  //     wx.cloud.uploadFile({
  //       cloudPath: `uploads/records/${this.data.imdb}.aac`,
  //       filePath: tempFilePath,
  //       success: res => {
  //         // get resource ID
  //         console.log(res.fileID)
  //       },
  //       fail: err => {
  //         // handle error
  //       }
  //     })
  //   })

  //   const options = {
  //     duration: 5000,
  //     sampleRate: 16000,
  //     encodeBitRate: 48000,
  //     format: 'aac'
  //   }

  //   recorderManager.start(options)
  // }
})