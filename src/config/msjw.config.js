let token
let msjwURL
let appid
let accountId
if (process.env.NODE_ENV === 'development') {
  // 测试
  token = 'f7ffc8ad-03a0-4ec0-9e5d-9da3500e4fbe'
  msjwURL = `https://msjwt.szga.gov.cn`
  appid = 'wx43154456b4c489e3'
  accountId = 7
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
  } else {
    token = 'cf86c6c7-fbbf-44b6-ad05-99497b8dcfc9'
    msjwURL = 'https://msjw.szga.gov.cn'
    appid = 'wx08caec7ef81aab5f'
    accountId = 3
  }
}

export {
  token,
  msjwURL,
  appid,
  accountId
}
