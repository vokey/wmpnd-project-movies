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
  console.log("[WXContext]", wxContext.OPENID)

  // Get user registration status
  let res = await db.collection('users').where({ _openid: wxContext.OPENID}).get()
  let userinfo = res.data[0]
  return {
    openid: wxContext.OPENID,
    userinfo: userinfo,
  }
}
