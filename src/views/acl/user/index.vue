<template>
  <div>
    <el-card style="height: 75px;margin-bottom: 10px;">
      <el-form :inline="true">
        <el-form-item label="用户名">
          <el-input placeholder="请输入用户名" v-model="keyWord"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="keyWord ? false : true" @click="search">查询</el-button>
          <el-button @click="refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-button type="primary" @click="addUser">添加</el-button>
      <el-button type="danger" :disabled="selectIdList.length > 1 ? false : true"
        @click="deleteSelectUser">批量删除</el-button>
      <el-table border style="margin: 15px 0;" :data="userArr" @selection-change="selectUser">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column label="id" prop="id"></el-table-column>
        <el-table-column label="用户昵称" prop="username" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户名称" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户角色" prop="roleName" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新时间" prop="updateTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="270px">
          <template #="{ $index, row }">
            <el-button type="warning" size="small" @click="handleRole(row)" icon="User">分配角色</el-button>
            <el-button type="primary" size="small" @click="handleEdit(row)" icon="Edit">编辑</el-button>
            <el-popconfirm :title="`你确定要删除${row.username}?`" width="260px" @confirm="handleDelete(row.id)">
              <template #reference>
                <el-button type="danger" size="small" icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="getUserInfo" @size-change="sizeChange" :pager-count="7"
        v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]" :background="true"
        layout="prev, pager, next, jumper, ->, sizes, total" :total="total" />
    </el-card>
    <!-- 修改添加用户的抽屉组件 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>{{ userParams.id ? '修改用户' : '添加用户' }}</h4>
      </template>
      <template #default>
        <el-form :model="userParams" :rules="rules" ref="formRef">
          <el-form-item label="用户名称" prop="name">
            <el-input placeholder="请您输入用户名称" v-model="userParams.name"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="username">
            <el-input placeholder="请您输入用户昵称" v-model="userParams.username"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
            <el-input placeholder="请您输入用户密码" v-model="userParams.password"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </div>
      </template>
    </el-drawer>
    <!-- 分配角色的抽屉组件 -->
    <el-drawer v-model="drawer1">
      <template #header>
        <h4>分配用户角色</h4>
      </template>
      <template #default>
        <el-form :model="userParams">
          <el-form-item label="用户名称" prop="name">
            <el-input :disabled="true" v-model="userParams.username" />
          </el-form-item>
        </el-form>
        <el-form>
          <el-form-item label="角色列表">
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate"
              @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="(role, index) in allRole" :key="index" :label="role">{{ role.roleName }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer1 = false">取消</el-button>
          <el-button type="primary" @click="save1">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import type { AllRole, AllRoleResponseData, Records, SetRoleData, User, UserResponseData } from '@/api/acl/user/type';
import { reqAddOrUpdateUser, reqAllRole, reqRemoveUser, reqSelectUser, reqSetUserRole, reqUserInfo } from '@/api/acl/user';
import { ref, onMounted, reactive, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import useCollapseStore from '@/store/models/collapse';

let currentPage = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
//存储全部用户的数组
let userArr = ref<Records>([]);
let drawer = ref<boolean>(false)
let drawer1 = ref<boolean>(false)
let userParams = reactive<User>({
  username: '',
  name: '',
  password: ''
});
//收集form对象 
let formRef = ref()
//分配角色相关属性
let checkAll = ref(false)
// 全选按钮的不确定状态
let isIndeterminate = ref(true)
//存储全部职位的数据
let allRole = ref<AllRole>([])
//当前用户已有的职位
let userRole = ref<AllRole>([])
// 复选框id列表
let selectIdList = ref<number[]>([])

//搜索关键字
const keyWord = ref<string>('')

onMounted(() => {
  getUserInfo()
})
// 获取全部用户信息
const getUserInfo = async (page: number = 1) => {
  currentPage.value = page
  let result: UserResponseData = await reqUserInfo(currentPage.value, pageSize.value, keyWord.value)
  if (result.code === 200) {
    userArr.value = result.data.records
    total.value = result.data.total
  }
}
// 改变每页容量
const sizeChange = () => {
  getUserInfo()
}

// 添加角色
const addUser = () => {
  drawer.value = true
  //清空上次输入的数据
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: ''
  })
  //清理所有字段的表单验证信息。
  nextTick(() => {
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('password')
  })
}
// 修改角色
const handleEdit = (row: User) => {
  drawer.value = true
  Object.assign(userParams, row)
  //清理所有字段的表单验证信息。
  nextTick(() => {
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('username')
  })
}
// 保存新增/修改的角色信息
const save = async () => {
  //先对整个表单进行校验
  await formRef.value.validate()
  let res = await reqAddOrUpdateUser(userParams)
  // console.log(res)
  if (res.code === 200) {
    //关闭抽屉
    drawer.value = false;
    ElMessage.success(userParams.id ? '修改成功' : '添加成功')
    //再次获取用户信息(因为下面又使用了页面刷新,所以这里可以不用获取用户信息了)
    //让页面重新刷新（防止修改自己账号而显示错误）
    window.location.reload()
  } else {
    //关闭抽屉
    drawer.value = false;
    ElMessage.error(userParams.id ? '修改失败' : '添加失败')
  }
}

