<template>
  <div class="logo_container">
    <img
      :src="setting.logo"
      alt="logo"
      style="width: 32px; height: 32px; margin-left: 2px"
    />
    <span style="font-size: larger; margin-left: 17px">{{ setting.title }}</span>
  </div>
</template>

<script setup lang="ts">
import setting from '@/setting';

defineOptions({
  name: 'Logo',
})
</script>

<style scoped lang="scss">
.logo_container {
  width: 100%;
  height: $header-height;
  color: white;
  display: flex;
  align-items: center;
  // justify-content: center;
  padding-left: 13px;
}
</style>
