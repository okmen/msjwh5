import wx from 'weixin-js-sdk'
// 获取 URL 查询参数
export function getQueryString (name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  let href = window.location.href
  let r = href.substr(href.indexOf('?') + 1).match(reg)
  if (r != null) return decodeURI(r[2])
  return false
}

// 微信分享
export function wxShare (opt) {
  let source = opt.source
  if (source === 'M') {
    let nowURL = window.location.href
    if (nowURL.includes('?from=')) {
      window.location.href = nowURL.split('?from=')[0] + '#' + opt.fullPath
    }
    let link
    if (process.env.type === 'test') {
      link = 'http://szjjmsjw.chudaokeji.com/#' + opt.fullPath
    } else {
      link = 'http://gzh.stc.gov.cn/msjw/#' + opt.fullPath
    }
    wx.onMenuShareTimeline({
      title: opt.title,
      link: link
    })
    wx.onMenuShareAppMessage({
      title: opt.title,
      link: link
    })
  }
}

// 获取用户须知
export function getUserAgreement (name) {
  switch (name) {
    case 'szjj_hander_rmvp':
      return {
        title: '办理补领、换领机动车号牌须知',
        text: `
          一、车主为个人的，只接受车主本人申请，采用实名制；<br>
          二、所需资料和办理条件：1、上传身份证原件正反面照片，登记证书原件照片；2、仅限深圳本地号牌，外地号牌不能办理；<br>
          三、每辆机动车只可在线申请办理一次补领机动车号牌业务；确需多次申请的，请前往深圳交警车管所窗口办理；<br>
          四、办理流程为；车主网上申请，车管所后台审核，车主须前往车管所领取临时号牌，缴费，机动车号牌将15个工作日内通过邮政速递方式将号牌送到您上手；<br>
          五、申请提交后，车管部门会对所提供的资料进行核实，请保持联系畅通；<br>
          六、领取临时号牌必须车主本人持身份证原件到南山区龙井路128号新车管所二楼机动车业务导办台领取（如果代办还需代办人身份证原件及复印件）；<br>
          七、全程服务费用：140元/单（其中：机动车临时号牌工本费5元、机动车号牌工本费100元，邮政速递服务费35元）；邮寄地址仅限深圳市；<br>
          谎报案情，非法补领车辆号牌、证件、登记证书的，影响行政机关依法办案，依照《治安管理处罚法》第六十条第（二）项规定，处5日以上10日以下拘留，并处500元以上1000以下罚款；以欺骗、贿赂等不当手段办理补、换领机动车号牌，依据《机动车登记规定》（公安部124号令）第五十八条第二款的规定，处200元罚款.<br>
        `
      }
    case 'szjj_hander_rim':
      return '机动车委托异地定期检验申报'
    case 'szjj_hander_id':
      return {
        title: '委托核发机动车检验合格标志办理须知',
        text: `
          1、除大型载客汽车、校车以外的机动车因故不能在深圳本地检验的，车主可以通过本系统网上申请委托异地核发检验合格标志。申请前，车主应当将涉及机动车的道路交通安全违法行为和交通事故处理完毕，请务必连接广东省公安厅交通管理局网站（网址：http://jj.gdga.gov.cn/）查询申办的车辆是否存在道路交通安全违法未处理情况，以免申请失败；<br>
          2、车主为个人的，只接受车主本人申请，采用实名制；<br>
          3、为确保申请人的网上申请合法、准确，杜绝虚假身份扰乱车管业务的正常办理，申请人须通过手机动态码的方式进行申报，虚假申报的，一经查实，依法严惩。车主为个人的，只允许接收本人1个手机号码（中国移动或者联通手机）申请；车主为企事业单位的，经办人的1个手机号码可申请本单位名下所有车辆；<br>
          4、邮寄收件地址仅限深圳市；<br>
          5、车主网上申请委托异地核发检验合格标志，可以通过本系统查询办理情况，工作日申请的，车管部门当天审核；非工作日申请的，顺延审核。审核通过的，次日通过邮政将《委托核发机动车检验合格标志通知书》快递给申请人（快递费为20元，由申请人收件时支付给邮政），审核未通过的，请查询不能通过的原因，并重新申请；<br>
        `
      }
    case 'jszns':
      return {
        title: '机动车驾驶证年度审验办理须知',
        text: `
          一、您所持有的驾驶证的准驾车型为大型客车、牵引车、城市公交车、中型客车、大型货车，且在一个记分周期内有记分记录的需进行驾驶人审验;<br>
          二、上传资料：身份证正反面照片；在线参加审验学习结业合格的截图或者加盖公章的《驾驶人审验教育记录表》;<br>
          三、业务办理时限：申请人提交申请后，业务部门1个工作日内完成审验;<br>
          说明：驾驶人上传的学习证明，须后台通过系统查询到相关培训合格记录即可办理；<br>
        `
      }
    case 'jszbz':
      return {
        title: '机动车驾驶证补办须知',
        text: `
          一、所需资料和办理条件：<br>
          1、上传身份证原件正反面照片; <br>
          2、广东省机动车驾驶证数字相片采集回执（办理业务日前6个月内有效）; <br>
          3、仅限深圳本地驾驶证，外地驾驶证不能办理；<br>
          二、驾驶证状态为暂扣、扣留或锁定的，不能办理补证业务；<br>
          三、您可自愿选择在线办理相关业务，并使用邮政速递服务，同意支付费用30/件（其中驾驶证工本费10元，出证速递服务费20元）；<br>
          四、对于您提供的相关信息，深圳公安将会在后台予以审核，请确保您所提交的信息真实有效，如因错误信息导致业务无法办理，需由您自己承担一切后果；<br>
          五、深圳公安通过后台审核，受理，证件制作完毕后，邮政部门次日将新的驾驶证速递给您，上门投递时收件人必须本人凭身份证签收；<br>
          六、如由于您个人原因导致邮政部门无法成功投递驾驶证邮件的，邮政部门将会把此类邮件退回给深圳交警车管所，由您自行到车管所领取；<br>
        `
      }
    case 'jszhz':
      return {
        title: '机动车驾驶证换证须知',
        text: `
          一、所需资料和办理条件：<br>
          1、上传身份证原件正反面照片；<br>
          2、广东省机动车驾驶证数字相片采集回执（办理业务日前6个月内有效）；<br>
          3、仅限深圳本地驾驶证，外地驾驶证不能办理；<br>
          4、驾驶证已到换证日期90天内，须先至深圳区级以上人民医院进行驾驶人专用体检。<br>
          二、以下条件不能办理期满换证业务：<br>
          1、驾驶证状态为；违法未处理，注销可恢复，暂扣，注销，逾期未审验，超分；<br>
          2、已到换证日期，尚未到医院体检的；<br>
          三、驾驶证状态为暂扣、扣留或锁定的，不能办理换证业务：<br>
          四、您可自愿选择在线办理相关业务，并使用邮政速递服务，同意支付费用30/件（其中驾驶证工本费10元，出证速递服务费20元）；<br>
          五、对于您提供的相关信息，深圳公安将会在后台予以审核，请确保您所提交的信息真实有效，如因错误信息导致业务无法办理，需由您自己承担一切后果；<br>
          六、深圳公安通过后台审核，受理，证件制作完毕后，邮政部门次日将新的驾驶证速递给您，上门投递时收件人必须本人凭身份证签收；<br>
          七、如由于您个人原因导致邮政部门无法成功投递驾驶证邮件的，邮政部门将会把此类邮件退回给深圳交警车管所，由您自行到车管所领取；<br>
        `
      }
    case 'jszyqhz':
      return {
        title: '驾驶证延期换证',
        text: `
        暂无
        `
      }
    case 'jszzr':
      return {
        title: '驾驶证转入',
        text: `
        暂无
        `
      }
    case 'jsrlxfsbg':
      return {
        title: '驾驶人联系方式变更',
        text: `
        暂无
        `
      }
    case 'jszzyjj':
      return {
        title: '驾驶证自愿降级',
        text: `
        暂无
        `
      }
    case 'jdcgrdyjydj':
      return {
        title: '机动车抵押/解除抵押登记业务须知',
        text: `
          一、该系统只受理抵押权人为自然人的抵押/解除抵押登记业务；<br>
          二、在线申请机动车抵押/解除抵押登记的，需注册登录，提交电子版申请资料，申请成功后由车管所在线审核，通过审核的，邮政人员上门收取资料并移交车管所受理（仅限深圳市内，邮寄费用15元/件）；<br>
          三、车管所自受理之日起一日内，审查提交的证明、凭证，在机动车登记证书上签注抵押登记的内容和时间，受理完毕，邮政统一派发证件（仅限深圳市内，邮寄费20元/件）；<br>
          四、申请成功后，申请人可以通过本系统查询办理情况，工作日申请的，车管部门当天审核；非工作日申请的， 顺延审核。审核通过的，次日通过邮政人员上门收取资料， 审核未通过的，请查询不能通过的原因，并重新申请；<br>
          五、为确保申请人的网上申请合法、准确，杜绝虚假身份扰乱车管业务的正常办理，申请人须提供真实的申请资料，虚假申报的， 一经查实，依法严惩；<br>
          六、请在邮政人员上门收件时，准备好抵押人、抵押权人双方身份证原件及复印件。届时，邮政人员将对双方证件进行读取，同时拍摄双方当事人手持证件的现场照片。<br>
        `
      }
    case 'szjj_hander_cvi':
      return {
        title: '核发机动车检验合格标志（6年免检）用户须知',
        text: `
          一、符合六年免检车辆方可办理（网址：http://cgs.stc.gov.cn/Article/ggxx/ywgg/162555779.html）.<br>
          二、申请前，车主应当将涉及机动车的道路交通安全违法行为和交通事故处理完毕，请务必连接广东省公安厅交通管理局网站（网址： http://jj.gdga.gov.cn/）查询申办的车辆是否存在道路交通安全违法未处理情况，以免申请失败；<br>
          三、申请前，车主确保机动车的交强险及车船税在有效期内，以免申请失败；<br>
          四、车主在线申请办理免检车核发检验标志，提交电子版申请资料，申请成功后由车管所在线审核，通过审核的，邮政人员上门收取资料并移交车管所受理（仅限深圳市内，邮寄费用15元/件；）。受理完毕，邮局统一派发证件（仅限深圳市内，邮寄费20元/件）；<br>
          五、车主在线申请办理免检车核发检验标志，可以通过本系统查询办理情况；<br>
        `
      }
    case 'szjj_hander_iccc':
      return {
        title: '机动车联系方式变更',
        text: `
          暂无
        `
      }
  }
}
