<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 工具栏 -->
      <page-tools :show-before="true">
        <!-- 左插槽 显示数据总条数 -->
        <template v-slot:before>
          <span>共{{ page.total }}条记录</span>
        </template>
        <!-- 右插槽 显示操作按钮 -->
        <template v-slot:after>
          <el-button type="success" @click="$router.push('/import?type=user')">excel导入</el-button>
          <el-button type="danger" @click="exportEmployee">excel导出</el-button>
          <el-button type="primary" @click="addEmployee">新增员工</el-button>
        </template>
      </page-tools>
      <el-card v-loading="loading">
        <!-- 表格 -->
        <el-table border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="头像" align="center">
            <template slot-scope="{ row }">
              <img
                v-imageerror="require('@/assets/common/bigUserHeader.png')"
                :src="row.staffPhoto"
                alt=""
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                @click="showQRCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="formatEmployee" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry" align="center">
            <template slot-scope="{row}">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <template slot-scope="{row}">
              <el-switch :value="row.enableState === 0" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="obj">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${obj.row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="deleteEmployee(obj.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            layout="prev, pager, next"
            :total="page.total"
            :current-page="page.page"
            :page-size="page.size"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
      <!-- 弹出层 -->
      <add-employee :show-dialog.sync="showDialog" />
      <!-- 二维码弹层 -->
      <el-dialog :visible.sync="showCodeDialog" title="二维码">
        <el-row type="flex" justify="center">
          <canvas ref="myCanvas" />
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getEmployeeList, deleteEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee'
import { formatDate } from '@/filters/index'
import QrCode from 'qrcode'

export default {
  components: {
    AddEmployee
  },
  data() {
    return {
      EmployeeEnum, // 聘用形式数据，便于方法使用
      loading: false, // 控制加载中遮罩层显示隐藏
      list: [], // 接收员工数据列表
      // 分页相关数据
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      showDialog: false, // 控制弹出层显示隐藏
      showCodeDialog: false
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    async deleteEmployee(id) {
      try {
        // 一定要等执行完confirm才能执行下面的删除
        await this.$confirm('是否确认删除该员工信息？')
        await deleteEmployee(id)
        this.$message.success('删除成功')
        this.getEmployeeList()
      } catch (err) {
        console.log(err)
      }
    },
    async addEmployee() {
      this.showDialog = true
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList(this.page)
    },
    formatEmployee(row, column, cellValue, index) {
      // find() 方法返回数组中满足提供的测试函数的第一个元素的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    exportEmployee() {
      // 实现数据的英文字段和表格中文字段的转换
      // 建立对应关系
      const headerRelations = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }

      // js-xlsx体积很大 只有点击导出按钮才导入 实现懒加载
      import('@/vendor/Export2Excel').then(async excel => {
        // 获取后端数据
        // 没有接口提供获取全部数据 可以利用getEmployeeList将size设为total在一页内获取所有数据
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(headerRelations, rows)
        // [扩展] 复杂表头的导出
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']] // [[],[],...] 二维数组，数组内一个数组表示一行
        const merges = ['A1:A2', 'B1:F1', 'G1:G2'] // 需要合并的单元格
        /* excel.export_json_to_excel({
          header: '', // 表头 必填 ['姓名', '手机号']
          data, // 具体数据 必填 [['张三','1234'],['李四', '5678'],...]
          filename: '员工信息', // 导出文件名
          autoWidth: true, // 单元格是否要自适应宽度 非必填
          bookType: 'xlsx' // 导出格式 默认为xlsx 非必填
        }) */
        excel.export_json_to_excel({
          header: Object.keys(headerRelations),
          data,
          filename: '员工信息',
          multiHeader, // 复杂表头
          merges // 合并选项
        })
      })
    },
    // 将数组转化成二维数组
    formatJson(headerRelations, rows) {
      // 要求传入的data格式为[[],[],[],...] 且需要与表头header内字段顺序一一对应
      // 现在的格式：[{username: '张三', mobile: '1234', ...}，{}，{}]
      // 目标格式：[['张三','1234'],['李四', '5678'],...]
      // 1. 遍历rows获取的是一个个对象item
      // 2. Object.keys方法获取了headerRelations中文字段的数组 进行中英转化
      // 3.根据中文键名获取英文键名 再获取每个item里的对应值
      return rows.map(obj => {
        const header = Object.keys(headerRelations) // ["姓名","手机号",...]
        return header.map(item => {
          // 处理聘用形式
          if (headerRelations[item] === 'formOfEmployment') {
            // 如果是1，就是正式 2，非正式
            // find() 方法返回数组中满足提供的测试函数的第一个元素的值 此处返回一个对象
            const isIn = EmployeeEnum.hireType.find(item2 => item2.id === obj[headerRelations[item]])
            return isIn ? isIn.value : '未知'
          } else if (headerRelations[item] === 'timeOfEntry' || headerRelations[item] === 'correctionTime') {
            // 处理日期格式
            return formatDate(obj[headerRelations[item]])
          }
          return obj[headerRelations[item]]
        })
      })
    },
    showQRCode(url) {
      // 只有url存在才弹出弹出
      if (url) {
        this.showCodeDialog = true
        // 数据更新了弹出层不会立刻出现 页面渲染时异步的 此时myCanvas拿不到
        // 使用$nextTick 等待页面渲染完毕才获取dom对象
        this.$nextTick(() => {
          // 此时可以确认有ref对象
          QrCode.toCanvas(this.$refs.myCanvas, url) // // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
          return
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    }
  }
}
</script>

<style>

</style>
