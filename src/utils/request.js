import axios from 'axios'
// 引入element-ui 使用错误信息提示
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getTimeStamp } from '@/utils/auth'

// 定义超时时间
const Timeout = 3600

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // /dev-api pro-api
  timeout: 5000 // 设置超时时间
})

// 请求拦截器
service.interceptors.request.use(config => {
  // config请求的配置信息 必须要return的
  // 注入token
  if (store.getters.token) {
    // 只有在有token的情况下 才有必要检查时间戳是否超时
    if (IsCheckTimeout()) {
      // 如果为ture 表示token超时
      // 执行登出操作
      store.dispatch('user/logout')
      // 跳转登录页
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 相应拦截器
service.interceptors.response.use(response => {
  // axios默认加一层data 解构对象
  const { success, message, data } = response.data
  // 根据success成功与否决定下面的操作
  if (success) {
    // 如果成功返回data
    return data
  } else {
    // 如果失败表明业务出错了 结果不能进then必须进catch
    Message.error(message) // 提示错误消息
    // Promise.reject(reason)是Promise的一个静态方法 返回一个状态为失败的Promise对象，并传递给对应的处理方法
    return Promise.reject(new Error(message))
  }
}, error => {
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 状态码等于10002 后端告诉我们token超时了
    // 登出操作
    store.dispatch('user/logout')
    // 跳转登录页
    router.push('/login')
  } else {
    Message.error(error.message) // 提示错误信息
  }
  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入catch
})

// 定义检查是否超时的函数
function IsCheckTimeout() {
  const currentTime = Date.now()
  const timeStamp = getTimeStamp()
  return ((currentTime - timeStamp) / 1000) > Timeout
}

export default service
