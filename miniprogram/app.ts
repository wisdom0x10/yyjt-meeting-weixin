import './store/index'
import * as Api from './api/index'
import { getStoreData, storeCommit } from 'wxminishareddata'
import { wxLogin } from './utils/promise'
import { LOGIN_TYPE, PATH } from './enums/index'
import { getCurrentPath } from './utils/common'

App<IAppOption>({
  async onLaunch(options) {
    this.setMeetingId(options.query.id)
  },
  setMeetingId(id?: number) {
    if (id) {
      storeCommit('setId', id)
    }
  },
  async getMeetingTagList() {
    try {
      const res = await Api.getMeetingTagList()
      storeCommit('setTagList', res.data)
    } catch (error: any) {
      const message = error?.message ?? error.msg ?? '未知错误'
      wx.showModal({ content: message })
    }
  },
  async getMeetingTypeList() {
    try {
      const res = await Api.getMeetingTypeList()
      storeCommit('setTypeList', res.data)
    } catch (error: any) {
      const message = error?.message ?? error.msg ?? '未知错误'
      wx.showModal({ content: message })
    }
  },
  async getUserList() {
    try {
      const res = await Api.getUserList()
      storeCommit('setUserList', res.data)
    } catch (error: any) {
      const message = error?.message ?? error.msg ?? '未知错误'
      wx.showModal({ content: message })
    }
  },
  async login(phoneCode?: string) {
    wx.showLoading({ title: '加载中', mask: true })
    try {
      const wxLoginRes = await wxLogin()

      const { data: loginData } = await Api.login({
        code: wxLoginRes.code,
        appId: getStoreData().appId,
        phoneCode
      })

      const currentPath = getCurrentPath()
      if (!loginData.name) {
        // 未登录
        storeCommit('setLoginType', LOGIN_TYPE.NOT_REGISTRY)

        if (currentPath !== PATH.LOGIN) {
          wx.redirectTo({ url: PATH.LOGIN })
        }
      } else {
        storeCommit('setUserInfo', loginData)
        // 已登录
        if (loginData.attentionMp) {
          // 已授权
          storeCommit('setLoginType', LOGIN_TYPE.READY)

          if (currentPath !== PATH.DETAIL) {
            wx.redirectTo({ url: PATH.DETAIL })
          }
        } else {
          // 已授权
          storeCommit('setLoginType', LOGIN_TYPE.NOT_FOLLOW)

          if (currentPath !== PATH.FOLLOW) {
            wx.redirectTo({ url: PATH.FOLLOW })
          }
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
  getUserDetail(id?: number | number[]) {
    if (!id) {
      return ''
    }

    const userList = getStoreData().userList

    const getUserDetailById = (id: number) => {
      const row = userList.find((item: any) => item.id === id)
      if (row) {
        return `${row.name}<${row.mobile}>`
      } else {
        return ''
      }
    }
    if (typeof id === 'number') {
      return getUserDetailById(id)
    } else {
      return id.map((id) => getUserDetailById(id))
    }
  },
  getCategoryText(id: number) {
    const typeList = getStoreData().typeList

    const row = typeList.find((item: any) => item.id === id)

    if (row) {
      return row.name
    } else {
      return ''
    }
  }
})
