import request from '@/utils/request'

/**
 *  获取角色列表
 */
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params
  })
}

/**
 *  获取公司信息
 */
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}

/**
 *  获取角色详情
 */
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}

/**
 *  编辑角色
 */
export function updateRole(data) {
  return request({
    method: 'PUT',
    url: `/sys/role/${data.id}`,
    data
  })
}

/**
 *  新增角色
 */
export function addRole(data) {
  return request({
    method: 'POST',
    url: `/sys/role`,
    data
  })
}

/**
 *  新增角色
 */
export function deleteRole(id) {
  return request({
    method: 'DELETE',
    url: `/sys/role/${id}`
  })
}
