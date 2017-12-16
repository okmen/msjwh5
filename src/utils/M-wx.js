import { getQueryString } from './utils'
import { msjwURL, appid, accountId } from '@/config/msjw.config'
import axios from './axios'
if (getQueryString('source') === 'M' || getQueryString('code')) {
  const URL = window.location.href
  // 如果没有 code 且没有 openid 跳转到民生警务获取 code
  if (!getQueryString('code') && !window.localStorage.getItem('openid')) {
    window.localStorage.setItem('entranceURL', URL)
    window.location.href = `${msjwURL}/wxsite/weixin/cms/getWeixinCode?appid=${appid}&redirect_uri=${encodeURIComponent(URL)}`
  }
  // 如果有code，重定向URL
  if (getQueryString('code')) {
    axios.get(`${msjwURL}/bmswx/mobile/common/openid?account=${accountId}&code=${getQueryString('code')}`).then(data => {
      if (data.code === '200') {
        window.localStorage.setItem('openid', data.openid)
      } else {
        window.alert('获取openid失败，请关闭重新进入重试')
      }
      window.location.href = window.localStorage.getItem('entranceURL')
    })
  }
}
