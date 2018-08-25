Page({
  data:{
    id: '',
    title: '',
    date: '',
    source: '',
    readCount: '',
    firstImage: '',
    content: [],
  },
  onLoad(options){
    this.setData({
      id: options.id
    })
    this.getarticleDetail(options.id)
  },
  getarticleDetail(id){
    wx.request({
      url: 'https://test-miniprogram.com/api/news/detail',
      data:{
        id: id
      },
      success: res => {
        let result = res.data.result
        this.setTitle(result)
        this.setContent(result)
      },
      complete: () => {
      }
    })
  },
  setTitle(result){
    this.setData({
      title: result.title,
      date: this.setTime(result.date),
      source: result.source,
      readCount: result.readCount
    })
  },
  setContent(result){
    let contentDetail = []
    for(let i = 0; i < result.content.length; i +=1)
    {
      if(result.content[i].text){
        contentDetail.push({
          newstype: result.content[i].type,
          text: result.content[i].text,
          src: '',
        })
      }
      else{
        contentDetail.push({
          newstype: result.content[i].type,
          text: '',
          src: result.content[i].src,
        })
      }
    }
    this.setData({
      content: contentDetail
    })
  },
  //格式化时间
  setTime(time) {
    time = time.toString()
    let b = new Date(time)
    if (b.getMinutes() < 10 || b.getHours() < 10) {
      if (b.getHours() < 10 && b.getMinutes() < 10) {
        return '0' + b.getHours().toString() + ":0" + b.getMinutes().toString()
      }
      else if (b.getHours() < 10) {
        return '0' + b.getHours().toString() + ":" + b.getMinutes().toString()
      }
      else if (b.getMinutes() < 10) {
        return b.getHours().toString() + ":0" + b.getMinutes().toString()
      }
    }
    return b.getHours().toString() + ":" + b.getMinutes().toString()
  },

})