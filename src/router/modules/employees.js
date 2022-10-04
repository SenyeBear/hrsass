// 员工的路由规则
import Layout from '@/layout'

export default {
  path: '/employees',
  name: 'employees', // 给模块的一级路由name属性 用于后续的权限处理
  component: Layout,
  children: [{
    path: '',
    component: () => import('@/views/employees'),
    // 路由的元信息 一个存储数据的地方 可以放任何内容
    meta: {
      title: '员工管理', // 这里使用title因为左侧导航读取了title
      icon: 'people'
    }
  }, {
    path: 'detail/:id', // query传参 动态路由传参
    component: () => import('@/views/employees/detail'),
    hidden: true, // 不在左侧菜单显示
    meta: {
      title: '员工详情' // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
    }
  }, {
    path: 'print/:id',
    component: () => import('@/views/employees/print'),
    hidden: true,
    meta: {
      title: '打印', // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
      icon: 'people'
    }
  }

  ]
}
