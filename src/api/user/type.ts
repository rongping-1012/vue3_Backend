// 登录接口需要携带的参数类型
export interface LoginParams {
  username: string,
  password: string
}

// 登录接口返回的数据类型
interface dataType {
  token?: string,
  message?: string
}
export interface LoginResponse {
  code: number,
  data: dataType
}

// 获取用户信息返回的数据类型
interface userType {
  userId: number,
  avatar: string,
  username: string,
  password: string,
  desc: string,
  roles: string[],
  buttons: string[],
  routes: string[],
  token: string
}
export interface UserInfoResponse {
  code: number,
  data: {
    checkUser: userType
  }
}