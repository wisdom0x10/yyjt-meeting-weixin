/// <reference path="./types/index.d.ts" />

interface IAppOption {
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback
  getTagList: () => Promise<void>
  getTypeList: () => Promise<void>
  getUserList: () => Promise<void>
  login: (phoneCode?: string, force?: boolean) => Promise<void>
  getUserText: (id?: number | number[]) => string | string[]
  getCategoryText: (id: number) => string
}
