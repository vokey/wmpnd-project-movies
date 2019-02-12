// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// Init cloud database
const db = cloud.database()
const comments = cloud.database().collection('comments')

// 云函数入口函数
exports.main = async (event, context) => new Promise((resolve, reject) => {
  const wxContext = cloud.getWXContext()

  let item = {}
  let list = comments.orderBy('createTime', 'desc').limit(5).get()
  list.then(res => {
    let result = res.data

    let index = Math.floor(Math.random() * result.length)
    let comment = result[index]

    item.cid = comment._id
    item.imdb = comment.imdb
    item.username = comment.username
    item.avatar = comment.avatar

    cloud.callFunction({
      name: 'getMovie',
      data: {
        filter: 'imdb',
        value: item.imdb,
      }
    }).then(res => {
      let movie = res.result
      
      item.movie = {}
      item.movie.title = movie.title
      item.movie.cover = movie.cover

      resolve(item)
    })
  })

})