// 分配角色
const handleRole = async (row: User) => {
  drawer1.value = true
  //修改全选按钮的选中状态
  isIndeterminate.value = row.roleName ? true : false
  //存储已有的用户信息
  Object.assign(userParams, row);
  const res: AllRoleResponseData = await reqAllRole((row.id as number))
  if (res.code === 200) {
    allRole.value = res.data.allRolesList
    userRole.value = res.data.assignRoles
  }
}

const handleCheckAllChange = (val: boolean) => {
  isIndeterminate.value = false
  userRole.value = val ? allRole.value : []
}
const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < allRole.value.length
}

// 保存分配角色
const save1 = async () => {
  //收集数据(用户id,角色id数组)
  const data: SetRoleData = {
    userId: (userParams.id as number),
    roleIdList: userRole.value.map(item => (item.id as number))
  }
  let result: any = await reqSetUserRole(data);
  if (result.code === 200) {
    //提示信息
    ElMessage({ type: 'success', message: '分配职务成功' });
    //关闭抽屉
    drawer1.value = false;
    //获取更新完毕用户的信息,更新完毕留在当前页
    getUserInfo(currentPage.value);
  } else {
    ElMessage({ type: 'error', message: '分配职务失败' });
  }
}

// 删除一个
const handleDelete = async(id: number) => {
  let result: any = await reqRemoveUser(id);
  if (result.code === 200) {
    ElMessage({ type: 'success', message: '删除成功' });
    getUserInfo(userArr.value.length > 1 ? currentPage.value : currentPage.value - 1);
  } else {
    ElMessage({ type: 'error', message: '删除失败' });
  }
}

// 改变用户表格复选框
const selectUser = (val: any) => {
  selectIdList.value = val
}

// 批量删除
const deleteSelectUser = async() => { 
  // map获取选中的id列表
  let idList = selectIdList.value.map((item: any) => item.id)
  let result: any = await reqSelectUser(idList);
  if (result.code == 200) { 
    ElMessage({ type: 'success', message: '批量删除成功' });
    getUserInfo(userArr.value.length > 1 ? currentPage.value : currentPage.value - 1);
  }else { 
    ElMessage({ type: 'error', message: '批量删除失败' });
  }
}

// 搜索用户
const search = () => {
  getUserInfo()
  keyWord.value = ''
}

//重置
const collapseStore = useCollapseStore()
const refresh = () => {
  collapseStore.updateReflash()
}

//表单校验规则
const validateUsername = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 8) {
    callback()
  } else {
    callback(new Error('用户名必须大于8位'))
  }
}
const validateName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 8) {
    callback()
  } else {
    callback(new Error('姓名必须大于8位'))
  }
}
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 6) {
    callback()
  } else {
    callback(new Error('密码必须大于等于6位'))
  }
}
const rules = {
  username: [{ required: true, trigger: 'blur', validator: validateUsername }],
  name: [{ required: true, trigger: 'blur', validator: validateName }],
  password: [{ required: true, trigger: 'blur', validator: validatePassword }]
}

</script>

<style scoped></style>
