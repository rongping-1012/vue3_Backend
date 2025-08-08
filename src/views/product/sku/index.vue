<template>
  <el-card>
    <el-table border style="margin-bottom: 20px;" :data="skuArr">
      <el-table-column label="序号" type="index" align="center" width="80"> </el-table-column>
      <el-table-column label="名称" width="180" prop="skuName"> </el-table-column>
      <el-table-column label="描述" show-overflow-tooltip width="200" prop="skuDesc"> </el-table-column>
      <el-table-column label="图片" width="200">
        <template #="{ row, $index }">
          <img :src="row.skuDefaultImg" alt="" style="width: 100px;height: 100px;"></img>
        </template>
      </el-table-column>
      <el-table-column label="重量" width="180" prop="weight"> </el-table-column>
      <el-table-column label="价格" width="180" prop="price"> </el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template #="{ row, $index }">
          <el-button :type="row.isSale == 1 ? 'warning' : 'info'" size="small" @click="handleEdit(row)"
            :icon="row.isSale == 1 ? 'Bottom' : 'Top'"></el-button>
          <el-button type="primary" size="small" @click="edit" icon="Edit"></el-button>
          <el-button type="success" size="small" @click="showInfo(row)" icon="InfoFilled"></el-button>
          <el-popconfirm :title="`确定删除 ${row.skuName} ?`" width="200px" @confirm="deleteSku(row.id)">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="getSkuList" @size-change="sizeChange" :pager-count="7"
      v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]" :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total" :total="total" />
    <!-- 抽屉组件 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>商品详情</h4>
      </template>
      <template #default>
        <el-descriptions border column="1" style="margin-bottom: 10px;">
          <el-descriptions-item label="名称">{{ skuInfo.skuName }}</el-descriptions-item>
          <el-descriptions-item label="价格">{{ skuInfo.price }}</el-descriptions-item>
          <el-descriptions-item label="描述">{{ skuInfo.skuDesc }}</el-descriptions-item>
          <el-descriptions-item label="平台属性">
            <el-tag v-for="item in skuInfo.skuAttrValueList" :key="item.id" style="margin: 5px;">{{ item.valueName
              }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="销售属性">
            <el-tag v-for="item in skuInfo.skuSaleAttrValueList" :key="item.id" style="margin: 5px;" type="warning">
              {{ item.saleAttrValueName }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
        <el-carousel :interval="4000" type="card" height="200px">
          <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
            <img :src="item.imgUrl" alt="" style="width:100%;height:100%" />
          </el-carousel-item>
        </el-carousel>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { reqSkuList, reqSaleSku, reqCancelSale, reqSkuInfo, reqRemoveSku } from '@/api/product/sku'
import type {  SkuData, SkuInfoData } from '@/api/product/sku/type';
import { ElMessage } from 'element-plus'
import { ref, onMounted } from 'vue'
let currentPage = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
let skuArr = ref<SkuData[]>([])
let drawer = ref(false)
let skuInfo = ref<any>({})

onMounted(() => {
  getSkuList()
})
const getSkuList = async (pager: number = 1) => {
  currentPage.value = pager
  let result = await reqSkuList(currentPage.value, pageSize.value)
  if (result.code === 200) {
    skuArr.value = result.data.records
    total.value = result.data.total
  }
}
// 改变每页容量
const sizeChange = (pageSize: number) => {
  getSkuList()
}

// 商品上下架请求
const handleEdit = async (row: SkuData) => {
  if (row.isSale === 0) {
    let result = await reqSaleSku((row.id as number))
    if (result.code === 200) {
      row.isSale = 1
      ElMessage.success('上架成功')
    }
  } else {
    let result = await reqCancelSale((row.id as number))
    if (result.code === 200) {
      row.isSale = 0
      ElMessage.success('下架成功')
    }
  }
}

// 编辑
const edit = () => {
  ElMessage.warning('编辑功能正在开发中')
}

const showInfo = async (row: SkuData) => {
  drawer.value = true
  let result: SkuInfoData = await reqSkuInfo((row.id as number))
  if (result.code === 200) {
    skuInfo.value = result.data
  }
}

const deleteSku = async(id: number) => {
  let result = await reqRemoveSku(id)
  if (result.code === 200) {
    ElMessage.success('删除成功')
    getSkuList(skuArr.value.length > 1 ? currentPage.value : currentPage.value - 1)
  } else {
    ElMessage.error('删除失败')
  }
  
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
