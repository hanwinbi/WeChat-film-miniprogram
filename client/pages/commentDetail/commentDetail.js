const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')

const app = getApp()
const innerAudioContext = wx.createInnerAudioContext()

Page({
  data: {
    actionSheetHidden: true,
    actionSheetItems: ['文字', '音频'],
    userid: '', 
    username: '', 
    avatar: '',
    movieid: '',
    comment: '',
    poster: '',
    title: '',
    commenttype: 0,
    userInfo: null,
    commented: 0,
  },
  onLoad: function(options){
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo,
        })
      },
    })
    let dataArr = options.data.split(',')  
    let userid = dataArr[0]
    let username = dataArr[1]
    let avatar = dataArr[2]
    let movieid = dataArr[3]
    let comment = dataArr[4]
    let commenttype = dataArr[5]
    if(this.data.userInfo.openId == userid)
    {
      this.setData({
        commented: 1
      })
    }

    this.setData({
      userid: userid,
      username: username,
      avatar: avatar,
      movieid: movieid,
      comment: comment,
      commenttype: commenttype
    })
    this.setComment()
  },
  //设置影评信息
  setComment() {
    if(this.data.commenttype == 1)
    {
      this.getAudio()
    }
    wx.getStorage({
      key: 'filmListKey',
      success: res => {
        let i = this.data.movieid - 1
        let film = res.data[i]
        this.setData({
          poster: film.image,
          title: film.title,
        })
      },
    })
  },
  getAudio(){
    wx.downloadFile({
      url: this.data.comment,
      success: res => {
        if (res.statusCode === 200) {
          this.setData({
            comment: res.tempFilePath
          })
        }
      }
    })
  },
  playAudio(){
      innerAudioContext.autoplay = true
      innerAudioContext.src = this.data.comment,
        console.log(this.data.comment)
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      })
      innerAudioContext.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
      })
  },
  //actionSheet
  actionSheetTap: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  actionSheetChange: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  //选择影评类型
  bindItemTap: function (e) {
    let choice = e.currentTarget.dataset.name
    let movieid = this.data.movieid
    let moviename = this.data.title
    let poster = this.data.poster
    wx.navigateTo({
      url: '/pages/addComment/addComment?info=' + [choice, movieid, moviename, poster],
    })
    console.log('tap' + choice)
  },
  addFavorite(){
    wx.getStorage({
      key: 'favoriteInfomation123',
      success: result => {
        let length = result.data.length
        let res = result.data
        console.log(res)
        for(let i = 0; i < length; i +=1)
        {
          if(res[i].movieid == this.data.movieid && res[i].userid == this.data.userid){
            wx.showToast({
              title: '已收藏',
            })
            setTimeout(function(){
              wx.hideLoading()
            },1500)
            break;
          }
          else{
            wx.showLoading({
              title: '收藏中...',
            })
            qcloud.request({
              url: config.service.addToFavorite,
              login: true,
              method: 'POST',
              data: {
                movieid: this.data.movieid,
                commentuserid: this.data.userid
              },
              success: result => {
                wx.hideLoading()
                console.log(result.data)
                console.log('插入数据成功')
              },
              fail: () => {
                wx.hideLoading()
                console.log('插入数据失败')
              }
            })
          }
        }
      },
    })
  },
  deleteComment(){
    wx.showLoading({
      title: '删除影评中...',
    })
    qcloud.request({
      url: config.service.delComment,
      login: true,
      method: 'PUT',
      data:{
        movieid: this.data.movieid,
      },
      success: result => {
        console.log('success')
        wx.hideLoading()
        wx.navigateTo({
          url: '/pages/comments/comments?id=' + this.data.movieid,
        })
      },
      fail: () =>{
        wx.hideLoading()
        console.log('fail')
      }
    })
  }
})