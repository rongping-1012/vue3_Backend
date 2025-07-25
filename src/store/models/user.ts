import { defineStore } from 'pinia'
// 引入接口
import { reqLogin } from '@/api/user'
// 引入类型
import type { LoginParams, LoginResponse } from '@/api/user/type'
import type { UserState } from './type/type'
// 引入token工具函数
import { setToken, getToken } from '@/utils/token'
// 引入常量路由
import { routes } from '@/router/routers'

let userStore = defineStore('user', {
  state: (): UserState => {
    return {
      token: getToken(), // 用户登录的token
      menuRouters: routes // 动态生成菜单
    }
  },
  actions: {
    async userLogin(data: LoginParams) {
      // 登录逻辑
      let res: LoginResponse = await reqLogin(data)
      if (res.code === 200) {
        // 登录成功，存储token
        this.token = (res.data.token as string)
        // 本地存储持久化
        setToken((res.data.token as string))
        return 'ok'
      } else {
        // 登录失败，提示
        return Promise.reject(new Error(res.data.message))
      }
    }
  },
  getters: {

  }
})

export default userStore