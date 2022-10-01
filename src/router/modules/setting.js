// 设置的路由规则
import Layout from '@/layout'

export default {
  path: '/setting',
  name: 'setting', // 给模块的一级路由name属性 用于后续的权限处理
  component: Layout,
  children: [{
    path: '',
    component: () => import('@/views/setting'),
    // 路由的元信息 一个存储数据的地方 可以放任何内容
    meta: {
      title: '公司设置', // 这里使用title因为左侧导航读取了title
      icon: 'setting'
    }
  }]
}
