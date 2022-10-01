<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px;  width: 100%">
    <!-- 左侧内容 -->
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <!-- 右侧内容 -->
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 放置下拉菜单 -->
          <el-dropdown @command="operateDepts">
            <!-- 内容 -->
            <span>
              操作
              <i class="el-icon-arrow-down" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="delete">删除子部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'

export default {
  props: {
    // 定义传入属性
    treeNode: {
      required: true,
      type: Object
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 对部门的操作方法 点击'添加' '编辑' '删除' 时触发
    operateDepts(type) {
      if (type === 'add') {
        // 添加部门
        // 触发事件 通知父组件改变showDialog 显示弹层
        // this.treeNode让父组件直到当前点击的是哪个节点
        this.$emit('addDepts', this.treeNode)
      } else if (type === 'edit') {
        // 编辑部门
        this.$emit('editDepts', this.treeNode)
      } else {
        // 删除部门
        this.$confirm('您确定要删除该组织部门吗？').then(() => {
          delDepartments(this.treeNode.id)
        }).then(() => {
          // 等待成功 此时后端数据变化了 前端还没变 需要通知父组件更新
          this.$emit('delDepts')
          this.$message.success('删除部门成功')
        })
      }
    }
  }
}
</script>

<style  scoped>

</style>
