import { defineStore } from 'pinia'

let useCollapseStore = defineStore('collapse', {
  state: () => {
    return {
      isCollapse: false, // 菜单折叠状态
      refresh: false
    }
  },
  actions: {
    toggleCollapse() {
      this.isCollapse = !this.isCollapse // 切换菜单折叠状态
    },
    updateReflash() {
      this.refresh = !this.refresh
    }
  },
  getters: {},
})

export default useCollapseStore
