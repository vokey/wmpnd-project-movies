// pages/movies/list/list.js
const app = getApp();
Page({

  /**
   * Page initial data
   */
  data: {
    movies: [],
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.fetchMoviesList({
      useCache: true,
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
    this.fetchMoviesList({
      useCache: false,
      callback: () => {
        wx.stopPullDownRefresh()
      }
    })
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

  fetchMoviesList({useCache, callback}) {
    if (useCache && app.globalData.movies) {
      console.log("[Found movies list in globalData.]")
      this.setData({
        movies: app.globalData.movies,
      })
    } else {
      console.log("[Fetching movies list...]")
      wx.cloud.callFunction({
        name: 'getMovie',
        data: {
          filter: 'release',
          value: 'desc',
        }
      }).then(res => {
        console.log("[Fetched.]")
        this.setData({
          movies: res.result,
        })
        app.globalData.movies = res.result

        callback && callback()
      })
    }
  },

  onTapItem(event) {
    if (event.currentTarget.dataset.imdb) {
      let imdb = event.currentTarget.dataset.imdb
      wx.navigateTo({
        url: '/pages/movies/details/details?imdb=' + imdb,
      })
    }
  }
})