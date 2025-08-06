<template>
  <div>
    <!-- 三级分类组件 -->
    <Category :isShow="isShow"></Category>
    <el-card>
      <div v-show="isShow === 0? true : false">
        <el-button type="primary" icon="Plus" :disabled="categoryStore.c3Id ? false : true"
          @click="addSpu">添加SPU</el-button>
        <el-table border style="margin: 15px 0" :data="recodes">
          <el-table-column label="序号" width="80" type="index" align="center"></el-table-column>
          <el-table-column label="SPU名称" width="280" prop="spuName"> </el-table-column>
          <el-table-column label="SPU描述" prop="description" show-overflow-tooltip> </el-table-column>
          <el-table-column label="操作" width="220">
            <!-- row当前recodes内的每条数据 -->
            <template #="{ row, $index }">
              <el-button type="warning" size="small" icon="Plus" title="新增SKU" @click="addSku(row)"></el-button>
              <el-button type="primary" size="small" icon="Edit" title="编辑SPU" @click="updateSpu(row)"></el-button>
              <el-button type="info" size="small" icon="View" title="查看SPU"></el-button>
              <el-button type="danger" size="small" icon="Delete" title="删除SPU"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="getSpuList(currentPage)" @size-change="sizeChange" :pager-count="7"
          v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]" :background="true"
          layout="prev, pager, next, jumper, ->, sizes, total" :total="total" />
      </div>
      <div v-show="isShow === 1 ? true : false">
        <spuForm @changeShow="changeShow" ref="spu"></spuForm>
      </div>
      <div v-show="isShow === 2 ? true : false">
        <skuForm @changeShow="changeShow" ref="sku"></skuForm>
      </div>
    </el-card>

  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { reqSpuList } from "@/api/product/spu"
import useCategoryStore from "@/store/models/category"
import { Records, SpuData, SpuResponseData } from "@/api/product/spu/type"
import spuForm from "./spuForm.vue"
import skuForm from "./skuForm.vue"

let isShow = ref<number>(0)
let currentPage = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
let categoryStore = useCategoryStore()
// 存放每页spu数组
let recodes = ref<Records>([])
let spu = ref<any>()
let sku = ref<any>()

watch(() => categoryStore.c3Id, () => {
  if (!categoryStore.c3Id) return
  getSpuList()
  
})
const getSpuList = async (Page: number = 1) => {
  let result: SpuResponseData = await reqSpuList(currentPage.value, pageSize.value, categoryStore.c3Id)
  if(result.code == 200) {
    recodes.value = result.data.records
    total.value = result.data.total
  }
}
// 改变每页容量
const sizeChange = () => {
  currentPage.value = 1
  getSpuList(currentPage.value)
}

// 添加spu
const addSpu = () => {
  isShow.value = 1
  // 调用子组件实例
  spu.value.initAddSpu(categoryStore.c3Id)
}

// 编辑spu
const updateSpu = (row: SpuData) => {
  isShow.value = 1
  // row 获取当前点击的一个spu数据，把这个id传给子组件
  // 获取当前子组件实例，在父组件内部调用子组件方法
  spu.value.getFormData(row)
  
  // cancelSpuN()
  // 搜集3级分类id给新增或修改的表单
  // spuParams.category3Id = categoryStore.c3Id
}

const changeShow = (obj: any) => {
  // console.log(obj);
  
  isShow.value = obj.flag
  if (obj.params === 'update') {
    //更新留在当前页
    getSpuList(currentPage.value)
  } else {
    //添加留在第一页
    getSpuList()
  }
  
}

// 新增sku
const addSku = (row: SpuData) => {
  isShow.value = 2
  sku.value.initAddSku(categoryStore.c1Id, categoryStore.c2Id, row)
}

</script>

<style scoped></style>
