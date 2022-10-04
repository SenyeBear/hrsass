<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel">
    <!-- 表单 -->
    <el-form ref="form" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width: 50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width: 50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width: 50%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width: 50%" placeholder="请选择">
          <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width: 50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width: 50%" placeholder="请选择部门" @focus="getTreeData" />
        <!-- el-tree控件数据需要树形数据 -->
        <el-tree v-if="showTree" v-loading="loading" :data="treeData" :props="{ label: 'name' }" :default-expand-all="true" @node-click="selectNode" />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-row type="flex" justify="center" align="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { addEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'

export default {
  name: 'AddEmployee',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      EmployeeEnum, // 聘用形式数据，用于表单选择
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }, // 根据接口设置表单数据字段
      // 校验规则
      rules: {
        username: [{ required: true, message: '员工姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '员工姓名为1-4位', trigger: 'blur'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }],
        correctionTime: [{ required: true, message: '转正时间', trigger: 'blur' }]
      },
      treeData: [], // 接收树形数据
      showTree: false, // 控制树形的显示或者隐藏
      loading: false // 控制树的显示或者隐藏进度条
    }
  },
  methods: {
    async getTreeData() {
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartments()
      this.treeData = await tranListToTreeData(depts, '')
      this.loading = false
    },
    selectNode(obj) {
      this.formData.departmentName = obj.name
      this.showTree = false
    },
    async btnOK() {
      try {
        await this.$refs.form.validate()
        await addEmployee(this.formData)
        // 调用新增接口成功 通知父组件更新数据
        // 这里采用this.$parent 它可以调用父组件的方法 因为add-employee组件被放在div内，所有它的父组件就是index.vue
        this.$message.success('新增成功')
        this.$parent.getEmployeeList()
        // 关闭弹层 弹层关闭会触发close回调btnCancel
        this.$parent.showDialog = false
      } catch (err) {
        console.log(err)
      }
      await addEmployee()
    },
    btnCancel() {
      // 重置表单
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      // 重置校验结果
      this.$refs.form.resetFields()
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style  scoped>

</style>
