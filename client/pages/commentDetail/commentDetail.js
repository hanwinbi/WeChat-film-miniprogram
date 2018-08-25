const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')

const app = getApp()

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
    commenttype: 0
  },
  onLoad: function(options){
    let dataArr = options.data.split(',')  
    let userid = dataArr[0]
    let username = dataArr[1]
    let avatar = dataArr[2]
    let movieid = dataArr[3]
    let comment = dataArr[4]
    let commenttype = dataArr[5]

    console.log(dataArr)

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
    qcloud.request({
      url: config.service.addToFavorite,
      login: true,
      method: 'POST',
      data:{
        movieid: this.data.movieid,
        commentuserid: this.data.userid
      },
      success: result => {
        console.log('插入数据成功')
      },
      fail: () => {
        console.log('插入数据失败')
      }
    })
  },
})