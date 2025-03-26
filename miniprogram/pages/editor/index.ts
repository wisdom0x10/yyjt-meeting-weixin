import { effect, getStoreData } from 'wxminishareddata'
import { addMeeting, getDeptSimpleList, getUserSimpleList } from '../../api/index'
import { handleTree } from '../../utils/tree'
import * as Api from '../../api/index'

const app = getApp<IAppOption>()
Page({
  data: {
    type: 'create',

    deptFieldNames: { text: 'name', value: 'id', children: 'children' },
    deptList: [] as any[],
    userList: [] as any[],
    typeList: [],
    tagList: [],

    isPreMeeting: false,

    ifPlan: 0,

    taskShow: false,

    id: undefined,
    theme: undefined,
    categoryId: undefined,
    labelList: [] as any[],
    startTime: undefined,
    endTime: undefined,
    planStartTime: undefined,
    planEndTime: undefined,
    extJoiner: undefined,
    address: undefined,
    moderator: undefined,
    recorder: undefined,
    carbonCopyList: [] as any[],
    content: undefined,
    decisionMatter: undefined,
    statusValue: undefined,
    typeValue: 0,
    internalJoinerList: [] as any[],
    remark: undefined,
    meetingTaskList: [] as any[],
    meetingDeptId: undefined,

    origin: {}
  },
  handleChange(event: any) {
    const key = event.currentTarget.dataset.key
    this.setData({ [key]: event.detail })
  },
  async getDeptList() {
    const response = await getDeptSimpleList()
    this.setData({
      deptList: handleTree(
        response.data,
        'code',
        'parentCode',
        undefined,
        ({ target, data }: any) => {
          const parentCode = target.parentCode
          const parent = data.find((_: any) => _.code === parentCode)
          if (parent) {
            target.fullName = `${parent.fullName}>${target.name}`
          } else {
            target.fullName = target.name
          }
        }
      )
    })
  },
  async getUserList() {
    const response = await getUserSimpleList()
    this.setData({
      userList: response.data.map((item: any) => {
        return {
          text: `${item.nickname}-${item.name}`,
          name: item.name,
          nickname: item.nickname,
          value: item.id
        }
      })
    })
  },
  handleMultiplePicker(event: any) {
    const that = this
    const key = event.currentTarget.dataset.key
    if (key === 'internalJoinerList') {
      wx.navigateTo({
        url: '/pages/picker/index',
        events: {
          change(data: any) {
            that.setData({ internalJoinerList: data })
          }
        },
        success(res) {
          res.eventChannel.emit('init', {
            list: that.data.userList,
            multiple: true,
            selected: that.data.internalJoinerList
          })
        }
      })
    } else if (key === 'moderator') {
      const list = that.data.userList.filter((item: any) =>
        that.data.internalJoinerList.includes(item.value)
      )
      wx.navigateTo({
        url: '/pages/picker/index',
        events: {
          change(data: any) {
            that.setData({ moderator: data[0] })
          }
        },
        success(res) {
          res.eventChannel.emit('init', {
            list,
            multiple: false,
            selected: [that.data.moderator]
          })
        }
      })
    } else if (key === 'recorder') {
      const list = that.data.userList.filter((item: any) =>
        that.data.internalJoinerList.includes(item.value)
      )
      wx.navigateTo({
        url: '/pages/picker/index',
        events: {
          change(data: any) {
            that.setData({ recorder: data[0] })
          }
        },
        success(res) {
          res.eventChannel.emit('init', {
            list,
            multiple: false,
            selected: [that.data.recorder]
          })
        }
      })
    } else if (key === 'carbonCopyList') {
      wx.navigateTo({
        url: '/pages/picker/index',
        events: {
          change(data: any) {
            that.setData({ carbonCopyList: data })
          }
        },
        success(res) {
          res.eventChannel.emit('init', {
            list: that.data.userList,
            multiple: true,
            selected: that.data.carbonCopyList
          })
        }
      })
    } else if (key === 'labelList') {
      const list = that.data.tagList
      wx.navigateTo({
        url: '/pages/picker/index',
        events: {
          change(data: any) {
            that.setData({ labelList: data })
          }
        },
        success(res) {
          res.eventChannel.emit('init', {
            list,
            showAnchor: false,
            multiple: true,
            selected: that.data.labelList
          })
        }
      })
    }
  },
  handleRichText(event: any) {
    const that = this
    const key = event.currentTarget.dataset.key
    if (key === 'content') {
      wx.navigateTo({
        url: '/pages/rich-text/index',
        events: {
          change(data: any) {
            that.setData({ content: data })
          }
        },
        success(res) {
          res.eventChannel.emit('init', {
            content: that.data.content
          })
        }
      })
    } else if (key === 'decisionMatter') {
      wx.navigateTo({
        url: '/pages/rich-text/index',
        events: {
          change(data: any) {
            that.setData({ decisionMatter: data })
          }
        },
        success(res) {
          res.eventChannel.emit('init', {
            content: that.data.decisionMatter
          })
        }
      })
    }
  },
  handleTaskVisible(event: any) {
    this.setData({ taskShow: !this.data.taskShow })
  },
  handleTask(event: any) {
    const that = this
    const type = event.currentTarget.dataset.type
    const index = event.currentTarget.dataset.index

    if (type === 'delete') {
      this.data.meetingTaskList.splice(index, 1)
      this.setData({ meetingTaskList: [...this.data.meetingTaskList] })
    } else if (type === 'create') {
      wx.navigateTo({
        url: '/pages/task/index',
        events: {
          change(data: any) {
            that.data.meetingTaskList.push(data)
            that.setData({ meetingTaskList: [...that.data.meetingTaskList] })
          }
        },
        success(res) {
          res.eventChannel.emit('init', {
            userList: that.data.userList
          })
        }
      })
    } else if (type === 'edit') {
      wx.navigateTo({
        url: '/pages/task/index',
        events: {
          change(data: any) {
            that.data.meetingTaskList.splice(index, 1, data)
            that.setData({ meetingTaskList: [...that.data.meetingTaskList] })
          }
        },
        success(res) {
          res.eventChannel.emit('init', {
            userList: that.data.userList,
            ...that.data.meetingTaskList[index]
          })
        }
      })
    }
  },
  noop() {},
  async handleSubmit() {
    try {
      if (this.data.type === 'create') {
        if (this.data.ifPlan === 0) {
          if (!this.data.theme) {
            return wx.showToast({ title: '请输入会议主题', icon: 'none' })
          } else if (!this.data.typeList) {
            return wx.showToast({ title: '请选择会议类型', icon: 'none' })
          } else if (this.data.labelList.length === 0) {
            return wx.showToast({ title: '请选择会议标签', icon: 'none' })
          } else if (!this.data.startTime) {
            return wx.showToast({ title: '请选择会议开始时间', icon: 'none' })
          } else if (!this.data.endTime) {
            return wx.showToast({ title: '请选择会议结束时间', icon: 'none' })
          } else if (!this.data.meetingDeptId) {
            return wx.showToast({ title: '请选择发起部门', icon: 'none' })
          } else if (!this.data.planStartTime) {
            return wx.showToast({ title: '请选择签到开始时间', icon: 'none' })
          } else if (!this.data.planEndTime) {
            return wx.showToast({ title: '请选择签到结束时间', icon: 'none' })
          } else if (this.data.internalJoinerList.length === 0) {
            return wx.showToast({ title: '请选择内部参会人员', icon: 'none' })
          } else if (!this.data.moderator) {
            return wx.showToast({ title: '请选择会议主持人', icon: 'none' })
          } else if (!this.data.recorder) {
            return wx.showToast({ title: '请选择会议记录人', icon: 'none' })
          } else if (!this.data.address) {
            return wx.showToast({ title: '请输入会议地点', icon: 'none' })
          }
          await addMeeting({
            labelList: this.data.labelList,
            internalJoinerList: this.data.internalJoinerList,
            carbonCopyList: this.data.carbonCopyList,
            ifPlan: this.data.ifPlan,
            startTime: this.data.startTime,
            endTime: this.data.endTime,
            planStartTime: this.data.planStartTime,
            planEndTime: this.data.planEndTime,
            moderator: this.data.moderator,
            recorder: this.data.recorder,
            theme: this.data.theme,
            categoryId: this.data.categoryId,
            meetingDeptId: this.data.meetingDeptId,
            extJoiner: this.data.extJoiner,
            address: this.data.address
          })
        } else {
          if (!this.data.theme) {
            return wx.showToast({ title: '请输入会议主题', icon: 'none' })
          } else if (!this.data.typeList) {
            return wx.showToast({ title: '请选择会议类型', icon: 'none' })
          } else if (this.data.labelList.length === 0) {
            return wx.showToast({ title: '请选择会议标签', icon: 'none' })
          } else if (!this.data.startTime) {
            return wx.showToast({ title: '请选择会议开始时间', icon: 'none' })
          } else if (!this.data.endTime) {
            return wx.showToast({ title: '请选择会议结束时间', icon: 'none' })
          } else if (!this.data.meetingDeptId) {
            return wx.showToast({ title: '请选择发起部门', icon: 'none' })
          } else if (this.data.internalJoinerList.length === 0) {
            return wx.showToast({ title: '请选择内部参会人员', icon: 'none' })
          } else if (!this.data.moderator) {
            return wx.showToast({ title: '请选择会议主持人', icon: 'none' })
          } else if (!this.data.recorder) {
            return wx.showToast({ title: '请选择会议记录人', icon: 'none' })
          } else if (!this.data.address) {
            return wx.showToast({ title: '请输入会议地点', icon: 'none' })
          } else if (!this.data.content) {
            return wx.showToast({ title: '请输入会议内容', icon: 'none' })
          } else if (!this.data.decisionMatter) {
            return wx.showToast({ title: '请输入决策事项', icon: 'none' })
          } else if (this.data.meetingTaskList.length === 0) {
            return wx.showToast({ title: '请填写任务分配', icon: 'none' })
          }
          await addMeeting({
            labelList: this.data.labelList,
            internalJoinerList: this.data.internalJoinerList,
            meetingTaskList: this.data.meetingTaskList,
            carbonCopyList: this.data.carbonCopyList,
            startTime: this.data.startTime,
            endTime: this.data.endTime,
            moderator: this.data.moderator,
            recorder: this.data.recorder,
            theme: this.data.theme,
            categoryId: this.data.categoryId,
            meetingDeptId: this.data.meetingDeptId,
            extJoiner: this.data.extJoiner,
            address: this.data.address,
            content: this.data.content,
            decisionMatter: this.data.decisionMatter,
            remark: this.data.remark,
            typeValue: this.data.typeValue,
            meetingTime: [this.data.startTime, this.data.endTime]
          })
        }

        wx.showToast({
          title: '新增成功',
          icon: 'success',
          mask: true,
          duration: 2000
        })
      } else {
        await Api.updateMeeting({
          ...this.data.origin,
          labelList: this.data.labelList,
          internalJoinerList: this.data.internalJoinerList,
          meetingTaskList: this.data.meetingTaskList,
          carbonCopyList: this.data.carbonCopyList,
          startTime: this.data.startTime,
          endTime: this.data.endTime,
          moderator: this.data.moderator,
          recorder: this.data.recorder,
          theme: this.data.theme,
          categoryId: this.data.categoryId,
          meetingDeptId: this.data.meetingDeptId,
          extJoiner: this.data.extJoiner,
          planStartTime: this.data.planStartTime,
          planEndTime: this.data.planEndTime,
          address: this.data.address,
          content: this.data.content,
          decisionMatter: this.data.decisionMatter
        })

        wx.showToast({
          title: '更新成功',
          icon: 'success',
          mask: true,
          duration: 2000
        })
      }
      setTimeout(() => {
        wx.redirectTo({ url: '/pages/list/index' })
      }, 1500)
    } catch (error) {
      console.log('[ error ] >>', error)
    }
  },
  async refresh(id: any) {
    try {
      wx.showLoading({ title: '加载中', mask: true })

      const res = await Api.getMeetingDetail(id)
      const meeting = res.data

      this.setData({
        id: meeting.id,
        theme: meeting.theme,
        categoryId: meeting.categoryId,
        planStartTime: meeting.planStartTime,
        planEndTime: meeting.planEndTime,
        startTime: meeting.startTime,
        endTime: meeting.startTime,
        address: meeting.address,
        internalJoinerList: meeting.internalJoinerList,
        moderator: meeting.moderator,
        recorder: meeting.recorder,
        carbonCopyList: meeting.carbonCopyList,
        content: meeting.content,
        meetingDeptId:meeting.meetingDeptId,
        decision: meeting.decisionMatter,
        external: meeting.extJoiner,
        meetingDeptName: meeting.meetingDeptName ?? '',
        meetingTaskList: meeting.meetingTaskList,
        remark: meeting.remark,
        edit: meeting.edit,
        ifPlan: meeting.ifPlan,
        labelList: meeting.labelList,
        statusValue: meeting.statusValue,
        origin: meeting,
        isPreMeeting: meeting.statusValue === -1
      })
    } catch (error: any) {
      const message = error?.message ?? error.msg ?? '未知错误'
      wx.showModal({ content: message })
    } finally {
      wx.hideLoading({ noConflict: true })
    }
  },
  async onLoad(option) {
    if (option.type === 'edit') {
      this.refresh(option.id)
      this.setData({ type: 'edit' })
    } else {
      const ifPlan = Number(option.ifPlan)
      this.setData({
        ifPlan: isNaN(ifPlan) ? 0 : ifPlan,
        type: 'create',
        isPreMeeting: isNaN(ifPlan)
      })
    }
    effect(() => {
      this.setData({
        typeList: getStoreData().typeList.map((item: any) => {
          return { text: item.name, value: item.id }
        }),
        tagList: getStoreData().tagList.map((item: any) => {
          return { text: item.name, value: item.id }
        })
      })
    })
  },
  async onShow() {
    await app.login()

    if (!getStoreData().token) return

    await Promise.all([app.getTypeList(), app.getTagList(), this.getDeptList(), this.getUserList()])
  }
})
