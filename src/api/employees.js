import request from '@/utils/request'

/**
 * 获取员工简单数据
 */
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}

/**
 * 获取员工数据列表
 */
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    params
  })
}

/**
 * 删除员工
 */
export function deleteEmployee(id) {
  return request({
    method: 'DELETE',
    url: `/sys/user/${id}`
  })
}

/**
 * 新增员工
 */
export function addEmployee(data) {
  return request({
    method: 'POST',
    url: '/sys/user/',
    data
  })
}

/**
 * 批量导入员工 data要求是数组格式
 */
export function importEmployee(data) {
  return request({
    method: 'POST',
    url: '/sys/user/batch',
    data
  })
}

/** *
 *
 * 保存员工的基本信息
 * **/
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}

/** *
 *  读取用户详情的基础信息
 * **/
export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/** *
 *  更新用户详情的基础信息
 * **/
export function updatePersonal(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

/** **
 * 获取用户的岗位信息
 *
 * ****/
export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存岗位信息
 * ****/
export function updateJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}
