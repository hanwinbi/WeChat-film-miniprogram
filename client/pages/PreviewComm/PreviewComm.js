const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')

const app = getApp()
const innerAudioContext = wx.createInnerAudioContext()

const TypeMap = {
  '音频': 1,
  '文字': 0
}

Page({

  data: {
    commentValue: '',
    userInfo: null,
    avatar: '',
    nickname: '',
    loginState: 0,

    commenttype: 0,
    movieid: null,
    poster: '',
    title: '',
  },
  onLoad: function (options) {
    console.log(options.comments)
    let dataArr = options.comments.split(',')
    this.setData({
      commenttype: TypeMap[dataArr[0]],
      movieid: dataArr[1],
      title: dataArr[2],
      poster: dataArr[3],
      commentValue: dataArr[4],
    })
  },
  onShow: function () {
    // 同步授权状态
    this.setData({
      loginState: app.data.loginState
    })
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
        this.checkUser()
      }
    })
  },
  //设置用户信息
  checkUser(){
    let user = this.data.userInfo
    this.setData({
      avatar: user.avatarUrl,
      nickname: user.nickName
    })
  },
  //重新编辑是返回原页面
  reEdit(){
    wx.navigateBack({})
  },
  //发表影评
  sendComment(){
    console.log(this.data.movieid, this.data.title, this.data.poster, this.data.commenttype, this.data.commentValue)
    qcloud.request({
      url: config.service.addComments,
      login: true,
      method: 'POST',
      data:{
        movieid: this.data.movieid,
        moviename: this.data.title,
        poster: this.data.poster,
        commenttype: this.data.commenttype,
        comment: this.data.commentValue,
      },
      success: result =>{
        wx.showLoading({
          title: '影评发布成功...',
        })
        setTimeout(()=>{
          wx.navigateTo({
            url: '/pages/comments/comments?id=' + this.data.movieid,
          })
        },2000)
      },  
      fail: () =>{
        wx.showLoading({
          title: '发布失败请重试',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 1500)
      }
    })
  },
  //播放音频
  playAudio(){
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.data.commentValue,
    console.log(this.data.commentValue)
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  }
})