import { wxLogin } from '../../utils/promise'
import * as Api from '../../api/index'
import {
  effect,
  getStoreData,
  storeCommit,
  storeDispatch
} from 'wxminishareddata'
import { LOGIN_TYPE, PATH } from '../../enums/index'
import { BASE_URL, BASE_URL_HTTP } from '../../configs/index'

Page({
  data: {
    appid: null as null | string,
    src: null as null | string,
    index: 1
  },
  async handleLoad() {
    const { confirm } = await wx.showModal({
      content: '加载成功,点击刷新',
      showCancel: false
    })
    if (confirm) {
      await this.refresh()
      this.back()
    }
  },
  async getAppid() {
    try {
      storeCommit('setLoading', { value: true })
      const data = await Api.getAppid()

      const { code } = await wxLogin()
      const APPID = data.data
      const server = BASE_URL + '/wx/mp/back'
      const YOUR_REDIRECT_URI = encodeURIComponent(`${server}?maCode=${code}`)
      console.log('YOUR_REDIRECT_URI :>> ', `${server}?maCode=${code}`)
      const SCOPE = 'snsapi_base'
      const src = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${YOUR_REDIRECT_URI}&response_type=code&scope=${SCOPE}&state=STATE#wechat_redirect`
      console.log('src :>> ', src)
      this.setData({ src })
    } catch (error: any) {
      console.log('error :>> ', error)
    } finally {
      storeCommit('setLoading', { value: false })
    }
  },
  next() {
    this.setData({ index: this.data.index + 1 })
  },
  back() {
    this.setData({ index: this.data.index - 1 })
  },
  toDetail() {
    wx.redirectTo({ url: PATH.DETAIL })
  },
  async refresh() {
    await storeDispatch('login')
  },
  onLoad() {
    effect(this.getAppid, {
      scheduler: (fn: any) => {
        if (getStoreData().token) {
          fn()
        }
      },
      lazy: false
    })

    effect(() => {
      const loginType = getStoreData().loginType
      console.log('loginType :>> ', loginType)
      if (loginType === LOGIN_TYPE.READY) {
        wx.redirectTo({ url: PATH.DETAIL })
      }
    })
  }
})
