import request from '@/utils/request-oss'

export function OSS(query) {
  return request({
    url: '/api/Oss/fullOssPermission',
    method: 'post',
    data: query
  })
}
export function changePassword(query) {
  return request({
    url: '/api/Account/changePassword',
    method: 'post',
    data: query
  })
}

