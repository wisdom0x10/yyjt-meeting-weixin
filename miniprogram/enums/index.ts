export enum CACHE {
  APP_ID = 'APP_ID',
  USER_INFO = 'USER_INFO',
  TOKEN = 'TOKEN',
  LOGIN_TYPE = 'LOGIN_TYPE',
  ID = 'ID'
}

export enum LOGIN_TYPE {
  NOT_LOGIN = 100,
  NOT_REGISTRY = 200,
  NOT_FOLLOW = 300,
  READY = 400
}

export enum PATH {
  LOGIN = '/pages/login/index',
  DETAIL = '/pages/detail/index',
  FOLLOW = '/pages/follow/index',
  SIGNIN = '/pages/signin/index',
  LIST = '/pages/list/index'
}
