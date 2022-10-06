<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
      <el-row type="flex" justify="center" style="margin-top: 20px">
        <el-button type="danger" size="small" @click="btnCancel">取消</el-button>
        <el-button type="primary" size="small" @click="btnOK">确认</el-button>
      </el-row>
    </el-checkbox-group>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'

export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      roleList: [], // 所有角色列表
      roleIds: [] // 当前用户拥有的角色列表
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 })
      this.roleList = rows
    },
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds
    },
    async btnOK() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      this.$emit('update:showRoleDialog', false)
    },
    btnCancel() {
      this.roleIds = [] // 清空原来选择的数组
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style  scoped>

</style>
