import { LOGIN_TYPE, PATH } from '../enums/index'
import { getStoreData } from 'wxminishareddata'
import { getCurrentPath } from './common'

export const checkPermission = async () => {
  const loginType = getStoreData().loginType

  const path = getCurrentPath()
  if (loginType === LOGIN_TYPE.NOT_REGISTRY && path !== PATH.LOGIN) {
    await wx.redirectTo({ url: PATH.LOGIN })
  } else if (loginType === LOGIN_TYPE.NOT_FOLLOW && path !== PATH.FOLLOW) {
    await wx.redirectTo({ url: PATH.FOLLOW })
  }
}
