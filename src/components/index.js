// 提供注册入口
// 负责所有公共组件的全局注册
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'

export default {
  // Vue.use 可以接收一个对象，Vue.use(obj)
  // 对象obj中需要提供一个 install 函数
  // 在 Vue.use(obj) 时，会自动调用该 install 函数，并传入 Vue构造器（Vue构造函数）
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageUpload', ImageUpload)
  }
}
