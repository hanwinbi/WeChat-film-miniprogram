const recorderManager = wx.getRecorderManager()

const TypeMap = {
  '音频': 1,
  '文字': 0
}

Page({
  data: {
    commentValue: '',
    inputType: '',
    movieInfo: [],
    title: '',
    poster: '',
    recordState: 0,
    tempFilePath: ''
  },

  onLoad: function(options) {
    let dataArr = options.info.split(',')
    this.setData({
      inputType: TypeMap[dataArr[0]],
      movieInfo: options.info,
      title: dataArr[2],
      poster: dataArr[3]
    })
    console.log(this.data.movieInfo)
  },
  onInput(event) {
    this.setData({
      commentValue: event.detail.value.trim()
    })
  },
  //前往预览页面
  toPreComm() {
    let comment = this.data.commentValue
    let tempPath = this.data.tempFilePath
    let type = this.data.inputType
    console.log(type)
    if(!type){
      wx.navigateTo({
        url: '/pages/PreviewComm/PreviewComm?comments=' + [this.data.movieInfo, comment],
      })
    }
    if(type){
      wx.navigateTo({
        url: '/pages/PreviewComm/PreviewComm?comments=' + [this.data.movieInfo, tempPath],
      })
    }
  },
  //录音，点击后切换状态，开始、暂停录音
  onRecord() {
    console.log('test')
    let state = this.data.recordState
    if (!state) {
      const options = {
        duration: 10000,
        sampleRate: 44100,
        numberOfChannels: 1,
        encodeBitRate: 192000,
        format: 'aac',
        frameSize: 50
      }
      recorderManager.start(options);
      recorderManager.onStart(() => {
        wx.showLoading({
          title: '录音中...',
        })
      })
      recorderManager.onError((res) => {
        console.log(res);
      })
      this.changeRecordState()
    }
    if (state) {
      recorderManager.stop();
      recorderManager.onStop((res) => {
        wx.hideLoading()
        this.setData({
          tempFilePath: res.tempFilePath
        })
        console.log('停止录音', res.tempFilePath)
        const {tempFilePath} = res
      })
      this.changeRecordState()
    }
  },
  //切换录音状态
  changeRecordState() {
    this.setData({
      recordState: !this.data.recordState
    })
  }
})