<template>
  <div>
    <el-form label-width="auto" label-position="left">
      <el-form-item label="SKU名称">
        <el-input placeholder="请输入SKU名称" v-model="skuParams.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="请输入价格" type="number" v-model="skuParams.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(克)">
        <el-input placeholder="请输入重量" type="number" v-model="skuParams.weight"></el-input>
      </el-form-item>
      <el-form-item label="SKU描述">
        <el-input type="textarea" placeholder="请输入内容" v-model="skuParams.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" v-for="(attr, index) in attrArr" :key="attr.id">
          <el-form-item :label="attr.attrName">
            <el-select style="width: 220px;" v-model="attr.attrIdAndValueId">
              <el-option v-for="(value, index) in attr.attrValueList" :key="value.id" :label="value.valueName"
                :value="`${attr.id}:${value.id}`"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true">
          <el-form-item v-for="item in saleArr" :key="item.id" :label="item.saleAttrName">
            <el-select style="width: 240px" v-model="item.saleIdAndValueId">
              <el-option :value="`${item.id}:${saleAttrValue.id}`" v-for="saleAttrValue in item.spuSaleAttrValueList"
                :key="saleAttrValue.id" :label="saleAttrValue.saleAttrValueName"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片名称">
        <el-table border :data="imgArr" ref="table">
          <el-table-column type="selection" width="80px" align="center"> </el-table-column>
          <el-table-column label="图片">
            <template v-slot="{ row }">
              <el-image style="width: 100px; height: 100px" :src="row.imgUrl" />
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"> </el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ row }">
              <el-button type="primary" size="small" @click="handler(row)">设置默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { SkuData, SpuData, SpuImg } from '@/api/product/spu/type';
import { reqCategory } from '@/api/product/attr/index';
import { reqSpuImageList, reqSpuHasSaleAttr, reqAddSku } from '@/api/product/spu/index';
import { reactive, ref } from 'vue'
import { ElMessage, type TableInstance } from 'element-plus';

let $emit = defineEmits(["changeShow"])
let attrArr = ref<any>([])
let saleArr = ref<any>([])
let imgArr = ref<any>([])
// 获取 table 组件实例
let table = ref<TableInstance>()
// 收集SKU的参数
let skuParams = reactive<SkuData>({
  // 父组件传递的数据
  category3Id: '', // 三级分类的ID
  spuId: '', // 已有的SPU的ID
  tmId: '', // SPU 品牌ID
  // v-model 收集
  skuName: '', // SKU 名字
  price: '', // SKU 价格
  weight: '', // SKU 重量
  skuDesc: '', // SKU 描述
  skuAttrValueList: [], // 平台属性
  skuSaleAttrValueList: [
    // 销售属性
    {
      saleAttrId: '', // 销售属性ID
      saleAttrValueId: '', // 销售属性值ID
    },
  ],
  skuDefaultImg: '', // 售卖SKU图片地址
})
const close = () => {
  $emit("changeShow", {flag: 0, params: ''})
}

