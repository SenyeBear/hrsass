<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="formData" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <el-option v-for="obj in peoples" :key="obj.id" :label="obj.username" :value="obj.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartDetail } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 检测部门名称是否与同级子部门名称重复
    const checkNameReapeat = async(rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 有id 编辑业务 名称不能与其他同级部门名称重复 注意筛出自己的这条再来判断
        isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        // 无id 新增业务
        // 根据 节点id = 子节点pid 找到该部门下所有子节点 再检验是否重复
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }
    // 检测部门编码是否与所有部门编码重复
    const checkCodeRepeat = async(rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        isRepeat = depts.filter(item => item.id !== this.formData.id).some(item => item.code === value && value !== '')
      } else {
        // 考虑到部门数据可能没有code 所以加上value不为空值的条件
        isRepeat = depts.some(item => item.code === value && value !== '')
      }
      isRepeat ? callback(new Error(`组织架构中已经有部门使用${value}编码`)) : callback()
    }
    return {
      // 表单数据
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      // 校验规则
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称长度为1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkNameReapeat }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称长度为1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkCodeRepeat }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍长度为1-300个字符', trigger: 'blur' }]
      },
      peoples: [] // 接收员工数据 渲染到选择部门负责人
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },

    btnOK() {
      // 手动表单验证
      this.$refs.formData.validate(async(isOK) => {
        // 校验通过 调用新增部门的接口 根据接口传数据
        // 要告诉后台在哪个地方新增子节点 利用 子节点pid = 节点id
        if (isOK) {
          if (this.formData.id) {
            await updateDepartDetail(this.formData)
          } else {
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
            // 调用成功后 通知父组件更新数据
            this.$emit('addDepts')
          }
          // 关闭弹层
          this.$emit('update:showDialog', false)
          // 清空表单数据
          this.$refs.formData.resetFields()
          // 关闭dialog时自动会触发它内置的close事件 所以此处无需再重置数据
        }
      })
    },

    btnCancel() {
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 关闭弹层
      this.$emit('update:showDialog', false)
      // 清空表单数据
      this.$refs.formData.resetFields()
    },

    // 获取部门详情
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    }
  }
}
</script>

<style  scoped>

</style>
