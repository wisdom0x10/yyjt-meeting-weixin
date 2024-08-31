export const wxLogin = async (): Promise<{ code: string; errMsg: string }> => {
  return new Promise((resolve, reject) => {
    wx.login({
      success(response) {
        resolve(response)
      },
      fail(error) {
        reject(error)
      }
    })
  })
}
