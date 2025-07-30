import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'virtual:svg-icons-register'
import '@/styles/index.scss'

// 引入自定义全局组件
import GlobalComponents from './components'
import router from './router'
import pinia from './store'
// 引入路由守卫
import './root'

app.use(pinia)
app.use(GlobalComponents)
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(router)
app.mount('#app')
