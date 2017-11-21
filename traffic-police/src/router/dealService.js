let dealServiceRouter = [
  {
    name: 'dealService_WeChat',                                                              // 微信版本
    path: '/dealService_WeChat',
    meta: {
      title: '办理类业务'
    },
    component: require('../views/dealService_WeChat/dealService.vue')
  },
  {
    name: 'confirmLawless_WeChat',                                                           // 微信版本
    path: '/confirmLawless_WeChat',
    meta: {
      title: '违法在线确认'
    },
    component: require('../views/dealService_WeChat/child/confirmLawless_WeChat.vue')
  },
  {
    name: 'newLawlessMsg_WeChat',                                                            // 微信版本
    path: '/newLawlessMsg_WeChat',
    meta: {
      title: '违法查询结果'
    },
    component: require('../views/dealService_WeChat/child/newLawlessMsg_WeChat.vue')
  },
  {
    name: 'newEarly_WeChat',                                                                 // 微信版本
    path: '/newEarly_WeChat/:id?',
    meta: {
      title: '交通违法预约'
    },
    component: require('../views/dealService_WeChat/child/newEarly_WeChat.vue')
  },
  {
    name: 'newPayLawless_WeChat',                                                            // 微信版本
    path: '/newPayLawless_WeChat',
    meta: {
      title: '交通违法缴款'
    },
    component: require('../views/dealService_WeChat/child/newPayLawless_WeChat.vue')
  },
  {
    name: 'newTimeSelect_WeChat',
    path: '/newTimeSelect_WeChat',
    meta: {
      title: '交通违法预约'
    },
    component: require('../views/dealService_WeChat/child/newTimeSelect_WeChat.vue')
  },
  {
    name: 'dealService',
    path: '/dealService',
    meta: {
      title: '办理类业务'
    },
    component: require('../views/dealService/dealService.vue')
  },
  {
    name: 'IDQuery',
    path: '/IDQuery',
    meta: {
      title: '办理类业务'
    },
    component: require('../views/dealService/child/queryProgress/IDQuery.vue')
  },
  {
    name: 'queryProgress',
    path: '/queryProgress',
    meta: {
      title: '办理进度查询'
    },
    component: require('../views/dealService/child/queryProgress/queryProgress.vue')
  },
  {
    name: 'queryProgress_WeChat',                                              // 微信版本
    path: '/queryProgress_WeChat',
    meta: {
      title: '办理进度查询'
    },
    component: require('../views/dealService/child/queryProgress/queryProgress.vue')
  },
  {
    name: 'applyClass',
    path: '/applyClass/:id',
    meta: {
      title: '申请类'
    },
    component: require('../views/dealService/child/car/applyClass/applyClass.vue')
  },
  {
    name: 'applyClass_WeChat',                                                           // 微信版本
    path: '/applyClass_WeChat/:id',
    meta: {
      title: '申请类'
    },
    component: require('../views/dealService/child/car/applyClass/applyClass.vue')
  },
  {
    name: 'changeCard',
    path: '/changeCard/id/:id',
    meta: {
      title: '补换证类'
    },
    component: require('../views/dealService/child/card/changeCard/changeCard.vue')
  },
  {
    name: 'changeCard_WeChat',                                                         // 微信版本
    path: '/changeCard_WeChat/id/:id',
    meta: {
      title: '补换证类'
    },
    component: require('../views/dealService/child/card/changeCard/changeCard.vue')
  },
  {
    name: 'freeForFirst',
    path: '/freeForFirst',
    meta: {
      title: '首违免罚查询'
    },
    component: require('../views/dealService/child/car/freeForFirst/freeForFirst.vue')
  },
  {
    name: 'freeForFirst_WeChat',                                                    // 微信版本
    path: '/freeForFirst_WeChat',
    meta: {
      title: '首违免罚查询'
    },
    component: require('../views/dealService/child/car/freeForFirst/freeForFirst.vue')
  },
  {
    name: 'annualExaminations',
    path: '/annualExaminations',
    meta: {
      title: '驾驶证年审'
    },
    component: require('../views/dealService/child/card/annualExaminations/annualExaminations.vue')
  },
  {
    name: 'annualExaminations_WeChat',                                              // 微信版本
    path: '/annualExaminations_WeChat',
    meta: {
      title: '驾驶证年审'
    },
    component: require('../views/dealService/child/card/annualExaminations/annualExaminations.vue')
  },
  {
    name: 'intoCard',
    path: '/intoCard',
    meta: {
      title: '驾驶证转入'
    },
    component: require('../views/dealService/child/card/intoCard/intoCard.vue')
  },
  {
    name: 'intoCard_WeChat',                                                        // 微信版本
    path: '/intoCard_WeChat',
    meta: {
      title: '驾驶证转入'
    },
    component: require('../views/dealService/child/card/intoCard/intoCard.vue')
  },
  {
    name: 'degradeCard',
    path: '/degradeCard',
    meta: {
      title: '驾驶证自愿降级'
    },
    component: require('../views/dealService/child/card/degradeCard/degradeCard.vue')
  },
  {
    name: 'degradeCard_WeChat',                                                     // 微信版本
    path: '/degradeCard_WeChat',
    meta: {
      title: '驾驶证自愿降级'
    },
    component: require('../views/dealService/child/card/degradeCard/degradeCard.vue')
  },
  {
    name: 'changeConnect',
    path: '/changeConnect',
    meta: {
      title: '驾驶人联系方式变更'
    },
    component: require('../views/dealService/child/card/changeConnect/changeConnect.vue')
  },
  {
    name: 'changeConnect_WeChat',                                                   // 微信版本
    path: '/changeConnect_WeChat',
    meta: {
      title: '驾驶人联系方式变更'
    },
    component: require('../views/dealService/child/card/changeConnect/changeConnect.vue')
  },
  {
    name: 'replaceCredentials',
    path: '/replaceCredentials',
    component: require('../views/dealService/child/car/replaceCredentials/index.vue'),
    redirect: '/replaceCredentials/repairDrivingLicense',
    children: [
      {
        name: 'repairDrivingLicense',
        path: 'repairDrivingLicense',
        meta: {
          title: '补领行驶证'
        },
        component: require('../views/dealService/child/car/replaceCredentials/repairDrivingLicense.vue')
      },
      {
        name: 'exchangeDrivingLicense',
        path: 'exchangeDrivingLicense',
        meta: {
          title: '换领行驶证'
        },
        component: require('../views/dealService/child/car/replaceCredentials/exchangeDrivingLicense.vue')
      },
      {
        name: 'replaceQualifiedMark',
        path: 'replaceQualifiedMark',
        meta: {
          title: '补换检验合格标志'
        },
        component: require('../views/dealService/child/car/replaceCredentials/replaceQualifiedMark.vue')
      },
      {
        name: 'replaceLicencePlate',
        path: 'replaceLicencePlate',
        meta: {
          title: '补领机动车号牌'
        },
        component: require('../views/dealService/child/car/replaceCredentials/replaceLicencePlate.vue')
      }
    ]
  },
  {
    name: 'replaceCredentials_WeChat',                                                // 微信版本
    path: '/replaceCredentials_WeChat',
    component: require('../views/dealService/child/car/replaceCredentials/index.vue'),
    redirect: '/replaceCredentials_WeChat/repairDrivingLicense',
    children: [
      {
        name: 'repairDrivingLicense',
        path: 'repairDrivingLicense',
        meta: {
          title: '补领行驶证'
        },
        component: require('../views/dealService/child/car/replaceCredentials/repairDrivingLicense.vue')
      },
      {
        name: 'exchangeDrivingLicense',
        path: 'exchangeDrivingLicense',
        meta: {
          title: '换领行驶证'
        },
        component: require('../views/dealService/child/car/replaceCredentials/exchangeDrivingLicense.vue')
      },
      {
        name: 'replaceQualifiedMark',
        path: 'replaceQualifiedMark',
        meta: {
          title: '补换检验合格标志'
        },
        component: require('../views/dealService/child/car/replaceCredentials/replaceQualifiedMark.vue')
      },
      {
        name: 'replaceLicencePlate',
        path: 'replaceLicencePlate',
        meta: {
          title: '补领机动车号牌'
        },
        component: require('../views/dealService/child/car/replaceCredentials/replaceLicencePlate.vue')
      }
    ]
  },
  {
    name: 'esemptionCar',
    path: '/esemptionCar',
    meta: {
      title: '六年免检申请'
    },
    component: require('../views/dealService/child/car/exemption/esemptionCar.vue')
  },
  {
    name: 'esemptionCar_WeChat',                                               // 微信版本
    path: '/esemptionCar_WeChat',
    meta: {
      title: '六年免检申请'
    },
    component: require('../views/dealService/child/car/exemption/esemptionCar.vue')
  },
  {
    name: 'exemption',
    path: '/exemption',
    meta: {
      title: '六年免检申请'
    },
    component: require('../views/dealService/child/car/exemption/exemption.vue')
  },
  {
    name: 'exemptionDemand',
    path: '/exemptionDemand',
    meta: {
      title: '六年免检查询取消'
    },
    component: require('../views/dealService/child/car/exemption/exemptionDemand.vue')
  },
  {
    name: 'exemptionAbolish',
    path: '/exemptionAbolish',
    meta: {
      title: '六年免检查询取消'
    },
    component: require('../views/dealService/child/car/exemption/exemptionAbolish.vue')
  },
  {
    name: 'exemptionAbolish_WeChat',                                           // 微信版本
    path: '/exemptionAbolish_WeChat',
    meta: {
      title: '六年免检查询取消'
    },
    component: require('../views/dealService/child/car/exemption/exemptionAbolish.vue')
  },
  {
    name: 'placeExamine',
    path: '/placeExamine',
    meta: {
      title: '机动车委托异地定期检验申报'
    },
    component: require('../views/dealService/child/car/placeExamine/placeExamine.vue')
  },
  {
    name: 'placeExamine_WeChat',                                               // 微信版本
    path: '/placeExamine_WeChat',
    meta: {
      title: '机动车委托异地定期检验申报'
    },
    component: require('../views/dealService/child/car/placeExamine/placeExamine.vue')
  },
  {
    name: 'placeExamineCar',
    path: '/placeExamineCar',
    meta: {
      title: '机动车委托异地定期检验申报'
    },
    component: require('../views/dealService/child/car/placeExamine/placeExamineCar.vue')
  },
  {
    name: 'placeExamineDemand',
    path: '/placeExamineDemand',
    meta: {
      title: '机动车委托异地定期检验申报查询'
    },
    component: require('../views/dealService/child/car/placeExamine/placeExamineDemand.vue')
  },
  {
    name: 'motorAlteration',
    path: '/motorAlteration',
    meta: {
      title: '机动车联系方式变更'
    },
    component: require('../views/dealService/child/car/motorAlteration.vue')
  },
  {
    name: 'motorAlteration_WeChat',                                            // 微信版本
    path: '/motorAlteration_WeChat',
    meta: {
      title: '机动车联系方式变更'
    },
    component: require('../views/dealService/child/car/motorAlteration.vue')
  }
]

export default dealServiceRouter
