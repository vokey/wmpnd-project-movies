const login = ({success, fail}) => {
  // Check longterm cache first
  wx.getStorage({
    key: 'userinfo',
    success: res => {
      console.log("Get userinfo from cache.")
      let userinfo = res.data

      // Success callback
      success && success(userinfo)
    },
    fail: err => {
      console.log(err)
      wx.getUserInfo({
        // If could get userinfo, call cloudfunction login
        success: res => {
          console.log("Get userinfo from Wechat.")
          console.log(res)
          let { nickName, avatarUrl } = res.userInfo

          wx.showLoading({
            title: '登录中...',
          })
          wx.cloud.callFunction({
            name: 'login',
            data: { nickName, avatarUrl },
          }).then(res => {
            let userinfo = res.result
            console.log(res)

            // Set longterm cache
            wx.setStorage({
              key: 'userinfo',
              data: userinfo,
              complete: res => {
                console.log(res)
              }
            })

            wx.hideLoading()

            // Success callback
            success && success(userinfo)
          })
        },
        // If couldn't get userinfo, esp when not authorized
        fail: err => {
          fail && fail(err)
          wx.reLaunch({
            url: '/pages/login/login'
          })
        }
      })
    }
  })
}

const hasComment = ({imdb, success, fail}) => {
  // Check has the user published comment of the movie
  const db = wx.cloud.database()
  const comments = db.collection('comments')
  const app = getApp()
  let comment = comments.where({ _openid: app.globalData.userinfo.openid, imdb: imdb }).get()
  comment.then(res => {
    if (res.data[0]) {
      let cid = res.data[0]._id
      
      // Success callback
      success && success(cid)
    } else {
      fail && fail()
    }
  })
}

module.exports = { login, hasComment }