import { effect, getStoreData, storeCommit } from 'wxminishareddata'

const app = getApp<IAppOption>()

Page({
  data: {
    text1: '123',
    text2: '456',
    app
  },
  handleClick() {
    const random = Math.random()
    storeCommit('setAppName', `${random}`)
  },
  onLoad() {
    effect(
      () => {
        console.log('effect')
        this.setData({
          text: getStoreData().appName
        })
      },
      {
        scheduler: (fn: any) => {
          console.log('scheduler :>> ')
          fn()
        },
        lazy: true
      }
    )
  }
})
