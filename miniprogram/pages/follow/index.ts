Page({
  data: {
    appid: null as null | string,
    src: null as null | string
  },
  async refresh() {
    const app = getApp<IAppOption>()
    await app.login()
  },
  async onLoad() {
    const app = getApp<IAppOption>()
    await app.login()
  }
})
