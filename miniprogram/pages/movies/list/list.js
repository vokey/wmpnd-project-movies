// pages/movies/list/list.js
const config = require('../../../config');
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
    const db = wx.cloud.database()
    db.collection('movies')
      // Get movies list in descending order
      .orderBy('release', 'desc')
      .get()
      .then(res => {
        const result = res.data
        const movies = []
        result.forEach(item => {
          let movie = {
            imdb: item.imdb,
            title: item.title,
            cover: config.url.covers + item.image,
            category: item.category.join(' / '),
          }
          movies.push(movie)
        })
        this.setData({
          movies: movies,
        })
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

  onTapItem(event) {
    if (event.currentTarget.dataset.imdb) {
      let imdb = event.currentTarget.dataset.imdb
      wx.navigateTo({
        url: '/pages/movies/details/details?imdb=' + imdb,
      })
    }
  }
})