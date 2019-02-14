// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// Init cloud database
const db = cloud.database()
const _ = db.command
const comments = cloud.database().collection('comments')

// 云函数入口函数
exports.main = async (event, context) => new Promise((resolve, reject) => {
  const wxContext = cloud.getWXContext()

  let item = {}
  let list = comments.where({
    _openid: _.neq(wxContext.OPENID)
  })
    .orderBy('createTime', 'desc').limit(10).get()
  list.then(res => {
    let result = res.data

    let index = Math.floor(Math.random() * result.length)
    let comment = result[index]

    item.cid = comment._id
    item.imdb = comment.imdb
    item.title = comment.title
    item.cover = comment.cover
    item.username = comment.username
    item.avatar = comment.avatar
    
    resolve(item)
  })

})