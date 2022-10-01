import request from '@/utils/request'

/**
 * 获取组织架构的数据
 */
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

/**
 * 根据id删除组织架构的部门
 */
export function delDepartments(id) {
  return request({
    method: 'DELETE',
    url: `/company/department/${id}`
  })
}

/**
 * 新增部门
 */
export function addDepartments(data) {
  return request({
    method: 'POST',
    url: '/company/department',
    data
  })
}

/**
 * 根据id获取部门详情
 */
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

/**
 * 根据id修改部门详情
 */
export function updateDepartDetail(data) {
  return request({
    method: 'PUT',
    url: `/company/department/${data.id}`,
    data
  })
}
