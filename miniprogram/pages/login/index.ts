const app = getApp<IAppOption>()

Page({
  data: {
    phoneCode: undefined as string | undefined,
    privacy: false,
    checked: false
  },
  async getPhone(data: WXEvent) {
    const phoneCode = data.detail.code
    if (phoneCode) {
      this.setData({ phoneCode })

      await app.login(phoneCode)
    }
  },
  handleAgreePrivacyAuthorization() {
    this.setData({ checked: true })
  },
  onChange(data: any) {
    this.setData({ checked: data.detail })
  },
  handleOpenPrivacyContract() {
    wx.openPrivacyContract({})
  },
  async onShow() {
    wx.hideHomeButton()
    await app.login()
  }
})
