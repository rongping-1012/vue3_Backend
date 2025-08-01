import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './routers'

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
  scrollBehavior() {
    return {
      top: 0,
      left: 0,
    }
  },
})

export default router
