// 引入全局组件
import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'

// 全局对象
const allGlobalComponents = {SvgIcon, Pagination}

// 对外暴露插件对象
export default {
  install(app) {
    // 注册全局组件
    Object.keys(allGlobalComponents).forEach((key) => {
      app.component(key, allGlobalComponents[key])
    })
  }
}