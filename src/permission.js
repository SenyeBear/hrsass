// 权限拦截在路由跳转 导航守卫
import router from '@/router'
import store from '@/store'
import nprogress from 'nprogress' // 引入进度条
import 'nprogress/nprogress.css' // 引入进度条样式

// 前置守卫
// next 是前置守卫必须执行的钩子 否则页面死掉
// next() 放过
// next(fasle) 跳转终止
// next(地址) 跳转到某个地址

// 定义白名单
const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  // 导航守卫一开始就开启进度条
  nprogress.start()
  if (store.getters.token) {
    // 如果有token
    if (to.path === '/login') {
      // 如果访问的是登录页 那么跳转到首页
      // 此时有token就不需要再获取资料了
      next('/')
    } else {
      // 只有放过的时候才获取用户资料
      // 且如果vuex中有用户资料的id 表明已经有资料了不需要获取了 如果没有id才需要获取
      if (!store.getters.userId) {
        // dispatch是异步操作 如果说后续需要用户资料获取数据的话 这里必须改成 同步
        const { roles } = await store.dispatch('user/getUserInfo')
        // 在获取完用户资料后 可以拿到menus来筛选权限路由了
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        // console.log(routes)
        // debugger
        // 拿到了筛选后当前用户拥有的权限路由数组 把它通过addRoutes添加到路由表
        // router.addRoutes(routes) // 已经废弃
        // 处理页面刷新原本拥有权限的页面出现404的问题： 404的匹配权限放在了静态路由，而动态路由在没有addRoutes之前，找不到对应的地址，就会显示404，所以我们需要将404放置到动态路由的最后
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
        // Vue3 router.addRoute(...routes)
        // 【注意】 addRoutes 必须 用 next(地址) 不能用next()
        next(to.path) // 相当于多做一次跳转
        // 进门了，但是进门之后我要去的地方的路还没有铺好，直接走，掉坑里，多做一次跳转，再从门外往里进一次，跳转之前 把路铺好，再次进来的时候，路就铺好了
      } else {
        next()
      }
    }
  } else {
    // 如果没有token
    if (whiteList.indexOf(to.path) > -1) {
      // 如果要去的地址在白名单
      next()
    } else {
      // 如果不在白名单
      next('/login')
    }
  }
  nprogress.done() // 手动强制关闭一次 解决手动切换地址时进度条不关闭的问题
})

// 后置守卫
router.afterEach(() => {
  // 关闭进度条
  nprogress.done()
})
