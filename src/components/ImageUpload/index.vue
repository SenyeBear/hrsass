<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :file-list="fileList"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="change"
      :before-upload="beforeUpload"
      :http-request="uploadHttpRequest"
      :class="{disabled: fileComputed}"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog title="图片" :visible.sync="showDialog">
      <img :src="imgUrl" alt="" style="width: 100%">
    </el-dialog>
    <el-progress v-if="showProgress" :percentage="percent" style="width: 180px" />
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5' // 引入腾讯云COS包
// 实例化一个COS对象
const cos = new COS({
  SecretId: 'AKIDb6PchbLsBLRQM7nJeyf8XlndKo6PXSDO',
  SecretKey: '6ydv2xhGJtIXky52zmNFxTovnAWggWCi'
})

export default {
  data() {
    return {
      fileList: [], // 上传图片地址的数组 绑定到file-list属性 组件会显示图片
      showDialog: false,
      imgUrl: '', // 预览图片的地址
      currentFileUid: '',
      percent: 0,
      showProgress: false
    }
  },
  computed: {
    fileComputed() {
    //   如果length=1 表示上传了一张图片 +号隐藏
      return this.fileList.length === 1
    }
  },
  methods: {
    // file是el-upload:on-preview钩子触发传入的参数
    preview(file) {
      this.imgUrl = file.url
      this.showDialog = true
    },
    handleRemove(file) {
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    change(file, fileList) {
      this.fileList = fileList.map(item => item)
    },
    beforeUpload(file) {
      // 检查文件类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      // 检查文件大小
      const maxSize = 5 * 1024 * 1024 // 单位转换 file.size默认单位为bit
      if (file.size > maxSize) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      // 检查通过 确定该文件就是要上传的文件
      this.currentFileUid = file.uid
      this.showPercent = true
      return true
      // 上传到腾讯云的存储桶
    },
    uploadHttpRequest(params) {
      if (params.file) {
        // 如果有file就执行上传操作
        cos.putObject({
          Bucket: 'senye-1314205743',
          Region: 'ap-chengdu',
          Key: params.file.name,
          Body: params.file,
          StorageClass: 'STANDARD',
          onProgress: function(progressData) {
            this.percent = progressData.percent * 100
          }
        }, (err, data) => {
          if (!err && data.statusCode === 200) {
            // 上传成功 获取成功返回的地址
            // 需要知道当前上传成功的是哪一张图片
            // 因为用了this. 它指向当前vue实例的data里的filList 因此不能使用function的形式而要用箭头函数 因为箭头函数this指向最近的一个外层this
            this.fileList = this.fileList.map(item => {
              if (item.uid === this.currentFileUid) {
                // 将成功的地址赋值给原来的url属性
                // 仍然有个小问题， 比如此时我们正在上传，但是调用了保存，保存在上传过程中进行，
                // 此时上传还没有完成  此时可以这样做 ： 给所有上传成功的图片 加一个属性 upload: true
                return { url: 'http://' + data.Location, upload: true }
                // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
              }
              return item
            })
            setTimeout(() => {
              this.showPercent = false // 隐藏进度条
              this.percent = 0 // 进度归0
            }, 2000)
            // 将上传成功的地址 回写到了fileList中 fileList变化  =》 upload组件 就会根据fileList的变化而去渲染视图
          }
        })
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none
}
</style>
