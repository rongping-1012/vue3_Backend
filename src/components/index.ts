// 引入全局组件
import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'
import Category from './Category/index.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 全局对象
const allGlobalComponents: any = { SvgIcon, Pagination, Category }

// 对外暴露插件对象
export default {
  install(app: any) {
    // 注册全局组件
    Object.keys(allGlobalComponents).forEach((key) => {
      app.component(key, allGlobalComponents[key])
    })
    // 注册 Element Plus 图标组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
