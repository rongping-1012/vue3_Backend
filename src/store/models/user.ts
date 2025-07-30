import { defineStore } from 'pinia'
// 引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
// 引入类型
import { loginFormData, loginResponseData, userInfoResponseData } from '@/api/user/type'
import type { UserState } from './type/type'
// 引入token工具函数
import { setToken, getToken, removeToken } from '@/utils/token'
// 引入常量路由
import { routes } from '@/router/routers'
import { log } from 'console'


let userStore = defineStore('user', {
  state: (): UserState => {
    return {
      token: getToken(), // 用户登录的token
      menuRouters: routes, // 动态生成菜单
      username: '', // 用户名
      avatar: '', // 用户头像
    }
  },
  actions: {
    async userLogin(data: loginFormData) {
      // 登录逻辑
      // let res: loginResponseData = await reqLogin(data)
      let res: loginResponseData = {
        code: 200,
        message: 'ok',
        ok: 'true',
        data: '123',
      }
      if (res.code === 200) {
        // 登录成功，存储token
        this.token = res.data as string
        // 本地存储持久化
        setToken(res.data as string)
        return 'ok'
      } else {
        // 登录失败，提示
        return Promise.reject(new Error(res.data))
      }
    },
    // 获取用户信息
    async getUserInfo() {
      // let res: userInfoResponseData = await reqUserInfo()
      let res: userInfoResponseData = {
        code: 200,
        message: 'ok',
        ok: 'true',
        data: {
          routes: [],
          buttons: [],
          roles: [],
          name: 'admin',
          avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        },
      }
      if (res.code === 200) {
        // 获取用户信息成功
        this.username = res.data.name
        this.avatar = res.data.avatar
        return 'ok'
      } else {
        return Promise.reject(new Error(res.message))
      }
      
    },
    // 退出登录
    async userLogout() {
      let res: any = await reqLogout()
      if (res.code === 200) {
        // 清除本地存储的token
        this.token = ''
        this.username = ''
        this.avatar = ''
        removeToken() // 清除token
        return 'ok'
      } else {
        return Promise.reject(new Error(res.message))
      }
    },
  },
  getters: {},
})

export default userStore
