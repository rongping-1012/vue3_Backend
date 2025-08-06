import { RouteRecordRaw } from 'vue-router'
import type { CategoryObj } from '@/api/product/attr/type'

// 定义用户小仓库的数据类型
export interface UserState {
  token: string | null // 用户登录的token
  menuRouters: RouteRecordRaw[] // 常量路由
  username: string // 用户名
  avatar: string // 用户头像
}

export interface CategoryState { 
  c1Id: number | string,
  c2Id: number | string,
  c3Id: number | string,
  c1List: CategoryObj[],
  c2List: CategoryObj[]
  c3List: CategoryObj[]
}