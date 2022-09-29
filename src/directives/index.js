// 该文件负责管理所有自定义指令

export const imageerror = {
  // 指令对象 在当前dom元素插入节点后执行
  inserted(dom, options) {
    // dom 当前指令作用的dom对象
    // options是指令中的变量的解释 变量值在options的value属性中
    // 处理图片异常问题:如果图片地址加载失败 触发onerror事件
    dom.onerror = function() {
      // 将指令配置的默认图片设置为图片内容
      dom.src = options.value
    }
  }
}
