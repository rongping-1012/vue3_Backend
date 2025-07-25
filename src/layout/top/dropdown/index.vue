<template>
  <el-button :icon="Refresh" circle />
  <el-button :icon="FullScreen" circle />
  <el-button :icon="Setting" circle />
  <img src="../../../../public/logo.png" alt="" style="width: 32px;height: 32px;margin: 0 20px;">
  <el-dropdown style="margin-right: 15px;">
    <span class="el-dropdown-link">
      admin
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { FullScreen, Refresh, Setting } from '@element-plus/icons-vue';
defineOptions({
  name: 'Dropdown'
})
</script>

<style scoped>
</style>
