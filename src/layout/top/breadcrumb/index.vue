<template>
  <el-icon style="margin-right: 15px" @click="collapseStore.toggleCollapse()">
    <component :is="collapseStore.isCollapse ? 'Expand' : 'Fold'"></component>
  </el-icon>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item
      v-for="(item, index) in $route.matched"
      :key="index"
      v-show="!item.meta.hidden"
      :to="item.path"
    >
      <el-icon style="vertical-align: -15%">
        <component :is="item.meta.icon"></component>
      </el-icon>
      {{ item.meta.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import useCollapseStore from '@/store/models/collapse'
import { useRoute } from 'vue-router'
// 菜单折叠状态仓库
let collapseStore = useCollapseStore()
// 获取当前路由
let $route = useRoute()

defineOptions({
  name: 'Breadcrumb',
})
</script>

<style scoped></style>
