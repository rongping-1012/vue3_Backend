<template>
  <el-card style="margin-bottom: 15px;">
    <el-form :inline="true">
      <el-form-item label="一级分类" style="width: 250px;">
        <el-select v-model="categoryStore.c1Id" @change="handler1" :disabled="isShow === 0 ? false : true">
          <el-option v-for="(c1, index) in categoryStore.c1List" :key="c1.id" :label="c1.name"
            :value="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类" style="width: 250px;">
        <el-select v-model="categoryStore.c2Id" @change="handler2" :disabled="isShow === 0 ? false : true">
          <el-option v-for="(c2, index) in categoryStore.c2List" :key="c2.id" :label="c2.name"
            :value="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类" style="width: 250px;">
        <el-select v-model="categoryStore.c3Id" :disabled="isShow === 0 ? false : true">
          <el-option v-for="(c3, index) in categoryStore.c3List" :key="c3.id" :label="c3.name"
            :value="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import useCategoryStore from '@/store/models/category';

defineProps(['isShow'])
let categoryStore = useCategoryStore()

onMounted(() => {
  categoryStore.getCategory1List()
})

const handler1 = () => {
  categoryStore.c2Id = ''
  categoryStore.c3Id = ''
  categoryStore.c3List = []
  categoryStore.getCategory2List()
}

const handler2 = () => {
  categoryStore.c3Id = ''
  categoryStore.getCategory3List()
}


</script>

<style scoped></style>
