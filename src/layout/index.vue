<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_left" :class="{ collapse: collapseStore.isCollapse }">
      <Logo />
      <!-- 滚动条 -->
      <el-scrollbar class="scrollbar">
        <!-- 动态生成菜单 -->
        <el-menu :default-active="$route.path" background-color="#2f2f2f" text-color="white" active-text-color="orange">
          <Menu :menuList="user.menuRouters" />
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_top" :class="{ collapse: collapseStore.isCollapse }">
      <Top></Top>
    </div>
    <!-- 右侧内容 -->
    <div class="layout_right" :class="{ collapse: collapseStore.isCollapse }">
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
import Main from './main/index.vue'
import Top from './top/index.vue'
import userStore from '@/store/models/user'
import useCollapseStore from '@/store/models/collapse'
import { useRoute } from 'vue-router'
let user = userStore()
let collapseStore = useCollapseStore()
// 获取当前路由
let $route = useRoute()

defineOptions({
  name: 'Layout',
})
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_left {
    width: $menu-width;
    height: 100%;
    background-color: $menu-bg-color;
    color: white;
    float: left;
    .scrollbar {
      width: 100%;
      height: calc(100vh - $header-height);
    }
  }

  .layout_top {
    height: $header-height;
    background-color: #fff;
    color: black;
    line-height: 50px;
    position: fixed;
    top: 0;
    left: $menu-width;
    right: 0;
    transition: all 0.3s;

    &.collapse {
      width: calc(100% - 50px);
      left: 63px;
    }
  }

  .layout_right {
    position: absolute;
    width: calc(100% - $menu-width);
    height: calc(100vh - $header-height);
    left: $menu-width;
    top: $header-height;
    background-color: #fff;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;

    &.collapse {
      width: calc(100% - 50px);
      left: 63px;
    }
  }
}
</style>
