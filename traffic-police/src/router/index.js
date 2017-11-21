/**
 * Created by Deboy on 2017/1/6.
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

import greenTravel from 'src/router/greenTravel.js' // 绿色出行
import dealServiceRouter from 'src/router/dealService.js' // 办理类服务
import homeRouter from 'src/router/home.js' // 个人中心、登录、星级用户认证
import queryLawlessRouter from 'src/router/queryLawless.js' // 违法处理类
import peopleWillCloudRouter from 'src/router/peopleWillCloud.js' // 民意云
import precontractTypeRouter from 'src/router/precontractType.js' // 预约类
import takePicturesTipsRouter from 'src/router/takePicturesTips.js' // 随手拍举报
import creditRouter from 'src/router/credit.js' // 信息单据证明
import wschoolRouter from 'src/router/wschool.js' // 微课堂
import newQueryLawlessRouter from 'src/router/newQueryLawless.js' // 违法处理类优化版
import dieselEngineTrucks from 'src/router/dieselEngineTrucks.js'
import goodOwners from './goodOwners.js'

Vue.use(VueRouter)
const routes = [
  // {
  //   name: 'illegalParking',
  //   path: '/illegalParking',
  //   meta: {
  //     title: '违停免罚'
  //   },
  //   component: require('../views/illegalParking/index.vue')
  // },
  {
    name: 'illegalParking',
    path: '/illegalParking',
    meta: {
      title: '十分钟违停免罚'
    },
    component: require('../views/illegalParking/illegalParking.vue')
  },
  {
    name: 'queryIllegalParking',
    path: '/queryIllegalParking',
    meta: {
      title: '查询违停免罚'
    },
    component: require('../views/illegalParking/list.vue')
  },
  {
    name: 'illegalParking_takePhoto',
    path: '/illegalParking_takePhoto',
    meta: {
      title: '十分钟违停免罚'
    },
    component: require('../views/illegalParking/takePhoto.vue')
  },
  {
    name: 'Home',
    path: '/',
    meta: {
      title: '深圳交警'
    },
    component: require('../App.vue')
  },
  {
    name: 'authorityIssue',
    path: '/authorityIssue',
    meta: {
      title: '深圳交警权威发布'
    },
    component: require('../views/authorityIssue/authorityIssue.vue')
  },
  {
    name: 'eastSubscribe',
    path: '/eastSubscribe',
    meta: {
      title: '东部预约'
    },
    component: require('../views/eastSubscribe/eastSubscribe.vue')
  },
  {
    name: 'handyService',
    path: '/handyService',
    meta: {
      title: '便民服务'
    },
    component: require('../views/handyService/handyService.vue')
  },
  {
    name: 'moveCar',
    path: '/moveCar',
    meta: {
      title: '一键挪车'
    },
    component: require('../views/handyService/child/moveCar.vue')
  },
  {
    name: 'moveCar_WeChat',                                                    // 微信版本
    path: '/moveCar_WeChat',
    meta: {
      title: '一键挪车'
    },
    component: require('../views/handyService/child/moveCar.vue')
  },
  {
    name: 'bindCar',
    path: '/bindCar',
    meta: {
      title: '已绑车辆'
    },
    component: require('../views/handyService/child/bindCar.vue')
  },
  {
    name: 'appointSuccess',
    path: '/appointSuccess',
    meta: {
      title: '预约申办成功'
    },
    component: require('../components/appointSuccess.vue')
  },
  //  预约申办成功-微信版
  {
    name: 'appointSuccess_WeChat',
    path: '/appointSuccess_WeChat',
    meta: {
      title: '预约申办成功'
    },
    component: require('../components/appointSuccess_WeChat.vue')
  },
  {
    name: 'userAgreement',
    path: '/userAgreement/:id',
    meta: {
      title: '用户须知'
    },
    component: require('../components/userAgreement.vue')
  },
  // 车管规费缴纳
  {
    name: 'feePayment',
    path: '/feePayment',
    meta: {
      title: '车管规费缴纳'
    },
    component: require('../views/feePayment/feePayment.vue')
  },
  {                                                                                          // 预约类
    name: 'userAgreement_precontract',
    path: '/userAgreement_precontract',
    meta: {
      title: '用户须知'
    },
    component: require('../components/userAgreement_precontract.vue')
  },
  {                                                                                          // 预约类
    name: 'userAgreement_precontract_WeChat',
    path: '/userAgreement_precontract_WeChat',
    meta: {
      title: '用户须知'
    },
    component: require('../components/userAgreement_precontract.vue')
  },
  {                                                                                          // 微信版本
    name: 'userAgreement_WeChat',
    path: '/userAgreement_WeChat/:id',
    meta: {
      title: '用户须知'
    },
    component: require('../components/userAgreement_WeChat.vue')
  },
  {                                                                                          // 微信版本
    name: 'emporaryAppointment',
    path: '/emporaryAppointment',
    meta: {
      title: '临时通行预约'
    },
    component: require('../views/emporaryAppointment'),
    redirect: '/emporaryAppointment/makeAppointment',
    children: [
      {
        path: 'makeAppointment',
        component: require('../views/emporaryAppointment/component/makeAppointment.vue'),
        meta: {
          title: '临时通行预约'
        }
      },
      {
        path: 'queryAppointment',
        component: require('../views/emporaryAppointment/component/queryAppointment.vue'),
        meta: {
          title: '临时通行预约'
        }
      }
    ]
  },
  {
    name: 'electrocarFile',
    path: '/electrocarFile',
    meta: {
      title: '电动车档案'
    },
    component: require('../views/electrocarFile')
  },
  {
    name: 'electrocarFileScancode',
    path: '/electrocarFile/scancode',
    meta: {
      title: '电动车档案-扫一扫'
    },
    component: require('../views/electrocarFile/scanCode.vue')
  },
  {
    name: 'roadMsgList',
    path: '/roadMsgList',
    meta: {
      title: '路况查询'
    },
    component: require('../views/roadMsg/roadMsgList.vue')
  },
  {
    name: 'roadMsgDetails',
    path: '/roadMsgDetails',
    meta: {
      title: '路况查询'
    },
    component: require('../views/roadMsg/roadMsgDetails.vue')
  },
  {
    name: 'systemUpdate',
    path: '/systemUpdate',
    meta: {
      title: '系统升级中'
    },
    component: require('../components/systemUpdate.vue')
  },
  {                                                                               // 系统升级中 无弹窗
    name: 'systemUpdateNoAlert',
    path: '/systemUpdateNoAlert',
    meta: {
      title: '系统升级中'
    },
    component: require('../components/systemUpdateNoAlert.vue')
  },
  {
    name: 'CGPageOne',
    path: '/CGPageOne',
    meta: {
      title: '交通举报'
    },
    component: require('../views/takePictures_CG/CGPageOne.vue')
  },
  {
    name: 'CGPageTwo',
    path: '/CGPageTwo',
    meta: {
      title: '交通举报查询'
    },
    component: require('../views/takePictures_CG/CGPageTwo.vue')
  },
  {
    name: 'affirmInfo',
    path: '/affirmInfo',
    meta: {
      title: '信息确认'
    },
    component: require('../components/affirmInfo.vue')
  },
  {
    name: 'affirmInfo_WeChat',                                                 // 微信版本
    path: '/affirmInfo_WeChat',
    meta: {
      title: '信息确认'
    },
    component: require('../components/affirmInfo.vue')
  },
  {
    name: 'submitSuccess',
    path: '/submitSuccess',
    meta: {
      title: '提交成功'
    },
    component: require('../components/submitSuccess.vue')
  },
  {
    name: 'submitSuccess_WeChat',                                              // 微信版本
    path: '/submitSuccess_WeChat',
    meta: {
      title: '提交成功'
    },
    component: require('../components/submitSuccess.vue')
  },
  {
    name: 'freeAbstract',
    path: '/freeAbstract',
    meta: {
      title: '首违免罚介绍'
    },
    component: require('../views/dealService/child/car/freeForFirst/freeAbstract.vue')
  },
  {
    name: 'freeAbstract_WeChat',                                               // 微信版本
    path: '/freeAbstract_WeChat',
    meta: {
      title: '首违免罚介绍'
    },
    component: require('../views/dealService/child/car/freeForFirst/freeAbstract.vue')
  },
  {
    name: 'digitalReceipt',
    path: '/digitalReceipt',
    meta: {
      title: '电子回单'
    },
    component: require('../views/credit/child/digitalReceipt.vue')
  },
  /* {
    name: 'selfForm',
    path: '/selfForm',
    meta: {
      name: '其它业务'
    },
    component: require('../components/formTemplate/index.vue')
  }, */
  /* {
    name: 'faceSwiping',
    path: '/faceSwiping',
    meta: {
      name: '星级用户认证'
    },
    component: require('../views/starUser/faceSwiping')
  }, */
  {
    name: 'getFaceInfo',
    path: '/getFaceInfo',
    meta: {
      name: '星级用户认证'
    },
    component: require('../views/starUser/child/getFaceInfo')
  },
  {
    name: 'registerChoose',
    path: '/registerChoose',
    meta: {
      name: '注册选择'
    },
    component: require('../views/starUser/registerChoose')
  },
  {
    name: 'testCardBag',
    path: '/testCardBag',
    meta: {
      name: '测试卡包'
    },
    component: require('../views/testCardBag')
  },
  // 星级用户验证问题反馈
  {
    name: 'issueFeedback',
    path: '/issueFeedback',
    meta: {
      name: '星级用户验证问题反馈'
    },
    component: require('../views/issueFeedback/issueFeedback')
  },
  {
    name: 'paymentSucceed',
    path: '/paymentSucceed',
    meta: {
      name: '缴费成功'
    },
    component: require('../components/paymentSucceed.vue')
  },
  {
    name: 'twiceFaceSwiping',
    path: '/twiceFaceSwiping',
    meta: {
      name: '二次刷脸认证'
    },
    component: require('../views/twiceFaceSwiping')
  },
  // 个人中心、登录、星级用户认证
  ...homeRouter,

  // 绿色出行 - 开始
  ...greenTravel,

  // 民意云
  ...peopleWillCloudRouter,

  // 违法处理类服务
  ...queryLawlessRouter,

  // 办理类服务
  ...dealServiceRouter,

  // 预约类服务
  ...precontractTypeRouter,

  // 随手拍举报
  ...takePicturesTipsRouter,

  // 信息单据证明
  ...creditRouter,

  // 微课堂
  ...wschoolRouter,

  // 违法处理类 新版
  ...newQueryLawlessRouter,
  // 柴油轻型自卸货车
  ...dieselEngineTrucks,
  // 平安好车主
  ...goodOwners
]
/* eslint-disable no-new */
const router = new VueRouter({
  routes
})

export default router
