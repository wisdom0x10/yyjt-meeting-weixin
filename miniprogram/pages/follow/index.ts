const app = getApp<IAppOption>()

Page({
  data: {
    appid: null as null | string,
    src: null as null | string
  },
  async refresh() {
    await app.login(undefined, true)
  },
  onShow() {
    wx.hideHomeButton()
    this.refresh()
  },
  onPullDownRefresh() {
    this.refresh()
  }
})
