import { effect, getStoreData, storeDispatch } from 'wxminishareddata'
import Toast from '@vant/weapp/toast/toast'
import { LOGIN_TYPE, PATH } from '../../enums/index'

Page({
  data: {
    name: null,
    phone: null as null | string,
    password: null,
    deptId: 574,
    deptName: null as null | string
  },
  deptPickerRef: null as WechatMiniprogram.Component.TrivialInstance | null,
  open() {
    this.deptPickerRef?.open()
  },
  onDeptChange(data: WXEvent) {
    this.setData({ deptName: data.detail.text, deptId: data.detail.id })
  },
  changePhone(data: WXEvent) {
    console.log('data :>> ', data)
  },
  async handleRegister() {
    const {
      data: { name, phone, password, deptId }
    } = this

    if (!name) {
      Toast.fail('请输入用户名')
    } else if (!phone) {
      Toast.fail('请输入手机号')
    } else if (
      !/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/.test(
        phone
      )
    ) {
      return Toast.fail('请输入正确的手机号')
    } else if (!password) {
      Toast.fail('请输入密码')
    } else if (!deptId) {
      Toast.fail('请选择部门')
    } else {
      await storeDispatch('register', {
        name,
        phone,
        password,
        deptId,
        nickName: name
      })
    }
  },
  onLoad() {
    this.deptPickerRef = this.selectComponent('#deptPicker')

    effect(() => {
      const loginType = getStoreData().loginType

      if (loginType === LOGIN_TYPE.READY) {
        wx.redirectTo({ url: PATH.DETAIL })
      } else if (loginType === LOGIN_TYPE.NOT_FOLLOW) {
        wx.redirectTo({ url: PATH.FOLLOW })
      }
    })
  }
})
