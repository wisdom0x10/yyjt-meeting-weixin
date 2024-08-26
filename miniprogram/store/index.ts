import Store from 'wxminishareddata'
import Storage from '../utils/storage'
import { CACHE } from '../enums/cache'

const initData = () => {
  return {
    appName: Storage.get(CACHE.USER_INFO, '会议纪要管理')
  }
}

export default new Store({
  data: initData(),
  getters: {
    getAppName: (data: { appName: string }) => {
      console.log('getter执行了', data)
      return '我的名字' + data.appName
    }
  },
  mutations: {
    setAppName(data: any, val: string) {
      data.appName = val
    }
  },
  actions: {
    async getUserInfo({ storeCommit }: any) {
      setTimeout(() => {
        console.log('dispatch获取用户信息')
        storeCommit('setUserInfo', {
          name: '张三',
          age: 18
        })
      }, 1500)
    }
  }
})
