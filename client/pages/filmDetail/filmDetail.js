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
  },
  onLoad: function(options) {
    this.setData({
      id: options.id,
    })
    this.setFilmDetail()
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
    console.log(film)
    this.setData({
      poster: film.image,
      title: film.title,
      description: film.description
    })
  },
  //添加影评时，先判读是否登录，未登录先跳转登录
  actionSheetTap: function(e) {
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo,
          actionSheetHidden: !this.data.actionSheetHidden
        })
      },
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
    console.log(this.data.userInfo)
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
})