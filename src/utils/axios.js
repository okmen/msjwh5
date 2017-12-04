import Vue from 'vue'
import axios from 'axios'
import { Indicator, Toast } from 'mint-ui'
import qs from 'qs'

// request 拦截
axios.interceptors.request.use(
  config => {
    Indicator.open()
    config.data = config.data || {}
    config.data.version = '0.0.0'
    config.data.sourceOfCertification = window.VM.$store.state.core.source
    config.data.openId = window.VM.$store.state.core.openId
    config.data = qs.stringify(config.data)
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// response 拦截
axios.interceptors.response.use(
  response => {
    Indicator.close()
    // 成功则直接返回数据
    if (response.data.code !== '0000') {
      Toast({
        message: response.data.msg,
        position: 'bottom',
        duration: 2000
      })
    }
    return response.data
  },
  error => {
    Indicator.close()
    console.log(error)
  }
)

Vue.prototype.$axios = axios

export default axios
