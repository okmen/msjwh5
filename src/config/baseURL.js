let commonUrl
if (process.env.NODE_ENV === 'development') {
  commonUrl = 'http://192.168.1.120:8100/' // 开发环境
} else {
  if (process.env.type === 'test') {
    commonUrl = 'http://testjava.chudaokeji.com/' // 测试环境
  } else {
    commonUrl = 'http://gzh.stc.gov.cn/api/' // 正式环境
  }
}

export const getUserM = `${commonUrl}convenience/getMSJWinfo.html`
