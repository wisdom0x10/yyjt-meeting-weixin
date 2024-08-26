const { miniProgram } = wx.getAccountInfoSync()

let BASE_URL
switch (miniProgram.envVersion) {
  case 'develop':
    BASE_URL = 'http://192.168.0.140'
    break
  case 'release':
    BASE_URL = 'http://192.168.0.140'
    break
  default:
    break
}

export { BASE_URL }
