<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12"></el-col>
      <el-col :span="12">
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="forms"
        >
          <h1>Hello</h1>
          <h2>欢迎使用万象管家</h2>
          <el-form-item prop="username">
            <el-input
              placeholder="请输入用户名"
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              placeholder="请输入密码"
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              class="login_button"
              type="primary"
              size="default"
              color="blue"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import useUserStore from '@/store/models/user'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/time'

let forms = ref()
let loading = ref(false)
let $router = useRouter()
let $route = useRoute()
let userStore = useUserStore()
// 收集表单数据
let loginForm = reactive({ username: 'admin', password: '111111' })
// 这里可以添加登录逻辑
const login = async () => {
  try {
    // 表单校验通过才能发请求
    await forms.value.validate()
    loading.value = true
    // 异步操作确保按序执行
    await userStore.userLogin(loginForm)
    let redirect:any = $route.query.redirect
    // 登录时有query参数，登录成功后跳转到首页
    $router.push({path: redirect || '/'})
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `Hi，${getTime()}好`,
    })
    loading.value = false
  } catch (error) {
    loading.value = false
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}
// 定义表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符之间', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符之间', trigger: 'blur' },
  ],
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@assets/images/background.jpg') no-repeat center center;
  background-size: cover;

  .login_form {
    position: relative;
    width: 75%;
    top: 30vh;
    background: rgba(122, 234, 253, 0.2);
    background-size: cover;
    padding: 2.5rem;
    border-radius: 0.625rem;
    backdrop-filter: blur(3px);

    h1 {
      font-size: 40px;
      color: #ffffff;
    }

    h2 {
      font-size: 20px;
      color: #ffffff;
      margin: 20px 0;
    }

    .login_button {
      width: 6rem;
      height: 2rem;
      font-size: 15px;
      color: #ffffff;
      background-color: #409eff;
      border-radius: 5px;
      // 居中显示
      display: block;
      margin: 0 auto;

      &:hover {
        background-color: #66b1ff;
      }
    }
  }
}
</style>
