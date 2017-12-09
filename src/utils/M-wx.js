import { getQueryString } from './utils'
import axios from './axios'
if (getQueryString('source') === 'M' || getQueryString('code')) {
  // 民生警务接口地址
  const WXSITEURL = 'https://msjwt.szga.gov.cn/wxsite'
  // 民生警务 appid
  const appid = 'wx43154456b4c489e3'
  const URL = window.location.href
  let accountId = 7
  // 如果没有 code 且没有 openid 跳转到民生警务获取 code
  if (!getQueryString('code') && !window.localStorage.getItem('openid')) {
    window.localStorage.setItem('entranceURL', URL)
    window.location.href = `${WXSITEURL}/weixin/cms/getWeixinCode?appid=${appid}&redirect_uri=${encodeURIComponent(URL)}`
  }
  // 如果有code，重定向URL
  if (getQueryString('code')) {
    axios.get(`https://msjwt.szga.gov.cn/bmswx/mobile/common/openid?account=${accountId}&code=${getQueryString('code')}`).then(data => {
      console.log(data)
      if (data.code === '200') {
        window.localStorage.setItem('openid', data.openid)
      } else {
        window.alert('获取openid失败，请关闭重新进入重试')
      }
      window.location.href = window.localStorage.getItem('entranceURL')
    })
  }
}
