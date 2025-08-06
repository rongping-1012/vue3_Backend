<template>
  <el-menu
    router
    :default-active="activePath"
    :collapse="collapseStore.isCollapse"
  >
    <!-- :default-openeds="openeds" -->
    <!-- 遍历菜单项 -->
    <template v-for="item in menuList" :key="item.path">
      <!-- 1. 路由没有children -->
      <el-menu-item
        v-if="!item.children && !item.meta.hidden"
        :index="item.path"
      >
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>

      <!-- 2. 路由只有一个child -->
      <el-menu-item
        v-if="
          item.children &&
          item.children.length === 1 &&
          !item.children[0].meta.hidden
        "
        :index="item.children[0].path"
      >
        <el-icon>
          <component :is="item.children[0].meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>

      <!-- 3. 路由的children大于1 -->
      <el-sub-menu
        v-if="item.children && item.children.length > 1"
        :index="item.path"
      >
        <template #title>
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span>{{ item.meta.title }}</span>
        </template>
        <!-- 递归渲染子菜单 -->
        <Menu :menuList="item.children"  style="padding-left: 20px;"/>
      </el-sub-menu>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useCollapseStore from '@/store/models/collapse'

let collapseStore = useCollapseStore()

defineOptions({
  name: 'Menu',
})
// 获取父组件传递的路由数组
defineProps(['menuList'])

//获取路由器对象
let $router = useRouter()
//点击菜单的回调
const goRoute = (vc: any) => {
  //路由跳转
  $router.push(vc.index)
}
// 获取当前路由路径
const route = useRoute()
const activePath = ref('')
onMounted(() => {
  activePath.value = route.path // 初始化激活路径
})

// 定义一个数组来存储展开的菜单项
const openeds = ref<string[]>([])

// 监听路由变化，确保参数变化时也能更新
watch(
  () => route.path,
  (newPath) => {
    activePath.value = newPath
  },
)
</script>

<style scoped lang="scss"></style>
