<template>
  <el-card shadow="hover">
    <el-button type="primary" size="default" icon="Plus" @click="openDialog">
      添加品牌
    </el-button>
    <el-table style="margin: 10px 0" border :data="trademarkList">
      <el-table-column
        label="序号"
        width="80px"
        align="center"
        header-align="center"
        type="index"
      ></el-table-column>
      <el-table-column label="品牌名称" header-align="center">
        <template #="{ row, $index }">
          <pre>{{ row.tmName }}</pre>
        </template>
      </el-table-column>

      <el-table-column label="品牌LOGO" header-align="center">
        <template #="{ row, $index }">
          <img
            :src="row.logoUrl"
            alt="图片加载失败"
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>

      <el-table-column label="品牌操作" header-align="center">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updataTrademark(row)"
          ></el-button>
          <el-popconfirm
            title="确定要删除吗？"
            @confirm="deleteTrademark(row.id)"
            icon="Delete"
            width="250"
          >
            <template #reference>
              <el-button type="danger" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="getHasTrademark(currentPage)"
      @size-change="sizeChange"
      :pager-count="7"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
    />
  </el-card>

  <!-- 新增修改模态框 -->
  <el-dialog
    v-model="dialogFormVisible"
    :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
    width="500"
  >
    <el-form
      label-width="auto"
      label-position="left"
      :model="trademarkParams"
      :rules="rules"
      ref="forms"
    >
      <el-form-item label="品牌名称" prop="tmName">
        <el-input
          placeholder="请输入品牌名称"
          v-model="trademarkParams.tmName"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO" prop="logoUrl">
        <el-upload
          :headers="{ token: getToken() }"
          class="avatar-uploader"
          action="/api/admin/product/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="trademarkParams.logoUrl"
            :src="trademarkParams.logoUrl"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button @click="confirm" type="primary">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, nextTick } from 'vue'
import {
  reqHasTrademark,
  reqAddOrUpdataTrademark,
  reqDeleteTrademark,
} from '@/api/product/trademark'
import type {
  Records,
  TradeMark,
  TradeMarkResponseData,
} from '@/api/product/trademark/type'
import { ElMessage } from 'element-plus'
import type { UploadProps } from 'element-plus'
import { getToken } from '@/utils/token'

let currentPage = ref<number>(1)
let pageSize = ref<number>(3)
let total = ref<number>(0)
let trademarkList = ref<Records>([])
let dialogFormVisible = ref<boolean>(false)

// 搜集品牌表单对象
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: '',
})
let forms = ref()
// 请求已有的品牌数据
const getHasTrademark = async (page: number) => {
  currentPage.value = page
  let result: TradeMarkResponseData = await reqHasTrademark(
    currentPage.value,
    pageSize.value,
  )
  // console.log(result);
  if (result.code === 200) {
    total.value = result.data.total
    trademarkList.value = result.data.records
  }
}
// 组件挂载即请求
onMounted(() => {
  getHasTrademark(currentPage.value)
})
// 改变每页容量
const sizeChange = () => {
  currentPage.value = 1
  getHasTrademark(currentPage.value)
}
// 打开模态框
const openDialog = () => {
  dialogFormVisible.value = true
  trademarkParams.id = 0
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  nextTick(() => {
    forms.value.clearValidate('tmName')
    forms.value.clearValidate('logoUrl')
  })
}
// 提交新增/修改品牌信息
const confirm = async () => {
  // 提交时校验
  await forms.value.validate()

  let result = await reqAddOrUpdataTrademark(trademarkParams)
  if (result.code === 200) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
    })
    getHasTrademark(trademarkParams.id ? currentPage.value : 1)
  } else {
    dialogFormVisible.value = false
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败',
    })
  }
}
// 修改品牌信息
const updataTrademark = (row: TradeMark) => {
  dialogFormVisible.value = true
  Object.assign(trademarkParams, row)
}
// 自定义表单校验方法
const validatorTmName = (rule: any, value: string, callback: any) => {
  // rule表单规则
  // value表单的值
  // callback校验的回调
  if (value.trim().length === 0) {
    return callback(new Error('请输入品牌名称'))
  } else if (value.trim().length < 2 || value.trim().length > 10) {
    return callback(new Error('品牌名称长度为2-10个字符'))
  } else {
    callback()
  }
}
// 自定义图片上传校验规则
const validatorLogoUrl = (rule: any, value: string, callback: any) => {
  if (value.trim().length === 0) {
    return callback(new Error('请上传品牌logo'))
  } else {
    callback()
  }
}
// 表单校验规则
const rules = {
  tmName: [
    // required 是否必填 ； trigger 校验时机
    { required: true, trigger: 'blur', validator: validatorTmName },
  ],
  logoUrl: [{ required: true, validator: validatorLogoUrl }],
}

// 删除品牌
const deleteTrademark = async (id: number) => {
  let result = await reqDeleteTrademark(id)
  if (result.code === 200) {
    ElMessage.success('删除成功')
    getHasTrademark(currentPage.value)
  } else {
    ElMessage.error('删除失败')
  }
}
//上传图片之前触发的钩子
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (
    rawFile.type === 'image/jpeg' ||
    rawFile.type === 'image/png' ||
    rawFile.type === 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 > 10) {
      ElMessage.error('图片大小不能超过10M!')
      return false
    }
    return true
  } else {
    ElMessage.error('图片格式只能是jpg或png或gif!')
    return false
  }
}

//图片上传成功触发的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile,
) => {
  //收集返回的url，添加的时候带给服务器
  console.log(response)

  trademarkParams.logoUrl = response.data
  //图片上传成功应清除校验规则
  forms.value.clearValidate('logoUrl')
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
