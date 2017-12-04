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

export const getUserM = `${commonUrl}convenience/getMSJWinfo.html` // 民生警务获取用户信息

export const userAgreement = `${commonUrl}user/getDocumentationORMByNoticeKey.html` // 用户须知接口

export const login = `${commonUrl}user/login.html` // 登录接口

export const cardRepair = `${commonUrl}handleservice/repairDriverLicense.html` // 驾驶证补证

export const cardReplace = `${commonUrl}handleservice/replaceDriverLicense.html` // 驾驶证换证
