const DB = require('../utils/db.js')

module.exports = {
  //所有的评论
  allcomments: async ctx =>{
    ctx.state.data = await DB.query('SELECT * FROM comments')
  },
  //特定电影的影评列表
  commentList: async ctx => {
    movieId = + ctx.params.id

    ctx.state.data = await DB.query('SELECT * FROM comments where comments.movieid=?',[movieId])
  },
  //添加影评
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
  },
  //删除影评
  del: async ctx =>{
    let userid = ctx.state.$wxInfo.userinfo.openId
    let movieid = +ctx.request.body.movieid

    await DB.query('DELETE FROM comments where comments.userid=? AND comments.movieid=?',[userid,movieid])
  }
}