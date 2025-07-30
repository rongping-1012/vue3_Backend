import { RouteRecordRaw } from 'vue-router'

// 定义用户小仓库的数据类型
export interface UserState {
  token: string | null // 用户登录的token
  menuRouters: RouteRecordRaw[] // 常量路由
  username: string // 用户名
  avatar: string // 用户头像
}
