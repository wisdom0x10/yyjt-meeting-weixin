import { themeMixin } from '../../behaviors/theme'
import * as Api from '../../api/index'
import { getStoreData } from 'wxminishareddata'

const app = getApp<IAppOption>()

Page({
  behaviors: [themeMixin],
  data: {
    id: undefined as undefined | string,
    title: undefined as undefined | string,
    type: undefined as undefined | string,
    tags: [] as any[],
    startTime: undefined as undefined | string,
    endTime: undefined as undefined | string,
    address: undefined as undefined | string,
    internal: [] as any,
    content: undefined as undefined | string,
    decision: undefined as undefined | string,
    external: undefined as undefined | string,
    taskList: [],
    remark: undefined as undefined | string,
    showButton: false,

    visible: false,
    mode: 'content'
  },
  handleOpen(event: any) {
    const {
      target: { dataset }
    } = event

    switch (dataset.mode) {
      case 'content':
        this.setData({ visible: true, mode: 'content' })
        break
      case 'decision':
        this.setData({ visible: true, mode: 'decision' })
        break
      case 'task':
        this.setData({ visible: true, mode: 'task' })
        break
      default:
    }
  },
  handleClose() {
    this.setData({ visible: false })
  },
  async refresh() {
    try {
      wx.showLoading({ title: '加载中', mask: true })

      const store = getStoreData()

      const res = await Api.getMeetingDetail(this.data.id!)
      const meeting = res.data

      this.setData({
        title: meeting.theme,
        type: app.getCategoryText(meeting.categoryId),
        tags: store.tagList.filter((item: any) =>
          meeting.labelList.includes(item.id)
        ),
        startTime: meeting.startTime,
        endTime: meeting.startTime,
        address: meeting.address,
        internal: app.getUserText(meeting.internalJoinerList ?? []),
        moderator: app.getUserText(meeting.moderator),
        recorder: app.getUserText(meeting.recorder),
        carbonCopyList: app.getUserText(meeting.carbonCopyList ?? []),
        content: meeting.content,
        decision: meeting.decisionMatter,
        external: meeting.extJoiner,
        taskList: (meeting.meetingTaskList ?? []).map((item: any) => {
          return {
            ...item,
            checkerList: app.getUserText(item.checkerList ?? []),
            headerList: app.getUserText(item.headerList ?? [])
          }
        }),
        remark: meeting.remark,
        showButton: !meeting.unConfirmTask
      })
    } catch (error: any) {
      console.log('error :>> ', error)
      const message = error?.message ?? error.msg ?? '未知错误'
      wx.showModal({ content: message })
    } finally {
      wx.hideLoading({ noConflict: true })
    }
  },
  async confirmTask() {
    try {
      const { confirm } = await wx.showModal({
        content: '确认已查看所有任务？'
      })

      if (confirm) {
        wx.showLoading({ title: '加载中', mask: true })
        await Api.changeTaskStatus({
          meetingId: Number(this.data.id),
          type: 0,
          status: 2
        })

        await this.refresh()
      }
    } catch (error: any) {
      const message = error?.message ?? error.msg ?? '未知错误'
      wx.showModal({ content: message })
    } finally {
      wx.hideLoading({ noConflict: true })
    }
  },
  onLoad(options: any) {
    this.setData({ id: options.id })
  },
  async onShow() {
    await app.login()

    if (!getStoreData().token) return

    await Promise.allSettled([
      app.getTagList(),
      app.getTypeList(),
      app.getUserList(),
      Api.changeTaskStatus({
        meetingId: Number(this.data.id),
        type: 0,
        status: 1
      })
    ])

    this.refresh()
  },
  // 下拉刷新时触发
  async onPullDownRefresh() {
    await this.refresh()
    wx.stopPullDownRefresh()
  }
})
