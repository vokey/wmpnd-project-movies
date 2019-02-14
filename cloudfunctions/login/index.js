// 云函数入口文件
const cloud = require('wx-server-sdk')

// Init cloud
cloud.init()

// Init cloud database
const db = cloud.database()

/**
 * return openid and other userinfo
 * 
 */
exports.main = async (event, context) => {
  console.log(event)
  console.log(context)

  // Get WXContext
  const wxContext = cloud.getWXContext()
  console.log("[WXContext]", wxContext)

  return {
    openid: wxContext.OPENID,
    username: event.nickName,
    avatar: event.avatarUrl,
  }
}
