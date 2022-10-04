import request from '@/utils/request'

/**
 * 登录接口
 */
export function login(data) {
  return request({
    method: 'POST',
    url: '/sys/login',
    data
  })
}

/**
 * 获取用户基本资料
 */
export function getUserInfo() {
  return request({
    method: 'POST',
    url: '/sys/profile'
  })
}

/**
 * 根据id获取用户的基本信息
 *
 */
export function getUserDetailById(id) {
  return request({
    // method: 'GET', // axios默认请求为get
    url: `/sys/user/${id}`
  })
}

export function logout() {

}
