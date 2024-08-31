import Store from 'wxminishareddata'
import Storage from '../utils/storage'
import { CACHE, LOGIN_TYPE } from '../enums/index'
import { APP_ID } from '../configs/index'
import * as Api from '../api/index'
import { wxLogin } from '../utils/promise'
import { encryptPwd } from '../utils/rsa'

export default new Store({
  data: {
    appId: APP_ID,

    loading: false,

    loginType: LOGIN_TYPE.NOT_LOGIN,
    token: null,

    id: Storage.get(CACHE.ID)
  },
  getters: {
    getAppId(data: { appid: string }) {
      return data.appid
    }
  },
  mutations: {
    setLoading(target: any, data: any) {
      target.loading = data.value
      if (data.value) {
        wx.showLoading({
          title: data.title ?? '加载中',
          mask: data.mask ?? true
        })
      } else {
        wx.hideLoading()
      }
    },
    setAppName(target: any, data: string) {
      target.appName = data
    },
    setLoginType(target: any, data?: LOGIN_TYPE) {
      target.loginType = data
    },
    setUserInfo(target: any, data: Api.UserType) {
      if (data) {
        target.token = `${data.tokenPrefix} ${data.tokenValue}`
      } else {
        target.token = null
      }
    },
    setId(target: any, data: any) {
      if (data) {
        target.id = data
        Storage.set(CACHE.ID, data)
      }
    }
  },
  actions: {
    async login({ storeCommit }: any) {
      storeCommit('setLoading', { value: true })
      try {
        const wxloginRes = await wxLogin()

        const { data: loginData } = await Api.login({ code: wxloginRes.code })

        if (!loginData.name) {
          // 未登录
          storeCommit('setLoginType', LOGIN_TYPE.NOT_REGISTRY)
        } else {
          storeCommit('setUserInfo', loginData)
          // 已登录
          if (loginData.attentionMp) {
            // 已授权
            storeCommit('setLoginType', LOGIN_TYPE.READY)
          } else {
            // 已授权
            storeCommit('setLoginType', LOGIN_TYPE.NOT_FOLLOW)
          }
        }
      } finally {
        storeCommit('setLoading', { value: false })
      }
    },
    async register({ storeCommit }: any, data: any) {
      try {
        storeCommit('setLoading', { value: true })

        const { code } = await wxLogin()

        const encryptPassword = await encryptPwd(data.password)

        const { data: registerData } = await Api.register({
          ...data,
          password: encryptPassword,
          code
        })

        storeCommit('setUserInfo', registerData)
        // 已登录
        if (registerData.attentionMp) {
          // 已授权
          storeCommit('setLoginType', LOGIN_TYPE.READY)
        } else {
          // 未授权
          storeCommit('setLoginType', LOGIN_TYPE.NOT_FOLLOW)
        }
      } finally {
        storeCommit('setLoading', { value: false })
      }
    }
  }
})
