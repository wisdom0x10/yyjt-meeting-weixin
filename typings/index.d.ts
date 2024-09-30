/// <reference path="./types/index.d.ts" />

interface IAppOption {
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback
  getTagList: (force?: boolean) => Promise<void>
  getTypeList: (force?: boolean) => Promise<void>
  getUserList: (force?: boolean) => Promise<void>
  login: (phoneCode?: string, force?: boolean) => Promise<void>
  getUserText: (id?: number | number[]) => string | string[]
  getCategoryText: (id: number) => string
}
