const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // token的快捷访问
  name: state => state.user.userInfo.username, // 建立对用户名的快捷访问
  userId: state => state.user.userInfo.userId, // 建立对用户id的快捷访问
  staffPhoto: state => state.user.userInfo.staffPhoto, // 建立对用户头像的快捷访问
  companyId: state => state.user.userInfo.companyId // 这也是为什么usefInfo初始值不能为null否则null..companyId报错
}
export default getters
