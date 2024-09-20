import { themeMixin } from '../../behaviors/theme'
import * as Api from '../../api/index'
import { getStoreData, storeCommit } from 'wxminishareddata'
import { wxLogin } from '../../utils/promise'
import { LOGIN_TYPE, PATH } from '../../enums/index'

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
  async getDetail() {
    const store = getStoreData()
    try {
      if (!store.id) {
        await wx.showModal({
          content: '暂无会议内容！',
          showCancel: false
        })

        wx.exitMiniProgram()
        return
      } else {
        wx.showLoading({ title: '加载中', mask: true })

        const res = await Api.getMeetingDetail(store.id)
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
          internal: app.getUserDetail(meeting.internalJoinerList ?? []),
          moderator: app.getUserDetail(meeting.moderator),
          recorder: app.getUserDetail(meeting.recorder),
          carbonCopyList: app.getUserDetail(meeting.carbonCopyList ?? []),
          content: meeting.content,
          decision: meeting.decisionMatter,
          external: meeting.extJoiner,
          taskList: (meeting.meetingTaskList ?? []).map((item: any) => {
            return {
              ...item,
              checkerList: app.getUserDetail(item.checkerList ?? []),
              headerList: app.getUserDetail(item.headerList ?? [])
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
    } catch (error: any) {
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
        storeCommit('setLoading', { value: true })
        await Api.changeTaskStatus({
          meetingId: getStoreData().id,
          type: 0,
          status: 2
        })

        await this.getDetail()
      }
    } catch (error: any) {
      const message = error?.message ?? error.msg ?? '未知错误'
      wx.showModal({ content: message })
    } finally {
      storeCommit('setLoading', { value: false })
    }
  },
  async login() {
    wx.showLoading({ title: '加载中', mask: true })
    try {
      const wxloginRes = await wxLogin()

      const { data: loginData } = await Api.login({
        code: wxloginRes.code,
        appId: getStoreData().appId
      })

      if (!loginData.name) {
        // 未登录
        storeCommit('setLoginType', LOGIN_TYPE.NOT_REGISTRY)
        wx.redirectTo({ url: PATH.LOGIN })
      } else {
        storeCommit('setUserInfo', loginData)
        // 已登录
        if (loginData.attentionMp) {
          // 已授权
          storeCommit('setLoginType', LOGIN_TYPE.READY)
        } else {
          // 已授权
          storeCommit('setLoginType', LOGIN_TYPE.NOT_FOLLOW)
          wx.redirectTo({ url: PATH.FOLLOW })
        }
      }
      wx.hideLoading({ noConflict: true })
    } catch (error: any) {
      wx.hideLoading({ noConflict: true })
      await wx.showModal({
        content: error.message,
        showCancel: false,
        success() {
          wx.exitMiniProgram()
        }
      })
    }
  },
  async init() {
    try {
      await app.login()
      // 未登陆成功
      if (!getStoreData().token) {
        return
      }
      await Promise.allSettled([
        app.getMeetingTagList(),
        app.getMeetingTypeList(),
        app.getUserList()
      ])

      await this.getDetail()
    } catch (error: any) {
      wx.showModal({ content: error.message ?? error.msg, showCancel: false })
    }
  },
  async onLoad(options: any) {
    app.setMeetingId(options.id)

    this.init()
  },
  // 下拉刷新时触发
  async onPullDownRefresh() {
    await this.getDetail()
    wx.stopPullDownRefresh()
  }
})
