<template>
  <div>
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <div>
          <!-- v-if可以控制组件重建与销毁 -->
          <component :is="Component" v-if="flag" />
        </div>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import useCollapseStore from '@/store/models/collapse'
import { watch, ref, nextTick } from 'vue'
let collapseStore = useCollapseStore()
let flag = ref(true)
//监听数据变化
watch(
  () => collapseStore.refresh,
  () => {
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  },
)

defineOptions({
  name: 'Main',
})
</script>

<style scoped>
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}

.fade-enter-active {
  transition: all 0.5s;
}

.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
