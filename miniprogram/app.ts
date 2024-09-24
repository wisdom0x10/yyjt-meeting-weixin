import './store/index'
import * as Api from './api/index'
import { getStoreData, storeCommit } from 'wxminishareddata'
import { wxLogin } from './utils/promise'
import { LOGIN_TYPE, PATH } from './enums/index'
import { getCurrentPath } from './utils/common'

App<IAppOption>({
  async getTagList() {
    try {
      const res = await Api.getTagList()
      storeCommit('setTagList', res.data)
    } catch (error: any) {
      const message = error?.message ?? error.msg ?? '未知错误'
      wx.showModal({ content: message })
    }
  },
  async getTypeList() {
    try {
      const res = await Api.getTypeList()
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
  async login(phoneCode?: string, force = false) {
    try {
      if (getStoreData().token && !force) {
        return
      }
      wx.showLoading({ title: '加载中', mask: true })
      const wxLoginRes = await wxLogin()

      const { data: loginData } = await Api.login({
        code: wxLoginRes.code,
        appId: getStoreData().appId,
        phoneCode
      })

      const currentPath = getCurrentPath()
      console.log('loginData :>> ', loginData)
      console.log('currentPath :>> ', currentPath)
      storeCommit('setUserInfo', loginData)
      if (!loginData.name) {
        // 未登录
        storeCommit('setLoginType', LOGIN_TYPE.NOT_REGISTRY)
        if (currentPath !== PATH.LOGIN) {
          await wx.redirectTo({ url: PATH.LOGIN })
        }
      } else {
        // 已登录
        if (loginData.attentionMp) {
          // 已授权公众号
          storeCommit('setLoginType', LOGIN_TYPE.READY)
          if ([PATH.FOLLOW, PATH.LOGIN].includes(currentPath as PATH)) {
            await wx.redirectTo({ url: PATH.LIST })
          }
        } else {
          // 未授权公众号
          storeCommit('setLoginType', LOGIN_TYPE.NOT_FOLLOW)
          if (currentPath !== PATH.FOLLOW) {
            await wx.redirectTo({ url: PATH.FOLLOW })
          }
        }
      }
    } catch (error: any) {
      await wx.showModal({
        content: error.message,
        showCancel: false,
        success() {
          wx.exitMiniProgram()
        }
      })
    } finally {
      wx.hideLoading()
    }
  },
  getUserText(id?: number | number[]) {
    if (!id) {
      return ''
    }

    const userList = getStoreData().userList

    const getUserTextById = (id: number) => {
      const row = userList.find((item: any) => item.id === id)

      return row ? `${row.name}<${row.mobile}>` : ''
    }
    if (typeof id === 'number') {
      return getUserTextById(id)
    } else {
      return id.map((id) => getUserTextById(id))
    }
  },
  getCategoryText(id: number) {
    const typeList = getStoreData().typeList

    const row = typeList.find((item: any) => item.id === id)

    return row ? row.name : ''
  }
})
