/* eslint-disable no-trailing-spaces */
import axios from 'axios'

import {
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken
} from '@/utils/auth'
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
// create an axios instance
const service = axios.create({
  
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: process.env.VUE_APP_SYS_URL,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['Authorization'] = 'Bearer ' + getToken()
      config.headers['Content-Type'] = 'application/json-patch+json;charset=UTF-8'
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // console.log(r.esponse)

    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (!res.succeed) {
      // if (0) {

      // Message({
      //   message: res.message || 'Error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      if (res.code === 401) {
        // to re-login

        // console.log(response)
        
        // store.dispatch('user/resetToken').then(() => {
        //   location.reload()
        // })
      }
      return res
      // return Promise.reject(new Error(res.message || 'Error'))
    } else {
      console.log(store)

      return res
    }
  },
  error => {
    // console.log(error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    // const err = JSON.parse(JSON.stringify(error))
    // if (err.response.status === 401) {
    // store.dispatch('user/resetToken').then(() => {
    //   location.reload()
    // })
    // }

    return Promise.reject(error)
  }
)

export default service
