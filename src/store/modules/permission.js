// 专门处理权限路由的模块

// 引入所有静态路由和动态路由
import { constantRoutes, asyncRoutes } from '@/router'
// vuex中的permission模块用来存放当前的 静态路由 + 当前用户的 权限路由
const state = {
  routes: constantRoutes // 所有人默认拥有静态路由
}
const mutations = {
  // 根据权限添加动态路由
  setRoutes(state, newRoutes) {
    // 不应该写成
    // 这样就变成每登陆一个用户就往里面加上新的路由 而不是每次登录新用户 往最初始的constantRoutes里添加新路由
    // state.routes = [...state.routes, ...newRoutes]
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  // 根据用户menu里的标识筛选路由权限
  filterRoutes(context, menus) {
    const routes = [] // 存放筛选出来的该用户当前可访问的权限路由
    menus.forEach(item => {
      // 循环每个item 都遍历一次asyncRoutes 看有无路由对象的name属性 等于 item
      // 筛选出符合条件的 存入routes 最后的routes可能有元素也可能为空
      routes.push(...asyncRoutes.filter(obj => obj.name === item)) // filter()返回一个新数组 因此如果不解构就push 最后的routes会变成一个二维数组 [[{}],[{}],...] addRoute()需要的是一个对象
    })
    // 把routes结果提交到mutations 修改store里的routes 它是给vuex用的
    context.commit('setRoutes', routes)
    // 同时 返回这个routes 它是给addRoutes用的
    return routes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
