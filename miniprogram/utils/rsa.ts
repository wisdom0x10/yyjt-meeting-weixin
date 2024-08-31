import WxmpRsa from 'wxmp-rsa'
import * as Api from '../api/index'

export async function encryptPwd(target: string) {
  const res: any = await Api.getRSAKey()

  // 密码加密
  const encryptor = new WxmpRsa()
  encryptor.setPublicKey(res.data)

  return encryptor.encryptLong(target) as string
}
