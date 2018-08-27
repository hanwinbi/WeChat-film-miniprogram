const DB = require('../utils/db.js')

module.exports = {

  // 添加收藏

  //拉取收藏列表
  list: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId

    ctx.state.data = await DB.query('SELECT * FROM favorite LEFT JOIN comments ON favorite.movieid = comments.movieid AND favorite.commentuserid = comments.userid WHERE favorite.user = ?;', [user])
  },

  add: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let movieid = +ctx.request.body.movieid
    let commentuserid = ctx.request.body.commentuserid

      await DB.query('INSERT INTO favorite(id, user, movieid, commentuserid) VALUES (?, ?, ?, ?);', [, user, movieid, commentuserid])
  }
}