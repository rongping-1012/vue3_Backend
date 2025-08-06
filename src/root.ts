// 路由鉴权
import router from '@/router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
nprogress.configure({ showSpinner: false })
import pinia from '@/store'
import userStore from '@/store/models/user'
import setting from './setting'
import { ref } from 'vue'

// 定义标识，记录路由是否添加
const hasRoles = ref(true)

// 前置守卫
router.beforeEach(async (to, from, next) => {
  document.title = `${setting.title} - ${to.meta.title}`
  nprogress.start() // 立即启动进度条

  const useStore = userStore(pinia)
  const token = useStore.token
  const username = useStore.username

  // 已登录状态
  if (token) {
    // 已登录但访问登录页，重定向到首页
    if (to.path === '/login') {
      next('/')
      return
    }

    // 检查是否有用户信息
    if (!username) {
      // 没有用户信息，尝试获取
      try {
        if (hasRoles.value) {
          await useStore.getUserInfo()
          hasRoles.value = false
          // 重新导航到目标路径，确保路由守卫重新执行
          next({ ...to, replace: true })
          return
        }
      } catch (error) {
        // 获取用户信息失败，可能是token过期
        await useStore.userLogout()
        next({ path: '/login', query: { redirect: to.path } })
        return
      }
    }
    // 有用户信息或已成功获取用户信息，放行
    next()
  } else {
    // 未登录状态
    if (to.path === '/login') {
      next() // 允许访问登录页
    } else {
      // 重定向到登录页，并记录原目标路径
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

// 后置守卫
router.afterEach((to, from) => {
  nprogress.done()
})
