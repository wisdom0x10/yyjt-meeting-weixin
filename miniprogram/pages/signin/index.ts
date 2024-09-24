import { signIn } from '../../api/index'
import { PATH } from '../../enums/index'

const app = getApp<IAppOption>()

Page({
  data: {
    id: undefined as undefined | number
  },
  async onLoad(options) {
    if (options.id) {
      this.setData({ id: Number(options.id) })
    } else {
      await wx.redirectTo({ url: PATH.LIST })
    }
  },
  async onShow() {
    if (this.data.id) {
      try {
        await app.login()

        const response = await signIn({ meetingId: this.data.id })

        await wx.showModal({
          content: response.message,
          showCancel: false,
          success() {
            wx.exitMiniProgram()
          }
        })
      } catch (error: any) {
        await wx.showModal({
          content: error.message,
          showCancel: false,
          success() {
            wx.exitMiniProgram()
          }
        })
      }
    }
  }
})
