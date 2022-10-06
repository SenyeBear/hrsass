//  采用全局mixin(混入)来让所有的组件可以拥有一个公共的方法
// 记得要在main.js全局注册
import store from '@/store'
export default {
  methods: {
    // 检查当前用户是否拥有操作对应的point权限
    // key为设置的进行当前操作对应的标识
    checkPermission(key) {
      const { userInfo } = store.state.user
      if (userInfo.roles && userInfo.roles.points) {
        return userInfo.roles.points.some(item => item === key)
      }
      return false
    }
  }
}
