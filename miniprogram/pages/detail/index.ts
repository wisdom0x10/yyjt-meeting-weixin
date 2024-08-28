import { themeMixin } from '../../behaviors/theme'
import { effect, getStoreData, storeCommit } from 'wxminishareddata'

Page({
  behaviors: [themeMixin],
  data: {
    title: '会议主题',
    type: '会议类型',
    tags: [
      { color: 'red', text: '测试' },
      { color: 'blue', text: '测试测试' },
      { color: 'green', text: '测试测试测试' },
      { color: 'yellow', text: '测试' },
      { color: '#f2826a', text: '测试测试' },
      { color: '#7232dd', text: '测试测试测试' },
      { color: '#7232dd', text: '测试' },
      { color: '#ffe1e1', text: '测试测试' },
      { color: '#789536', text: '测试测试测试' }
    ]
  },
  handleClick() {
    console.log('this :>> ', this)
    const random = Math.random()
    storeCommit('setAppName', `${random}`)
    this.setData({ error: random })
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
    console.log('this :>> ', this)
  }
})
