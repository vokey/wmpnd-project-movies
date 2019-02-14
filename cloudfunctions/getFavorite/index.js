// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// Init cloud database
const db = cloud.database()
const favorites = cloud.database().collection('favorites')

// 云函数入口函数
exports.main = async (event, context) => new Promise((resolve, reject) => {
  const wxContext = cloud.getWXContext()

  favorites.where({ _openid: wxContext.OPENID }).orderBy('createTime', 'desc').get().then(res => {
    let result = res.data
    let favCidList = []

    result.forEach(item => {
      favCidList.push(item.cid)
    })

    cloud.callFunction({
      name: 'getComment',
      data: {
        filter: 'cidList',
        value: favCidList
      }
    }).then(res => {
      resolve(res.result)
    })
  })

})