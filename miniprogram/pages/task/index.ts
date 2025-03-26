Page({
  data: {
    eventChannel: undefined as any,
    checkColumns: [
      { text: '已完成', value: '已完成' },
      { text: '未完成', value: '未完成' }
    ],
    userList: [] as any[],

    title: '',
    description: '',
    expectedResult: '',
    criterion: '',
    headerList: [],
    endTime: '',
    incentiveMeasures: '',
    checkerList: [],
    checkText: undefined
  },
  onLoad() {
    const eventChannel = this.getOpenerEventChannel()
    this.setData({ eventChannel })
    eventChannel.on('init', (data) => {
      this.setData(data)
    })
  },
  handleMultiplePicker(event: any) {
    const that = this
    const key = event.currentTarget.dataset.key
    if (key === 'headerList') {
      wx.navigateTo({
        url: '/pages/picker/index',
        events: {
          change(data: any) {
            that.setData({ headerList: data })
          }
        },
        success(res) {
          res.eventChannel.emit('init', {
            list: that.data.userList,
            multiple: true,
            selected: that.data.headerList
          })
        }
      })
    } else if (key === 'checkerList') {
      wx.navigateTo({
        url: '/pages/picker/index',
        events: {
          change(data: any) {
            that.setData({ checkerList: data })
          }
        },
        success(res) {
          res.eventChannel.emit('init', {
            list: that.data.userList,
            multiple: true,
            selected: that.data.checkerList
          })
        }
      })
    }
  },
  handleChange(event: any) {
    const key = event.currentTarget.dataset.key
    this.setData({ [key]: event.detail })
  },
  handleSubmit() {
    if (!this.data.title) {
      wx.showToast({ title: '请输入工作任务', icon: 'none' })
    } else if (!this.data.description) {
      wx.showToast({ title: '请输入任务描述', icon: 'none' })
    } else if (!this.data.expectedResult) {
      wx.showToast({ title: '请输入预期成果', icon: 'none' })
    } else if (!this.data.criterion) {
      wx.showToast({ title: '请输入评判标准', icon: 'none' })
    } else if (this.data.headerList.length === 0) {
      wx.showToast({ title: '请选择负责人', icon: 'none' })
    } else if (!this.data.incentiveMeasures) {
      wx.showToast({ title: '请输入奖惩措施', icon: 'none' })
    } else if (!this.data.endTime) {
      wx.showToast({ title: '请选择截止时间', icon: 'none' })
    } else if (this.data.checkerList.length === 0) {
      wx.showToast({ title: '请选择检查人', icon: 'none' })
    } else {
      this.data.eventChannel.emit('change', {
        title: this.data.title,
        description: this.data.description,
        expectedResult: this.data.expectedResult,
        criterion: this.data.criterion,
        headerList: this.data.headerList,
        endTime: this.data.endTime,
        incentiveMeasures: this.data.incentiveMeasures,
        checkerList: this.data.checkerList,
        checkText: this.data.checkText,
        checkValue:
          this.data.checkText === undefined ? undefined : this.data.checkText === '已完成' ? 0 : 1
      })
      wx.navigateBack()
    }
  }
})
