<template>
  <upload-excel :on-success="success" />
</template>

<script>
import UploadExcel from '@/components/UploadExcel'
import { importEmployee } from '@/api/employees'

export default {
  components: {
    UploadExcel
  },
  data() {
    return {
      // 为了让这个页面可以服务更多的导入功能，我们可以在页面中用参数来判断，是否是导入员工
      type: this.$route.query.type
    }
  },
  methods: {
    async success({ header, results }) {
      // console.log(data) // {header: [中文键值], results: [{},{},{}]}
      // 将中文键值转换成英文键值
      // 设置一个对应关系
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const arr = []
      // 遍历results对象 每次遍历，初始化一个新对象，
      // 在每个单独的对象中 遍历所有中文键值数组，根据中文键值取出userRelation里的英文键值
      // 将英文键值作为键值，根据中文键值在reslts中找到值存入
      // 最后将这些新对象放到一个新数组中放回 (后端接口要求返回格式为数组)
      results.forEach(item => {
        const obj = {}
        Object.keys(item).forEach(key => {
          // 需要在此判断是不是日期列 如果是需要单独处理格式
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            // 后端要求 不能是字符串 因此必须转成日期对象类型 才能入库
            obj[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
            // 必须return 因为存储过一次值了 否则会继续执行下面代码 覆盖原来格式化的日期值
            return
          }
          obj[userRelations[key]] = item[key]
        })
        arr.push(obj)
      })
      // console.log(arr)
      // 调用接口
      await importEmployee(arr)
      // 提示消息
      this.$message.success('导入成功')
      // 返回原页面
      this.$router.back()
    },
    // 实现excel日期和js日期的转化
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style  scoped>

</style>
