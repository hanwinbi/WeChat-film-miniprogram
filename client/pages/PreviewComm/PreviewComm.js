const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const COS = require('../../lib/cos-wx-sdk-v5.js')
const config = require('../../config.js')

const app = getApp()
const innerAudioContext = wx.createInnerAudioContext()

const host = 'https://audiorecord-1257225145.cos.ap-shanghai.myqcloud.com/'

const TypeMap = {
  '音频': 1,
  '文字': 0
}

var cos = new COS({
  getAuthorization: function (params, callback) {//获取签名 必填参数
    var authorization = COS.getAuthorization({
      SecretId: config.SecretId,
      SecretKey: config.SecretKey,
      Method: params.Method,
      Key: params.Key
    });
    callback(authorization);
  }
});

var requestCallback = function (err, data) {
  console.log(err || data);
  if (err && err.error) {
    wx.showModal({ title: '返回错误', content: '请求失败：' + err.error.Message + '；状态码：' + err.statusCode, showCancel: false });
  } else if (err) {
    wx.showModal({ title: '请求出错', content: '请求出错：' + err + '；状态码：' + err.statusCode, showCancel: false });
  } else {
    wx.showToast({ title: '请求成功', icon: 'success', duration: 3000 });
  }
};

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
    wx.showLoading({
      title: '影评发布中...',
    })
    this.uploadAudio()
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
        wx.hideLoading()
        setTimeout(()=>{
          wx.navigateTo({
            url: '/pages/comments/comments?id=' + this.data.movieid,
          })
        },1000)
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
  },
  uploadAudio(){
    if(this.data.commenttype == 1)
    {
      let filePath = this.data.commentValue
      let filename = filePath.substr(filePath.lastIndexOf('/') + 1);
      this.setData({
        commentValue: host + filename
      })
      console.log('文件路径',filePath,filename)
      cos.postObject({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: filename,
        FilePath: filePath,
        onProgress: function (info) {
          console.log(JSON.stringify(info));
        }
      }, function (err, data) {
        console.log(err || data);
      })

    }
  }
})