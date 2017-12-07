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

export const getUserM = `${commonUrl}msjw/getMSJWinfo.html` // 民生警务获取用户信息

export const userAgreement = `${commonUrl}user/getDocumentationORMByNoticeKey.html` // 用户须知接口

export const applyCarTemporaryLicence = `${commonUrl}handleservice/applyCarTemporaryLicence.html` // 申请机动车临牌

export const replaceMotorVehicleLicensePlate = `${commonUrl}handleservice/replaceMotorVehicleLicensePlate.html`  // 补换机动车号牌

export const login = `${commonUrl}user/gdLogin.html` // 登录接口

export const cardRepair = `${commonUrl}handleservice/repairDriverLicense.html` // 驾驶证补证

export const cardReplace = `${commonUrl}handleservice/replaceDriverLicense.html` // 驾驶证换证

export const annualExaminations = `${commonUrl}handleservice/driverLicenseAnnualVerification.html` // 驾驶证年审

export const replaceInspectionMark = `${commonUrl}handleservice/replaceInspectionMark.html`  // 补换检验合格标志

export const getPageInit = `${commonUrl}bookingbusiness/getPageInit.html` // 进去页面初始化获取的数据

export const getAppointmentDate = `${commonUrl}bookingbusiness/getAppointmentDate.html` // 根据业务类型获取预约日期

export const getAppTimes = `${commonUrl}bookingbusiness/getAppTimes.html` // 根据预约时间获取配额信息

export const simpleSendMessage = `${commonUrl}bookingbusiness/simpleSendMessage.html`  // 验证码接口

export const createVehicleInfoJD37 = `${commonUrl}bookingbusiness/createVehicleInfo_JD37.html` // 抵押/解押登记现场办理

export const getIssuing = `${commonUrl}user/getIssuingLicenceAuthorityArray.html` // 发证地列表

export const sendSMS = `${commonUrl}user/sendSMSVerificatioCode.html` // 发送验证码接口

export const sendSMSVerificatioCode = `${commonUrl}activity/sendSMSVerificatioCode.html`  // 东部预约验证码

export const inspectionDeclaration = `${commonUrl}handleservice/inspectionDeclaration.html` // 机动车委托异地定期检验申报

export const inspectionDeclarationQuery = `${commonUrl}handleservice/inspectionDeclarationQuery.html` // 机动车委托异地定期检验申报查询
