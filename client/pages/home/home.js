const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')

const app = getApp()

Page({
  data: {
    filmList: [],
    commentList: [],
    movieid: '',
    poster: '',
    title: '',
    length: '',
    description: '',
    loginState: 0,
    nickname: '',
    userid: '',
    commenttype: 0,
    comment: ''
  },
  onShow: function() {
    // 同步授权状态
    app.checkSession({
      success: () => {
        this.setData({
          
          loginState: app.data.loginState
        })
      }
    })
  },
  onLoad() {
    this.getFilmList()
    this.getRecommend()
  },
  //获取电影列表信息
  getFilmList(callback) {
    qcloud.request({
      url: config.service.filmList,
      success: result => {
        if (!result.data.code) {
          this.setData({
            filmList: result.data.data,
            length: result.data.data.length
          })
          wx.setStorage({
            key: 'filmListKey',
            data: this.data.filmList,
          })
        }
      },
      fail: result => {},
      complete: () => {
        callback && callback()
      }
    })
  },
  //获得所有的影评，并随机抽取推荐
  getRecommend(callback) {
    wx.showLoading({
      title: '电影数据加载中...',
    })
    qcloud.request({
      url: config.service.allComments,
      method:'GET',
      success: result => {
        if (!result.data.code) {
          this.setData({
            commentList: result.data.data,
            length: result.data.data.length
          })
          wx.setStorage({
            key: 'allComments',
            data: this.data.commentList,
          })
          this.randomFilm(0, this.data.length - 1)
          wx.hideLoading()
        } else {
          wx.showToast({
            title: '电影数据加载失败',
          })
        }
      },
      fail: result => {
        wx.hideLoading()
        wx.showToast({
          title: '电影数据加载失败',
        })
      },
      complete: () => {
        callback && callback()
      }
    })
  },
  //随机选取电影
  randomFilm(n, m) {
    let c = m - n + 1;
    let num = Math.floor(Math.random() * c + n);
    let film = this.data.commentList[num]
    this.setData({
      poster: film.poster,
      title: film.moviename,
      movieid: film.movieid,
      avatar: film.avatar,
      userid: film.userid,
      nickname: film.username,
      comment: film.comment,
      commenttype: film.commenttype
    })
  },
  onPullDownRefresh() {
    this.getRecommend(() => {
      wx.stopPullDownRefresh()
    })
  },
  //跳转到个人中心页面
  toUser() {
    wx.navigateTo({
      url: '/pages/user/user',
    })
  },
  //跳转到电影列表页面
  toPop() {
    wx.navigateTo({
      url: '/pages/popular/popular',
    })
  },
  //跳转到电影详情
  tofilmDetail() {
    wx.navigateTo({
      url: '/pages/filmDetail/filmDetail?id=' + this.data.movieid,
    })
  },
  //跳转到影评详情
  toCommentDetail() {
    let userid = this.data.userid
    let username = this.data.nickname
    let avatar = this.data.avatar
    let comment = this.data.comment
    let movieid = this.data.movieid
    let commenttype = this.data.commenttype
    console.log(userid, username, avatar, comment, movieid)
    wx.navigateTo({
      url: '/pages/commentDetail/commentDetail?data=' + [userid, username, avatar, movieid, comment, commenttype],
    })
  }
})