const DB = require('../utils/db.js')

module.exports = {
  allcomments: async ctx =>{
    ctx.state.data = await DB.query('SELECT * FROM comments')
  },

  commentList: async ctx => {
    movieId = + ctx.params.id

    ctx.state.data = await DB.query('SELECT * FROM comments where comments.movieid=?',[movieId])
  },
  add: async ctx => {
    let userid = ctx.state.$wxInfo.userinfo.openId
    let username = ctx.state.$wxInfo.userinfo.nickName
    let avatar = ctx.state.$wxInfo.userinfo.avatarUrl

    let movieid = +ctx.request.body.movieid
    let moviename = ctx.request.body.moviename
    let poster = ctx.request.body.poster

    let commenttype= +ctx.request.body.commenttype
    let comment = ctx.request.body.comment || null

    await DB.query('INSERT INTO comments(userid, username, avatar, movieid, moviename, poster, commenttype,comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?);', [userid, username, avatar, movieid, moviename, poster, commenttype,comment])
  }
}