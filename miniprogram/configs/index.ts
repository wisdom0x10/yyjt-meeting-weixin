const { miniProgram } = wx.getAccountInfoSync()

let BASE_URL: string
let BASE_URL_HTTP: string

switch (miniProgram.envVersion) {
  case 'develop':
    BASE_URL = 'https://www.meeting.yingyao.top/admin-api'
    BASE_URL_HTTP = 'http://www.meeting.yingyao.top/admin-api'
    break
  case 'trial':
    BASE_URL = 'https://www.meeting.yingyao.top/admin-api'
    BASE_URL_HTTP = 'http://www.meeting.yingyao.top/admin-api'
    break
  case 'release':
    BASE_URL = 'https://www.meeting.yingyao.top/admin-api'
    BASE_URL_HTTP = 'http://www.meeting.yingyao.top/admin-api'
    break
  default:
    BASE_URL = 'https://www.meeting.yingyao.top/admin-api'
    BASE_URL_HTTP = 'http://www.meeting.yingyao.top/admin-api'
    break
}

console.log('miniProgram.envVersion :>> ', miniProgram.envVersion)

const APP_ID = 'wx189c8c1a2792ca8f'

export { BASE_URL, APP_ID, BASE_URL_HTTP }
