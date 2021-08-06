import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/proxy/proxyAuth/auth',
    method: 'post',
    data

  })
}