const initAddSku = async(c1Id: number|string, c2Id: number|string, spu: SpuData) => {
  // 收集数据
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id as number
  skuParams.tmId = spu.tmId
  // 获取平台属性
  // let result: any = await reqCategory(c1Id, c2Id, spu.category3Id)
  // // 获取SPU销售属性
  // let result1: any = await reqSpuHasSaleAttr((spu.id as number))
  // // 获取SPU图片
  // let result2: any = await reqSpuImageList((spu.id as number))
  let result: any =  {
    "code": 200,
    "message": "成功",
    "data": [
      {
        "id": 113,
        "createTime": null,
        "updateTime": null,
        "attrName": "分离那",
        "categoryId": 1,
        "categoryLevel": 3,
        "attrValueList": [
          {
            "id": 12878,
            "createTime": null,
            "updateTime": null,
            "valueName": "g'f'v",
            "attrId": 113
          }
        ]
      },
      {
        "id": 162,
        "createTime": null,
        "updateTime": null,
        "attrName": "计算机网络",
        "categoryId": 1,
        "categoryLevel": 3,
        "attrValueList": [
          {
            "id": 12335,
            "createTime": null,
            "updateTime": null,
            "valueName": "safasfa123",
            "attrId": 162
          },
          {
            "id": 12337,
            "createTime": null,
            "updateTime": null,
            "valueName": "aaaa",
            "attrId": 162
          },
          {
            "id": 12336,
            "createTime": null,
            "updateTime": null,
            "valueName": "safasfasfafafa",
            "attrId": 162
          },
          {
            "id": 12338,
            "createTime": null,
            "updateTime": null,
            "valueName": "666",
            "attrId": 162
          }
        ]
      },
      {
        "id": 165,
        "createTime": null,
        "updateTime": null,
        "attrName": "asdasd",
        "categoryId": 1,
        "categoryLevel": 3,
        "attrValueList": [
          {
            "id": 7405,
            "createTime": null,
            "updateTime": null,
            "valueName": "JAVA",
            "attrId": 165
          }
        ]
      },
      {
        "id": 166,
        "createTime": null,
        "updateTime": null,
        "attrName": "asdasd",
        "categoryId": 1,
        "categoryLevel": 3,
        "attrValueList": [
          {
            "id": 356,
            "createTime": null,
            "updateTime": null,
            "valueName": "asdasda",
            "attrId": 166
          }
        ]
      },
      {
        "id": 167,
        "createTime": null,
        "updateTime": null,
        "attrName": "asdads",
        "categoryId": 1,
        "categoryLevel": 3,
        "attrValueList": [
          {
            "id": 8103,
            "createTime": null,
            "updateTime": null,
            "valueName": "1",
            "attrId": 167
          }
        ]
      },
      {
        "id": 175,
        "createTime": null,
        "updateTime": null,
        "attrName": "77777",
        "categoryId": 1,
        "categoryLevel": 3,
        "attrValueList": [
          {
            "id": 12084,
            "createTime": null,
            "updateTime": null,
            "valueName": "33",
            "attrId": 175
          },
          {
            "id": 12086,
            "createTime": null,
            "updateTime": null,
            "valueName": "aaaa",
            "attrId": 175
          },
          {
            "id": 12085,
            "createTime": null,
            "updateTime": null,
            "valueName": "77",
            "attrId": 175
          }
        ]
      }
    ],
    "ok": true
  }
  let result1: any = {
    "code": 200,
    "message": "成功",
    "data": [
      {
        "id": 463,
        "createTime": null,
        "updateTime": null,
        "spuId": 579,
        "baseSaleAttrId": 1,
        "saleAttrName": "颜色",
        "spuSaleAttrValueList": [
          {
            "id": 633,
            "createTime": null,
            "updateTime": null,
            "spuId": 579,
            "baseSaleAttrId": 1,
            "saleAttrValueName": "蓝色",
            "saleAttrName": "颜色",
            "isChecked": null
          }
        ]
      },
      {
        "id": 464,
        "createTime": null,
        "updateTime": null,
        "spuId": 579,
        "baseSaleAttrId": 1,
        "saleAttrName": "材质",
        "spuSaleAttrValueList": [
          {
            "id": 633,
            "createTime": null,
            "updateTime": null,
            "spuId": 579,
            "baseSaleAttrId": 1,
            "saleAttrValueName": "纯棉",
            "saleAttrName": "材质",
            "isChecked": null
          },
          {
            "id": 634,
            "createTime": null,
            "updateTime": null,
            "spuId": 579,
            "baseSaleAttrId": 1,
            "saleAttrValueName": "金属",
            "saleAttrName": "材质",
            "isChecked": null
          }
        ]
      }
    ],
    "ok": true
  }
  let result2: any = {
    "code": 200,
    "message": "成功",
    "data": [
      {
        "id": 498,
        "createTime": "2025-08-01 11:21:28",
        "updateTime": "2025-08-01 11:21:28",
        "spuId": 579,
        "imgName": "dot.png",
        "imgUrl": "blob:http://localhost:5173/da46c9f9-0191-443d-90fa-00fd58f78f4f"
      },
      {
        "id": 499,
        "createTime": "2025-08-01 11:21:29",
        "updateTime": "2025-08-01 11:21:29",
        "spuId": 579,
        "imgName": "do.png",
        "imgUrl": "blob:http://localhost:5173/da46c9f9-0191-443d-90fa-00fd58f78f4f"
      }
    ],
    "ok": true
  }
  attrArr.value = result.data
  saleArr.value = result1.data
  imgArr.value = result2.data
}

// 设置默认图片的方法回调
const handler = (row: SpuImg) => {
  
  // 点击的时候，全部的复选框不勾选
  table.value?.clearSelection()
  // 勾选选中的行
  table.value?.toggleRowSelection(row, true)
  // 收集图片地址
  skuParams.skuDefaultImg = (row.imgUrl as string)
}

// 保存按钮方法
const save = async () => {
  // 整理参数
  // 平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({
        attrId,
        valueId,
      })
    }
    return prev
  }, [])
  // 销售属性
  skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev: any, next: any) => {
    if (next.saleIdAndValueId) {
      let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
      prev.push({
        saleAttrId,
        saleAttrValueId,
      })
    }
    return prev
  }, [])

  // 发请求
  const result = await reqAddSku(skuParams)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '添加SKU成功',
    })

    // 通知父组件切换场景为0
    $emit('changeShow', { flag: 0, params: '' })
  } else {
    ElMessage({
      type: 'error',
      message: '添加SKU失败',
    })
  }
}

defineExpose({
  initAddSku
})
</script>

<style scoped>
</style>
