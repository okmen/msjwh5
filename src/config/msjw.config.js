let token
let msjwURL
let appid
let accountId
// 实名认证个人中心地址
let authURL
if (process.env.NODE_ENV === 'development') {
  // 测试
  token = 'f7ffc8ad-03a0-4ec0-9e5d-9da3500e4fbe'
  msjwURL = `https://msjwt.szga.gov.cn`
  appid = 'wx43154456b4c489e3'
  accountId = 7
  authURL = 'https://msjwt.szga.gov.cn/wxsite/weixin/cms/web?template=msjw&path=/userManage'
  // 正式
  // token = 'cf86c6c7-fbbf-44b6-ad05-99497b8dcfc9'
  // msjwURL = `https://msjw.szga.gov.cn`
  // appid = 'wx08caec7ef81aab5f'
} else {
  if (process.env.type === 'test') {
    token = 'f7ffc8ad-03a0-4ec0-9e5d-9da3500e4fbe'
    msjwURL = 'https://msjwt.szga.gov.cn'
    appid = 'wx43154456b4c489e3'
    accountId = 7
    authURL = 'https://msjwt.szga.gov.cn/wxsite/weixin/cms/web?template=msjw&path=/userManage'
  } else {
    token = 'cf86c6c7-fbbf-44b6-ad05-99497b8dcfc9'
    msjwURL = 'https://msjw.szga.gov.cn'
    appid = 'wx08caec7ef81aab5f'
    accountId = 3
    authURL = 'https://msjw.szga.gov.cn/wxsite/weixin/cms/web?template=msjw&path=/userCenter'
  }
}

export {
  token,
  msjwURL,
  appid,
  accountId,
  authURL
}
