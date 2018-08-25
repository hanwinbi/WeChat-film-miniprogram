const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')

Page({
  data: {
    id: '',
    comments: []
  },
  onLoad: function(options) {
    this.setData({
      id: options.id
    })
    console.log(this.data.id)
    this.setComments(options.id)
  },
  //获取影评列表
  setComments(id) {
    wx.showLoading({
      title: '影评数据加载中...',
    })
    qcloud.request({
      url: config.service.commentsList + id,
      success: result => {
        console.log(result.data.data)
        let commentsList = result.data.data
        let length = commentsList.length
        let comments = []
        if (!result.data.code) {
          for(let i=0; i < length;i +=1){
            comments.push({
              avatar: commentsList[i].avatar,
              username: commentsList[i].username,
              comment: commentsList[i].comment,
              userid: commentsList[i].userid,
              movieid: commentsList[i].movieid,
              commenttype: commentsList[i].commenttype,
            })
          }
          this.setData({
            comments: comments
          })
          wx.hideLoading()
        } else {
          wx.showToast({
            title: '影评数据加载失败',
          })
        }
      },
      fail: result => {
        wx.hideLoading()
        wx.showToast({
          title: '影评数据加载失败',
        })
      },
    })
  },
  //回到主页
  toHome() {
    wx.redirectTo({
      url: '/pages/home/home',
    })
  },
  //跳转只影评详情页面
  toCommentDetail(event) {
    let userid = event.currentTarget.dataset.item.userid
    let username = event.currentTarget.dataset.item.username
    let avatar = event.currentTarget.dataset.item.avatar
    let comment = event.currentTarget.dataset.item.comment
    let movieid = event.currentTarget.dataset.item.movieid
    let commenttype = event.currentTarget.dataset.item.commenttype
    console.log(event.currentTarget.dataset.item.userid)
    wx.redirectTo({
      url: '/pages/commentDetail/commentDetail?data=' + [userid,username,avatar,movieid,comment,commenttype],
    })
  }
})