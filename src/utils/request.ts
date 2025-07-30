import axios from 'axios'
import { ElMessage } from 'element-plus'
import userStore from '@/store/models/user'
// 创建axios实例
let request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // 设置基础URL
  timeout: 5000, // 设置请求超时时间
})

// 请求拦截器
request.interceptors.request.use((config) => {
  // config配置对象，headers属性请求头，经常给服务器端携带公共参数
  let user = userStore()
  if (user.token) {
    // 如果有token，设置请求头
    config.headers.token = user.token
  }
  // 返回配置对象
  return config
})

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 成功回调
    return response.data
  },
  (error) => {
    // 失败回调
    // 可以在这里处理错误信息
    let message = ''
    switch (error.response.status) {
      case 400:
        message = '请求错误(400)'
        break
      case 401:
        message = 'TOKEN过期，请重新登录(401)'
        break
      case 403:
        message = '无权访问(403)'
        break
      case 404:
        message = '请求地址错误(404)'
        break
      case 500:
        message = '服务器错误(500)'
        break
      default:
        message = `连接错误${error.response.status}`
        break
    }
    ElMessage({
      message: message,
      type: 'error',
    })
    return Promise.reject(error)
  },
)

export default request
