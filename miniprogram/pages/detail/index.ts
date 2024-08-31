import { themeMixin } from '../../behaviors/theme'
import * as Api from '../../api/index'
import { effect, getStoreData, storeCommit } from 'wxminishareddata'

Page({
  behaviors: [themeMixin],
  data: {
    id: undefined as undefined | string,
    title: undefined as undefined | string,
    type: undefined as undefined | string,
    tags: [],
    startTime: undefined as undefined | string,
    endTime: undefined as undefined | string,
    address: undefined as undefined | string,
    internal: [],
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
  async getDetail() {
    try {
      if (!getStoreData().id) {
        await wx.showModal({
          content: '暂无会议内容！',
          showCancel: false
        })

        wx.exitMiniProgram()
        return
      } else if (getStoreData().token) {
        storeCommit('setLoading', { value: true })

        const data: any = await Promise.allSettled([
          Api.getMeetingDetail(getStoreData().id),
          Api.getMeetingTagList(),
          Api.getMeetingTypeList(),
          Api.getUserList()
        ])

        const meeting = data[0].value.data
        const tagList = data[1].value.data
        const typeList = data[2].value.data
        const userList = data[3].value.data

        const category = typeList.find(
          (item: any) => meeting.categoryId === item.id
        )

        this.setData({
          title: meeting.theme,
          type: category.name,
          tags: tagList.filter((item: any) =>
            meeting.labelList.includes(item.id)
          ),
          startTime: meeting.startTime,
          endTime: meeting.startTime,
          address: meeting.address,
          internal: (meeting.internalJoinerList ?? []).map((id: number) => {
            const row = userList.find((item: any) => item.id === id)
            return `${row.name}<${row.mobile}>`
          }),
          content: meeting.content,
          decision: meeting.decisionMatter,
          external: meeting.extJoiner,
          taskList: (meeting.meetingTaskList ?? []).map((item: any) => {
            return {
              ...item,
              checkerList: (item.checkerList ?? []).map((id: number) => {
                const row = userList.find((item: any) => item.id === id)
                return `${row.name}<${row.mobile}>`
              }),
              headerList: (item.headerList ?? []).map((id: number) => {
                const row = userList.find((item: any) => item.id === id)
                return `${row.name}<${row.mobile}>`
              })
            }
          }),
          remark: meeting.remark,
          showButton: !meeting.unConfirmTask
        })

        Api.changeTaskStatus({
          meetingId: getStoreData().id,
          type: 0,
          status: 1
        })
      }
    } catch (error) {
      console.log('error :>> ', error)
    } finally {
      storeCommit('setLoading', { value: false })
    }
  },
  async confirmTask() {
    try {
      const { confirm } = await wx.showModal({
        content: '确认已查看所有任务？'
      })

      if (confirm) {
        storeCommit('setLoading', { value: true })
        await Api.changeTaskStatus({
          meetingId: getStoreData().id,
          type: 0,
          status: 2
        })

        await this.getDetail()
      }
    } catch (error) {
      console.log('error :>> ', error)
    } finally {
      storeCommit('setLoading', { value: false })
    }
  },
  async onLoad() {
    effect(this.getDetail)
  },
  // 下拉刷新时触发
  async onPullDownRefresh() {
    await this.getDetail()
    wx.stopPullDownRefresh()
  }
})
