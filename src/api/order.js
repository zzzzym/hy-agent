import request from '@/utils/request'
export function query(data) {
  return request({
    url: '/proxy/serviceinsuranceorderinfo/list',
    method: 'post',
    params: {
      limit: data.limit,
      page: data.page,
      insuranceCompanyName: data.insuranceCompanyName,
      insuranceName: data.insuranceName
    },
  })
}
export function querybyid(id) {
  return request({
    url: '/proxy/serviceinsuranceorderinfo/info/' + id,
    method: 'get',

  })
}
