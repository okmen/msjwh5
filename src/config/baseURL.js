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
// commonUrl = 'http://testjava.chudaokeji.com/' // 测试环境
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

export const verificatioCode = `${commonUrl}user/verificatioCode.html` // 验证码校验接口

export const inspectionDeclaration = `${commonUrl}handleservice/inspectionDeclaration.html` // 机动车委托异地定期检验申报

export const inspectionDeclarationQuery = `${commonUrl}handleservice/inspectionDeclarationQuery.html` // 机动车委托异地定期检验申报查询

export const getBusinessTypes = `${commonUrl}bookingbusiness/getBusinessTypes.html` // 获取菜单

export const createVehicleInspection = `${commonUrl}handleservice/createVehicleInspection.html` // 六年免检

export const cancelVehicleInspection = `${commonUrl}handleservice/cancelVehicleInspection.html` // 六年免检取消

export const getCarTypeId = `${commonUrl}handleservice/getCarTypeId.html` // 获取车辆类型Id

export const updateUser = `${commonUrl}user/updateUser.html` // 修改个人资料接口

export const addVehicle = `${commonUrl}user/addVehicle.html` // 添加车辆接口

export const bindCar = `${commonUrl}user/search/getBndTheVehicles.html` // 个人中心-绑定车辆接口

export const unbindTheOtherDriverUseMyCar = `${commonUrl}user/unbindTheOtherDriverUseMyCar.html` // 车主解绑其他车辆使用人

export const unbindVehicle = `${commonUrl}user/unbindVehicle.html` // 车主解绑车辆

export const degradeCard = `${commonUrl}handleservice/driverLicenseVoluntaryDemotion.html` // 驾驶证自愿降级

export const changeConnect = `${commonUrl}handleservice/driverChangeContact.html` // 驾驶人联系方式变更

export const complementTheMotorVehicleDrivingLicense = `${commonUrl}handleservice/complementTheMotorVehicleDrivingLicense.html` // 补领行驶证

export const intoCard = `${commonUrl}handleservice/driverLicenseInto.html` // 驾驶证转入

export const getFileNumber = `${commonUrl}user/search/getMyDriverLicense.html` // 查询档案号

export const iocomotiveCarReplace = `${commonUrl}handleservice/iocomotiveCarReplace.html`  // 换领行驶证

export const changeDelay = `${commonUrl}handleservice/renewalDriverLicense.html` // 驾驶证延期换证
