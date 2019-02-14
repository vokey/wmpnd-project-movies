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
      item.title = result.title
      item.cover = result.cover
      item.type = result.type
      item.content = result.content
      item.uid = result._openid
      item.username = result.username
      item.avatar = result.avatar
      resolve(item)
    })
  }

  if (filter === "imdb" && value) {
    console.log("[Filter]: imdb, [Value]: ", value)
    let list = []
    comments.where({imdb: value}).orderBy('updateTime', 'desc').get().then(res => {
      let result = res.data

      result.forEach(item => {
        let comment = {
          cid: item._id,
          imdb: item.imdb,
          type: item.type,
          content: item.content,
          uid: item._openid,
          username: item.username,
          avatar: item.avatar,
        }
        list.push(comment)
      })
      
      resolve(list)
    })
  }

  if (filter === "openid") {
    value ? openid = value : openid = wxContext.OPENID
    let list = []
    comments.where({ _openid: openid }).orderBy('updateTime', 'desc').get().then(res => {
      let result = res.data

      result.forEach(item => {
        let comment = {
          cid: item._id,
          imdb: item.imdb,
          title: item.title,
          cover: item.cover,
          type: item.type,
          content: item.content,
          uid: item._openid,
          username: item.username,
          avatar: item.avatar,
        }
        list.push(comment)
      })

      resolve(list)
    })

  }

  if (filter === "cidList" && value) {
    let list = []
    let task = []
    value.forEach(item => {
      console.log(item)
      let promise = comments.doc(item).get()
      task.push(promise)
    })
    Promise.all(task).then(res => {
      res.forEach(item => {
        let comment = {}
        let result = item.data

        comment.cid = result._id
        comment.imdb = result.imdb
        comment.title = result.title
        comment.cover = result.cover
        comment.type = result.type
        comment.content = result.content
        comment.uid = result._openid
        comment.username = result.username
        comment.avatar = result.avatar
        list.push(comment)
      })
      resolve(list)
    }).catch(err => {
      console.log(err)
    })

  }

})