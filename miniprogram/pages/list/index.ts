import { PATH } from '../../enums/index'
import { getMeetingPage } from '../../api/index'
import { getStoreData } from 'wxminishareddata'

const app = getApp<IAppOption>()

Page({
  data: {
    page: 1,
    size: 15,
    total: 0,
    theme: undefined as string | undefined,
    list: [] as any[]
  },
  handleSearch(event: WechatMiniprogram.InputEvent) {
    this.setData({ theme: event.detail as unknown as string })
    this.refresh({ force: true })
  },
  async refresh({
    force = false,
    loading = true
  }: {
    force?: boolean
    loading?: boolean
  } = {}) {
    try {
      if (force) {
        this.setData({ page: 1, total: 0 })
      } else {
        if (this.data.page * this.data.size < this.data.total) {
          this.setData({ page: this.data.page + 1 })
        } else {
          return
        }
      }

      loading && wx.showLoading({ title: '加载中', mask: true })

      const response = await getMeetingPage({
        page: this.data.page,
        size: this.data.size,
        theme: this.data.theme
      })
      const list = force
        ? response.data.list
        : [...this.data.list, ...response.data.list]

      this.setData({ list, total: response.data.total })
    } catch (error) {
      console.log('error :>> ', error)
    } finally {
      loading && wx.hideLoading({ noConflict: true })
    }
  },
  handleToDetail(event: WechatMiniprogram.Event) {
    const id = event.target.dataset.id

    wx.navigateTo({ url: `${PATH.DETAIL}?id=${id}` })
  },
  async onPullDownRefresh() {
    await this.refresh({ force: true, loading: false })

    wx.stopPullDownRefresh()
  },
  onReachBottom() {
    this.refresh()
  },
  async onShow() {
    await app.login()

    if (!getStoreData().token) return

    this.refresh({ force: true })
  }
})
