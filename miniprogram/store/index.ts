import Store from 'wxminishareddata'
import { LOGIN_TYPE } from '../enums/index'
import { APP_ID } from '../configs/index'
import * as Api from '../api/index'

export default new Store({
  data: {
    appId: APP_ID,

    loginType: LOGIN_TYPE.NOT_LOGIN,
    token: '',

    userList: [],
    tagList: [],
    typeList: []
  },
  getters: {
    getAppId(data: { appid: string }) {
      return data.appid
    }
  },
  mutations: {
    setLoginType(target: any, data?: LOGIN_TYPE) {
      target.loginType = data
    },
    setUserInfo(target: any, data: Api.UserType) {
      console.log('data :>> ', data)
      console.log('target :>> ', target)
      if (data.tokenPrefix && data.tokenValue) {
        target.token = `${data.tokenPrefix} ${data.tokenValue}`
      } else {
        target.token = ''
      }
    },
    setUserList(target: any, data: any) {
      target.userList = data
    },
    setTagList(target: any, data: any) {
      target.tagList = data
    },
    setTypeList(target: any, data: any) {
      target.typeList = data
    }
  },
  actions: {}
})
