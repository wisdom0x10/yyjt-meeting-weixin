import { effect, getStoreData } from 'wxminishareddata'

const app = getApp<IAppOption>()
Page({
  data: {
    formData: { username: '' },
    typeList: [],
    tagList: [],
    typePickerVisible: false
  },
  closeTypePicker() {
    this.setData({ typePickerVisible: false })
  },
  openTypePicker() {
    console.log('1 :>> ', 1)
    this.setData({ typePickerVisible: true })
  },
  changeType(data) {
    console.log('changeType :>> ', data)
  },
  onChange(data) {
    console.log('onChange :>> ', data)
  },
  toggle(data) {
    console.log('onChange :>> ', data)
  },
  noop() {},
  onLoad(options) {
    effect(() => {
      this.setData({
        typeList: getStoreData().typeList,
        tagList: getStoreData().tagList
      })
    })
  },
  onReady() {},
  async onShow() {
    await app.login()

    if (!getStoreData().token) return

    await Promise.all([app.getTypeList(), app.getTagList()])
  },
  onHide() {},
  onUnload() {}
})
