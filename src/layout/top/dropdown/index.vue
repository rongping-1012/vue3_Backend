<template>
  <el-button :icon="Refresh" circle @click="reFlash"/>
  <el-button :icon="FullScreen" circle @click="fullScreen" />
  <el-button :icon="Setting" circle />
  <img
    :src="useStore.avatar"
    alt=""
    style="width: 32px; height: 32px; margin: 0 20px; border-radius: 50%;"
  />
  <el-dropdown style="margin-right: 15px">
    <span class="el-dropdown-link">
      {{ useStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { FullScreen, Refresh, Setting } from '@element-plus/icons-vue'
import useCollapseStore from '@/store/models/collapse';
import userStore from '@/store/models/user';
import { useRouter, useRoute } from 'vue-router';

const $router = useRouter()
const $route = useRoute()
let useStore = userStore()
let collapseStore = useCollapseStore()
// 刷新业务
const reFlash = () => {
  collapseStore.updateReflash()
  // console.log(collapseStore.refresh);
}

// 全屏展示
const fullScreen = () => {
  let isFull = document.fullscreenElement
  if (isFull) {
    document.exitFullscreen()
  } else {
    document.documentElement.requestFullscreen()
  }
}

// 退出登录
const logout = async() => {
  await useStore.userLogout()
    // 退出登录后可以跳转到登录页面
    $router.push({path: '/login', query: { redirect: $route.path }})
}

defineOptions({
  name: 'Dropdown',
})
</script>

<style scoped></style>
