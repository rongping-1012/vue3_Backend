<template>
  <el-icon style="margin-right: 15px;" @click="collapseStore.toggleCollapse()">
    <component :is="collapseStore.isCollapse ? 'Expand' : 'Fold'"></component>
  </el-icon>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue';
import useCollapseStore from '@/store/models/collapse';
let collapseStore = useCollapseStore()

defineOptions({
  name: 'Breadcrumb'
});


</script>

<style scoped></style>
