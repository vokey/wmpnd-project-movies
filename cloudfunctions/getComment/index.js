// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// Init cloud database
const db = cloud.database()
const comments = cloud.database().collection('comments')

// 云函数入口函数
exports.main = async (event, context) => new Promise((resolve, reject) => {
  const wxContext = cloud.getWXContext()
  const {filter, value} = event
  
  if (filter === "cid" && value) {
    console.log("[Filter]: cid, [Value]: ", value)
    let item = {}
    let comment = comments.doc(value).get()
    comment.then(res => {
      let result = res.data

      item.cid = result._id
      item.imdb = result.imdb
      item.type = result.type
      item.content = result.content
      item.username = result.username
      item.avatar = result.avatar

      resolve(item)
    })
  }

  if (filter === "imdb" && value) {
    console.log("[Filter]: imdb, [Value]: ", value)
    let list = []
    comments.where({imdb: value}).get().then(res => {
      let result = res.data

      result.forEach(item => {
        let comment = {
          cid: item.cid,
          imdb: item.imdb,
          type: item.type,
          content: item.content,
          username: item.username,
          avatar: item.avatar,
        }
        list.push(comment)
      })
      
      resolve(list)
    })
  }


})