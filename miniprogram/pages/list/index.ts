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

      const responseList = response.data.list.map((item) => {
        return {
          ...item,
          categoryText: app.getCategoryText(item.categoryId),
          labelList: item.labelList.map((id: number) => {
            return getStoreData().tagList.find((typeItem: any) => typeItem.id === id)
          }),
          taskTagText: `${item.checkedCount}/${item.taskCount}`,
          taskTagColor: item.checkedCount === item.taskCount ? '#95d475' : '#f89898'
        }
      })
      const list = force ? responseList : [...this.data.list, ...responseList]

      this.setData({ list, total: response.data.total })
    } catch (error: any) {
      wx.showModal({ title: error.message ?? '未知错误', showCancel: false })
    } finally {
      loading && wx.hideLoading({ noConflict: true })
    }
  },
  handleToDetail(event: WechatMiniprogram.Event) {
    const id = event.target.dataset.id

    wx.navigateTo({ url: `${PATH.DETAIL}?id=${id}` })
  },
  async onPullDownRefresh() {
    await Promise.all([app.getTypeList(true), app.getTagList(true)])

    await this.refresh({ force: true, loading: false })

    wx.stopPullDownRefresh()
  },
  onReachBottom() {
    this.refresh()
  },
  async onShow() {
    await app.login()

    if (!getStoreData().token) return

    await Promise.all([app.getTypeList(), app.getTagList()])

    this.refresh({ force: true })
  }
})
