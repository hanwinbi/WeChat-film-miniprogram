const newsTypeMap ={
  0 : 'gn',
  1 : 'gj',
  2 : 'cj',
  3 : 'yl',
  4 : 'js',
  5 : 'ty',
  6 : 'other',
}

var app = getApp()
Page({
  data: {
    navbar: ['国内', '国际', '财经', '娱乐', '军事', '体育', '其他'],
    currentTab: 0,
    length: 0,
    essay: [],
    head_id: '',
    head_title: '',
    head_source: '',
    head_date: '',
    head_firstImage:'',
    newsType: 'gn',
  },
  onLoad() {
    this.getMessage('gn')
  },
  onPullDownRefresh(){
    this.getMessage(this.data.newsType)
    wx.stopPullDownRefresh()
  },

  //获取新闻列表
  getMessage(newstype) {
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        type: newstype,
      },
      success: res => {
        let result = res.data
        this.getNews(result)
      },
      complete: () => {
        
      }
    })
  },
  //获取新闻详情
  onTapNewsDetail: function(event){
    let id = event.currentTarget.id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id,
    })
  },
  //获取新闻
  getNews(result) {
    let essay = result.result
    this.setArticle(result.result)
  },
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    let newsType = newsTypeMap[e.currentTarget.dataset.idx]
    this.setData({
      newsType: newsType
    })
    this.getMessage(newsType)
  },
  //格式化时间
  setTime(time){
    time = time.toString()
    let b = new Date(time)
    if (b.getMinutes() < 10 || b.getHours() < 10 ){
      if (b.getHours() < 10 && b.getMinutes() < 10){
        return '0' + b.getHours().toString() + ":0" + b.getMinutes().toString()
      }
      else if (b.getHours() < 10){
        return '0' + b.getHours().toString() + ":" + b.getMinutes().toString()
      }
      else if (b.getMinutes() < 10) {
        return b.getHours().toString() + ":0" + b.getMinutes().toString()
      }
    }
    return b.getHours().toString() + ":" + b.getMinutes().toString()
  },
  //设定新闻
  setArticle(result){
    let essay = []
    for(let i = 0;i < result.length; i +=1 ){
      essay.push({
        id: result[i].id,
        title: result[i].title,
        date: this.setTime(result[i].date),
        source: result[i].source,
        firstImage: result[i].firstImage
      })
    }
    this.setData({
      head_id:result[0].id,
      head_title: result[0].title,
      head_date: this.setTime(result[0].date),
      head_source: result[0].source,
      head_firstImage: result[0].firstImage,
      essay: essay
    })
  },
})