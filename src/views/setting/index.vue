<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 角色管理 -->
          <el-tab-pane label="角色管理">
            <el-row style="height:60px">
              <el-button icon="el-icon-plus" type="primary" size="small" @click="showDialog = true">新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table :data="list">
              <el-table-column align="center" type="index" label="序号" width="120" />
              <el-table-column align="center" prop="name" label="角色名称" width="240" />
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column align="center" label="操作">
                <template slot-scope="{ row }">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination
                :page-size="page.pagesize"
                :total="page.total"
                layout="prev,pager,next"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <!-- 公司信息 -->
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
            />
            <el-form ref="form" :model="formData" label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 编辑弹层 -->
      <el-dialog
        title="编辑角色"
        :visible="showDialog"
        center
        @close="btnCancel"
      >
        <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>
        <el-row slot="footer">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" @click="btnOK">确定</el-button>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/setting'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      // 分页数据
      page: {
        page: 1, // 当前页码
        pagesize: 4, // 每页条数
        total: 10 // 总条数
      },
      list: [], // 接收角色数组
      formData: {}, // 接收公司信息 表单对象
      showDialog: false, // 控制弹层显示隐藏
      roleForm: {}, // 接收角色详情 表单对象
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      } // 编辑弹层表单的校验规则
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    async deleteRole(id) {
      // 删除前进行确认询问
      try {
        await this.$confirm('是否确认删除？')
        // 只有点击了确定 才能进入到下方
        await deleteRole(id) // 调用删除接口
        this.getRoleList() // 重新加载数据
        this.$message.success('删除角色成功')
      } catch (err) {
        console.log(err)
      }
    },

    async editRole(id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getRoleList()
    },
    async btnOK() {
      // 手动进行表单验证
      // validate若不传入回调函数，则会返回一个 promise
      await this.$refs.roleForm.validate()
      // 只有校验成功才会进入catch
      try {
        // 进行业务区分 是新增还是编辑 根据id判断 没有id是新增 有id是编辑
        if (this.roleForm.id) {
          // 编辑
          await updateRole(this.roleForm)
        } else {
          // 新增
          await addRole(this.roleForm)
        }
        // await强制等待执行完以上
        // 调用完毕 更新页面数据
        this.getRoleList()
        this.$message.success('操作成功')
        // 关闭弹层
        this.showDialog = false
        // 这里不需要再写重置表单 因为dialog关闭自动触发btnCancel回调
      } catch (err) {
        console.log(err)
      }
    },
    btnCancel() {
      // 手动清空表单 因为resetFields只重置表单数据 不包括id
      this.roleForm = {
        name: '',
        description: ''
      }
      // 清空表单 将所有字段值重置为初始值并移除校验结果
      this.$refs.roleForm.resetFields()
      // 关闭弹层
      this.showDialog = false
    }
  }
}
</script>

<style>

</style>
