<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构-头部 -->
      <el-card class="tree-card">
        <!-- 放置内部结构 -->
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!-- 放置el-tree -->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!-- 传入内容 插槽内容 有多少节点就循环几次-->
          <!-- 作用域插槽 slot-scope="obj" 接收父组件给子组件el-tree的数据，它又作为子组件传递给插槽的数据departs
          { data }解构赋值 是每个节点的数据对象 -->
          <tree-tools slot-scope="{ data }" :tree-node="data" @delDepts="getDepartments" @addDepts="addDepts" @editDepts="editDepts" />
        </el-tree>
      </el-card>
      <add-dept ref="addDepts" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import AddDept from './components/add-dept.vue'

export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      company: {}, // 头部数据结构
      departs: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      showDialog: false, // 默认不显示弹层
      node: null, // 记录下当前点击的是哪个节点
      loading: false
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    // 获取组织架构
    async getDepartments() {
      this.loading = true
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(result.depts, '') // 将数组数据转化成树形结构
      this.loading = false
    },
    // 新增部门
    addDepts(node) {
      this.showDialog = true // 显示弹层
      this.node = node // 因为node是当前的点击的部门 此时这个部门应该记录下来
    },
    // 编辑部门
    editDepts(node) {
      this.showDialog = true // 显示弹层
      // 点击编辑按钮 记录当前点击的节点 （新增和编辑不可能同时发生）
      this.node = node
      // 但是props传值是异步的
      // 调用获取部门详情的方法不是在父组件 而是在子组件add-dept
      // 因此涉及到父组件调用子组件方法
      // ref获取组件实例
      this.$refs.addDepts.getDepartDetail(node.id)
    }

  }
}
</script>

<style>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>
