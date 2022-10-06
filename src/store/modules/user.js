import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router' // 引入重置路由的方法
// 存储状态
const state = {
  // 初始化时从缓存读取状态赋值
  token: getToken(),
  userInfo: {}, // 定义一个空对象 因为getters映射 如果是null就报错
  name: {}
}
// 修改状态
const mutations = {
  // 设置、更新tokon
  setToken(state, token) {
    // 修改vuex的state
    state.token = token
    // vuex变化了，修改缓存数据，实现同步
    setToken(token)
  },

  // 删除缓存
  removeToken(state) {
    state.token = null
    removeToken()
  },

  // 设置用户基本资料状态
  setUserInfo(state, result) {
    // 更新一个对象
    state.userInfo = result // 响应式
    // state,userInfo = { ...result } // 这也是响应式 浅拷贝
    // state.userInfo['username'] = result // 不是响应式
  },

  // 删除用户资料
  removeUserInfo(state) {
    state.userInfo = {}
  }
}

// 执行异步操作
const actions = {
  // 登录操作
  async login(context, data) {
    // 调用api
    // axios请求经过响应拦截器 已经解构 这里的result就是真正需要的token(根据接口文档可知)
    const result = await login(data) // 拿到token
    // 登录成功 存入时间戳
    setTimeStamp()
    // actions修改state必须通过mutations
    context.commit('setToken', result) // 设置、更新token
  },

  // 获取用户基本资料
  async getUserInfo(context) {
    const result = await getUserInfo()
    // 根据用户id 获取用户详情
    const baseInfo = await getUserDetailById(result.userId)
    // 合并两个接口返回的数据 提交到mutations
    context.commit('setUserInfo', { ...result, ...baseInfo })
    return result // 为后期做权限做铺垫
  },

  // 登出操作
  logout(context) {
    // 删除token
    context.commit('removeToken')
    // 删除用户资料
    context.commit('removeUserInfo')
    // 重置路由
    resetRouter()
    // 清除vuex中permission模块下state的数据
    // 这里是在user子模块 要调用permission子模块的action
    // 子模块调用子模块的action  默认情况下 子模块的context是子模块的
    // 子模块调用子模块的action 可以 将 commit的第三个参数 设置成  { root: true } 就表示当前的context不是子模块了 而是父模块
    // 加上子模块路径 因为上了命名空间锁
    context.commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
