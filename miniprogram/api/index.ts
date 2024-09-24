import { httpClient } from '../utils/request'

export interface Page {
  page: number
  size: number
}

export interface UserType {
  attentionMp: boolean
  avatar: null | string
  defaultPassword: boolean
  deptCode: null | string
  deptId: null | number
  name: null | string
  nickname: null | string
  tokenName: null | string
  tokenPrefix: null | string
  tokenValue: null | string
  username: null | string
}

export const login = (data: {
  code: string
  appId: string
  phoneCode?: string
}) => {
  return httpClient.request<UserType>({
    method: 'POST',
    url: '/wx/ma/login',
    data
  })
}

export const register = (data: {
  phone: string
  nickName: string
  name: string
  password: string
  deptId: number
  code: string
}) => {
  return httpClient.request<UserType>({
    method: 'POST',
    url: '/wx/ma/register',
    data
  })
}

export const getRSAKey = () => {
  return httpClient.request({ url: '/system/key', method: 'GET' })
}

export const getAppid = () => {
  return httpClient.request({ url: '/wx/mp/appId', method: 'GET' })
}

export const getMeetingDetail = (id: string) => {
  return httpClient.request({ url: `/meeting/${id}`, method: 'GET' })
}

export const getTagList = () => {
  return httpClient.request({ url: `/meeting/label/simpleList`, method: 'GET' })
}

export const getTypeList = () => {
  return httpClient.request({
    url: `/meeting/category/simpleList`,
    method: 'GET'
  })
}

export const getUserList = () => {
  return httpClient.request({
    url: '/system/adminUser/simpleList',
    method: 'GET'
  })
}

export const changeTaskStatus = (data: {
  meetingId: number
  type?: 0 | 1
  status: 0 | 1 | 2
}) => {
  return httpClient.request({
    url: '/meeting/task/status',
    method: 'POST',
    data
  })
}

export const getMeetingPage = (data: Page | { theme?: string }) => {
  return httpClient.request<{ list: any[]; total: number }>({
    url: `/meeting/page`,
    method: 'GET',
    data
  })
}

export const signIn = (data: { meetingId: number }) => {
  return httpClient.request<{ list: any[]; total: number }>({
    url: `/meeting/sign`,
    method: 'POST',
    data
  })
}
