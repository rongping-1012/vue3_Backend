<template>
  <div>
    <!-- 三级分类组件 -->
    <Category :isShow="isShow"></Category>
    <el-card>
    <!-- 属性展示 -->
      <div v-show="isShow === 0">
        <el-button type="primary" icon="Plus" @click="addAttr"
          :disabled="categoryStore.c3Id ? false : true">添加属性</el-button>
        <el-table style="margin: 15px 0;" border :data="attrList">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性名称" prop="attrName" width="150px"></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-tag v-for="(item, index) in row.attrValueList" :key="index" style="margin: 5px;">{{ item.valueName
                }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template #="{ row, $index }">
              <el-button type="primary" size="small" icon="Edit" @click="editAttr(row, $index)"></el-button>
              <el-popconfirm title="确定要删除吗？" @confirm="deleteAttr(row.id)" icon="Delete" width="250">
                <template #reference>
                  <el-button type="danger" size="small" icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="isShow === 1">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input v-model="attrParams.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="Plus" @click="addAttrValue"
          :disabled="attrParams.attrName ? false : true">添加属性值</el-button>
        <el-button @click="cancelAttrN">重置所有</el-button>
        <el-table border style="margin: 10px 0;" :data="attrParams.attrValueList">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性值">
            <template #="{ row, $index }">
              <el-input placeholder="请输入属性值" v-model="row.valueName" v-if="row.isEdit" @blur="leaveInput(row, $index)"
                :ref="(vc: any) => inputArr[$index] = vc"></el-input>
              <div v-else @click="focusDiv(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #="{ row, $index }">
              <el-button type="danger" size="small" icon="CloseBold" @click="deleteAttrValue($index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="save" :disabled="attrParams.attrValueList[0] ? false : true">保存</el-button>
        <el-button @click="cancelEdit">取消</el-button>

      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive, nextTick, onBeforeMount } from 'vue'
import { reqCategory, reqAddOrUpdateAttr, reqDeleteAttr } from '@/api/product/attr'
import useCategoryStore from '@/store/models/category'
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'
import { ElMessage } from 'element-plus'


let categoryStore = useCategoryStore()
let attrList = ref<Attr[]>([])
// 控制卡片显示
let isShow = ref<number>(0)
let attrParams = reactive<Attr>({
  attrName: '',
  attrValueList: [],
  categoryId: '',
  categoryLevel: 3
})
// 存储el-input组件实例
let inputArr = ref<any>([])

// 监听c3Id, 请求属性数据 
watch(() => categoryStore.c3Id, () => {
  attrList.value = []
  getAttr()
})
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore

  if (categoryStore.c3Id) {
    let result: AttrResponseData = await reqCategory(c1Id, c2Id, c3Id)
    if (result.code === 200) {
      attrList.value = result.data
    }
  }
}

// 添加属性，切换卡片
const addAttr = () => {
  isShow.value = 1
  cancelAttrN()
  // 搜集3级分类id给新增或修改的表单
  attrParams.categoryId = categoryStore.c3Id
}
// 添加属性值
const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
    isEdit: true   // 切换编辑状态/查看状态
  })
  // 聚焦最后的属性值
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}

// 聚焦div属性值
const focusDiv = (row: any, index: number) => {
  row.isEdit = true
  // 聚焦当前的属性值
  nextTick(() => {
    inputArr.value[index].focus()
  })
}
// 取消当前添加的所有属性值
const cancelAttrN = () => {
  Object.assign(attrParams, {
    attrName: '',
    attrValueList: [],
    categoryId: '',
    categoryLevel: 3
  })
}

// 删除属性值
const deleteAttrValue = (index: number) => {
  // 删除数组中的元素
  attrParams.attrValueList.splice(index, 1)

}
// 保存按钮
const save = async () => {
  if (attrParams.attrValueList.length === 0) {
    ElMessage.error('请添加属性值')
    return
  } else if (attrParams.attrValueList.some(item => !item.valueName)) {
    ElMessage.error('请将当前属性值填写完整')
    return
  }
  let result = await reqAddOrUpdateAttr(attrParams)
  if (result.code === 200) {
    // 添加成功提示信息，清空数据，切换卡片，获取新的属性列表
    ElMessage.success(attrParams.id ? '修改成功' : '添加成功')
    cancelAttrN()
    isShow.value = 0
    getAttr()
  } else {
    ElMessage.error(attrParams.id ? '修改失败' : '添加失败')
  }
}
// 属性值框失去焦点
const leaveInput = (row: AttrValue, index: number) => {
  // 如果属性值名称没有填写，则删除
  if (!row.valueName.trim()) {
    deleteAttrValue(index)
    ElMessage.error('请输入属性值')
    return
  }
  // 属性重复，也不执行后面直接删除
  let isRepeat = attrParams.attrValueList.find((item) => {
    // item和row不是一个对象时
    if (item !== row) {
      // 判断它们的属性值是否相等
      return item.valueName === row.valueName
    }
  })
  if (isRepeat) {
    ElMessage.error('属性值不能重复')
    deleteAttrValue(index)
    return
  }
  row.isEdit = false
}

// 编辑属性，带当前点击的属性参数, row携带当前点击的属性值id
const editAttr = (row: any, index: number) => {
  isShow.value = 1
  cancelAttrN()
  // row 对象的深拷贝，对新对象的修改不会影响到原来的 row 对象
  // 第一种：JSON.parse(JSON.stringify(row))
  // 把对象转换成 JSON 字符串，简单数据类型存储到了栈中，然后再将 JSON 字符串转换成对象，重新在堆中开辟空间存储，不会影响原对象数据
  // structuredClone(toRaw(row))要接触row的被代理数据
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
  // 搜集3级分类id给新增或修改的表单
  attrParams.categoryId = categoryStore.c3Id
}

// 退出编辑
const cancelEdit = () => {
  isShow.value = 0
  cancelAttrN()
}

// 删除属性
const deleteAttr = async(id: number) => {
  let result = await reqDeleteAttr(id)
  if (result.code === 200) {
    ElMessage.success('删除成功')
    getAttr()
  } else {
    ElMessage.error('删除失败')
  }
  
}

// 组件销毁时清空数据
// onBeforeMount(() => {  
//   categoryStore.$reset()
// })
</script>

<style scoped></style>
