// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// Init cloud database
const db = cloud.database()
const movies = cloud.database().collection('movies')

// 云函数入口函数
exports.main = async (event, context) => new Promise((resolve, reject) => {
  const wxContext = cloud.getWXContext()
  const filter = event.filter
  const value = event.value

  // If by imdb, return movie details
  if (filter === "imdb" && value) {
    console.log("[Filter]: imdb, [Value]: ", value)
    let item = {}
    let movie = movies.doc(value).get()
    movie.then(res => {
      let result = res.data

      item.imdb = result._id
      item.title = result.title
      item.cover = result.image
      item.description = result.description

      resolve(item)
    })
  }

  // If by release, return movies list
  if (filter === "release" && value) {
    console.log("[Filter]: release, [Value]: ", value)
    let list = []
    movies.orderBy('release', value).get().then(res => {
      let result = res.data

      result.forEach(item => {
        let movie = {
          imdb: item._id,
          title: item.title,
          cover: item.image,
          category: item.category.join(' / '),
        }
        list.push(movie)
      })

      resolve(list)
    })
  }

})