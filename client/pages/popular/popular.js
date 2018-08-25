const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')

Page({
  data: {
    filmList: []
  },
  onLoad() {
    this.getFilmList()
  },
  //获取电影列表
  getFilmList() {
    wx.showLoading({
      title: '电影数据加载中...',
    })
    wx.getStorage({
      key: 'filmListKey',
      success: result => {
        wx.hideLoading()
        let list = result.data
        let length = result.data.length
        console.log(list)
        let filmList = []
        if (!result.data.code) {
          for (let i = 0; i < length; i += 1) {
            filmList.push({
              id: list[i].id,
              title: list[i].title,
              image: list[i].image,
              category: list[i].category,
              description: list[i].description
            })
          }
          this.setData({
            filmList: filmList
          })
        }
        else {
          wx.showToast({
            title: '电影数据加载失败！',
          })
        }
      },
    })
  },
  //跳转到电影详情
  tofilmDetail: function (event) {
    let id = event.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/filmDetail/filmDetail?id=' + id,
    })
  },
})