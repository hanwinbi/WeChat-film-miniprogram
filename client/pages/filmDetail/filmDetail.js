const app = getApp()

Page({
  data: {
    actionSheetHidden: true,
    actionSheetItems: ['文字', '音频'],
    id: '',
    poster: '',
    title: '',
    description: '',
    userInfo: null,
    commented: 0,
    commentDetail: []
  },
  onLoad: function(options) {
    this.setData({
      id: options.id,
    })
    this.setFilmDetail()
  },
  onShow(){
    if (app.data.loginState) {
      app.checkSession({
        success: ({ userInfo }) => {
          this.setData({
            userInfo,
            loginState: app.data.loginState
          })
          this.commented()
        },
      })
    }
  },
  //设置电影详情，从保存的本地数据获取
  setFilmDetail() {
    wx.getStorage({
      key: 'filmListKey',
      success: res => {
        this.seekFilm(res.data)
      },
    })
  },
  //根据电影id获取
  seekFilm(res) {
    let i = this.data.id - 1
    let film = res[i]
    this.setData({
      poster: film.image,
      title: film.title,
      description: film.description
    })
  },
  //添加影评时，先判读是否登录，未登录先跳转登录
  actionSheetTap: function(e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
    if(!this.data.userInfo){
        wx.showLoading({
          title: '请先登录...',
          duration: 2000
        })
       setTimeout( function(){
         wx.redirectTo({
           url: '/pages/user/user',
         })
       },1500)
    }
  },
  actionSheetChange: function(e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  bindItemTap: function(e) {
    let choice = e.currentTarget.dataset.name
    let movieid = this.data.id
    let moviename = this.data.title
    let poster = this.data.poster
    wx.navigateTo({
        url: '/pages/addComment/addComment?info=' + [choice,movieid,moviename,poster],
    })
    console.log('tap' + choice)
  },
  //跳转到影评详情页
  toComments() {
    let id = this.data.id
    wx.navigateTo({
      url: '/pages/comments/comments?id=' + id,
    })
  },
  //检查是否评论过
  commented(){
    wx.getStorage({
      key: 'allComments',
      success: result => {
        let length = result.data.length
        let res = result.data
        let favorite = []
        let commentDetail = []
        if (app.data.loginState){
          for (let i = 0; i < length; i += 1) {
          if (res[i].userid == this.data.userInfo.openId && res[i].movieid == this.data.id) {
            commentDetail.push({
              userid: res[i].userid,
              username: res[i].username,
              avatar: res[i].avatar,
              movieid: res[i].movieid,
              comment: res[i].comment,
              commenttype: res[i].commenttype
            })
            this.setData({
              commented: 1,
              commentDetail: commentDetail
            })
          }
        }
        } 
      },
    })
  },
  toCommentDetail() {
    let Detail = this.data.commentDetail[0]
    console.log(Detail)
    let userid = Detail.userid
    let username = Detail.username
    let avatar = Detail.avatar
    let comment = Detail.comment
    let movieid = Detail.movieid
    let commenttype = Detail.commenttype
    console.log(userid, username, avatar, comment, movieid)
    wx.navigateTo({
      url: '/pages/commentDetail/commentDetail?data=' + [userid, username, avatar, movieid, comment, commenttype],
    })
  }
})