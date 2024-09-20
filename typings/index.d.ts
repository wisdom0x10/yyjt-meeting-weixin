/// <reference path="./types/index.d.ts" />

interface IAppOption {
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback
  getMeetingTagList: () => Promise<void>
  getMeetingTypeList: () => Promise<void>
  getUserList: () => Promise<void>
  login: (phoneCode?: string) => Promise<void>
  setMeetingId: (id?: number) => void
  getUserDetail: (id?: number | number[]) => string | string[]
  getCategoryText: (id: number) => string
}
