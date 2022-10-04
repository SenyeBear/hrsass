// 该文件负责管理所有自定义指令

export const imageerror = {
  // 指令对象 在当前dom元素插入节点后执行
  inserted(dom, options) {
    // dom 当前指令作用的dom对象
    // options是指令中的变量的解释 变量值在options的value属性中
    // 处理图片异常问题:如果图片地址加载失败 触发onerror事件

    dom.src = dom.src || options.value // 因为有的员工的头像的地址为空，给img赋值空的src不能触发错误事件 此处如果为空 则 dom.src为false指向后面
    dom.onerror = function() {
      // 将指令配置的默认图片设置为图片内容
      dom.src = options.value
    }
  },
  // inserted只执行一次 组件更新之后的钩子
  componentUpdated(dom, options) {
    dom.src = dom.src || options.value
  }
}
