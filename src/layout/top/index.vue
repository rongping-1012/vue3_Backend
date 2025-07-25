<template>
  <div class="top">
    <div class="top_left">
      <Breadcrumb/>
    </div>
    <div class="top_right">
      <Dropdown/>
    </div>

  </div>
</template>

<script setup lang="ts">
import Breadcrumb from './breadcrumb/index.vue'
import Dropdown from './dropdown/index.vue'
defineOptions({
  name: 'Top'
})
</script>

<style scoped lang="scss">
.top {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .top_left {
    display: flex;
    margin-left: 20px;
  }
  .top_right {
    display: flex;
    align-items: center;
  }
}
</style>
