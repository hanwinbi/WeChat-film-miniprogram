const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')

const app = getApp()

Page({
  data: {
    userInfo: null,
    favorites: [],
    loginState: 0,
    show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['收藏的影评', '发布的影评',],//下拉列表的数据
    index: 0//选择的下拉列表下标
  },
  onLoad: function (options) {
    this.getFavorite()
  },
  onShow: function () {
    // 同步授权状态
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo: userInfo,
          loginState: 1
        })
        this.getFavorite()
        wx.getStorage({
          key: 'favoriteInfomation123',
          success: res => {
            this.setFavorite(res.data)
          }
        })
      }
    })
  },
  //未登录时，登录
  onTapLogin: function () {
    wx.showLoading({
      title: '影评数据加载中...',
    })
    app.login({
      success: ({ userInfo }) => {
        this.setData({
          userInfo,
          loginState: 1
        })
        this.getFavorite()
        console.log(this.data.userInfo)
      },
      error: () => {
        this.setData({
          loginState: app.data.loginState
        })
      }
    })
  },
  //获取收藏的影评
  getFavorite(){
    wx.showLoading({
      title: '载入中...',
    })
    qcloud.request({
      url: config.service.favoriteList,
      login: true,
      success: res =>{
        this.setFavorite(res.data.data)
        wx.setStorage({
          key: 'favoriteInfomation123',
          data: res.data.data,
        })
      }
    })
    wx.hideLoading()
  },
  //设置收藏的影评
  setFavorite(res){
    let length = res.length
    let favorite = []
    for(let i = 0; i < length; i +=1){
      favorite.push({
        movieid: res[i].movieid,
        userid: res[i].commentuserid,
        poster: res[i].poster,
        title: res[i].moviename,
        comment: res[i].comment,
        avatar: res[i].avatar,
        comment_username: res[i].username,
        commenttype: res[i].commenttype
      })
    }
    this.setData({
      favorites: favorite
    })
    wx.hideLoading()
  },
  // 点击下拉显示框
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      index: Index,
      show: !this.data.show
    });
    if(!this.data.index){
      this.getFavorite()
    }else{
      this.getMyComments()
    }
  },
  getMyComments(){
    wx.showLoading({
      title: '加载中...',
    })
      wx.getStorage({
        key: 'allComments',
        success: result => {
          let length = result.data.length
          let res = result.data
          let favorite = []
          for(let i = 0; i < length; i +=1){
            if(res[i].userid == this.data.userInfo.openId){
              favorite.push({
                movieid: res[i].movieid,
                userid: res[i].userid,
                poster: res[i].poster,
                title: res[i].moviename,
                comment: res[i].comment,
                avatar: res[i].avatar,
                comment_username: res[i].username,
                commenttype: res[i].commenttype
              })
            }
          }
          this.setData({
            favorites: favorite
          })
          console.log(this.data.favorites)
          wx.hideLoading()
        },
      })
  },
  //跳转到首页
  toHome(){
    wx.navigateBack({})
  },
  //跳转到影评详情
  toCommentDetail(event) {
    console.log(event)
    let userid = event.currentTarget.dataset.item.userid
    let username = event.currentTarget.dataset.item.comment_username
    let avatar = event.currentTarget.dataset.item.avatar
    let comment = event.currentTarget.dataset.item.comment
    let movieid = event.currentTarget.dataset.item.movieid
    let commenttype = event.currentTarget.dataset.item.commenttype
    wx.navigateTo({
      url: '/pages/commentDetail/commentDetail?data=' + [userid, username, avatar, movieid, comment,commenttype],
    })
  }
})