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
    planStartTime: undefined as undefined | string,
    planEndTime: undefined as undefined | string,
    startTime: undefined as undefined | string,
    endTime: undefined as undefined | string,
    address: undefined as undefined | string,
    internal: [] as any,
    content: undefined as undefined | string,
    decision: undefined as undefined | string,
    external: undefined as undefined | string,
    taskList: [],
    remark: undefined as undefined | string,
    meetingDeptName: undefined,
    showButton: false,

    isPreMeeting: false,

    visible: false,
    mode: 'content',

    activeNames: []
  },
  handleOpen(event: any) {
    const {
      target: { dataset }
    } = event

    this.setData({ visible: true, mode: dataset.mode })
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
        planStartTime: meeting.planStartTime,
        planEndTime: meeting.planEndTime,
        startTime: meeting.startTime,
        endTime: meeting.startTime,
        address: meeting.address,
        internal: app.getUserText(meeting.internalJoinerList ?? []),
        moderator: app.getUserText(meeting.moderator),
        recorder: app.getUserText(meeting.recorder),
        carbonCopyList: app.getUserText(meeting.carbonCopyList ?? []),
        content: this.formateContent(meeting.content),
        decision: meeting.decisionMatter,
        external: meeting.extJoiner,
        meetingDeptName: meeting.meetingDeptName ?? '',
        taskList: (meeting.meetingTaskList ?? []).map((item: any) => {
          return {
            ...item,
            checkerList: app.getUserText(item.checkerList ?? []),
            headerList: app.getUserText(item.headerList ?? [])
          }
        }),
        remark: meeting.remark,
        showButton: !meeting.unConfirmTask,
        isPreMeeting: meeting.statusValue === -1
      })
      console.log('this :>> ', this)
    } catch (error: any) {
      console.log('error :>> ', error)
      const message = error?.message ?? error.msg ?? '未知错误'
      wx.showModal({ content: message })
    } finally {
      wx.hideLoading({ noConflict: true })
    }
  },
  formateContent(content: string) {
    if (!content) return content
    let result = content
    while (result.endsWith('<p><br></p>')) {
      result = result.slice(0, -11)
    }
    return result
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
      app.getUserList()
    ])

    await this.refresh()

    if (this.data.showButton) {
      Api.changeTaskStatus({
        meetingId: Number(this.data.id),
        type: 0,
        status: 1
      })
    }
  },
  onChange(event: any) {
    this.setData({ activeNames: event.detail })
  },
  // 下拉刷新时触发
  async onPullDownRefresh() {
    await this.refresh()
    wx.stopPullDownRefresh()
  }
})
