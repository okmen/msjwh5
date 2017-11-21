
let precontractTypeRouter = [
  {
    name: 'precontractType',
    path: '/precontractType',
    meta: {
      title: '机动车业务'
    },
    component: require('../views/precontractType/precontract.vue')
  },
  {
    name: 'precontractType_WeChat',
    path: '/precontractType_WeChat/:id?',
    meta: {
      title: '机动车业务'
    },
    component: require('../views/precontractType/precontract.vue')
  },
  {
    name: 'registerClass',
    path: '/registerClass',
    meta: {
      title: '登记类'
    },
    component: require('../views/precontractType/car/registerClass'),
    redirect: '/registerClass/transferRegistration',
    children: [
      {
        name: 'transferRegistration',
        path: 'transferRegistration',
        meta: {
          title: '转移登记(市内过户)'
        },
        component: require('../views/precontractType/car/registerClass/page/transferRegistration.vue')
      },
      {
        name: 'intoRegister',
        path: 'intoRegister',
        meta: {
          title: '机动车转移登记(转入)'
        },
        component: require('../views/precontractType/car/registerClass/page/intoRegister.vue')
      },
      {
        name: 'enteringRegister',
        path: 'enteringRegister',
        meta: {
          title: '机动车注册登记'
        },
        component: require('../views/precontractType/car/registerClass/page/enteringRegister.vue')
      },
      {
        name: 'cancellationRegister',
        path: 'cancellationRegister',
        meta: {
          title: '机动车注销登记'
        },
        component: require('../views/precontractType/car/registerClass/page/cancellationRegister.vue')
      },
      {
        name: 'generalChangeRegister',
        path: 'generalChangeRegister',
        meta: {
          title: '机动车变更登记(普通变更)'
        },
        component: require('../views/precontractType/car/registerClass/page/generalChangeRegister.vue')
      },
      {
        name: 'fakeLicensedEvidence',
        path: 'fakeLicensedEvidence',
        meta: {
          title: '机动车变更登记(套牌车换证)'
        },
        component: require('../views/precontractType/car/registerClass/page/fakeLicensedEvidence.vue')
      },
      {
        name: 'manWifeChange',
        path: 'manWifeChange',
        meta: {
          title: '机动车变更登记(夫妻变更)'
        },
        component: require('../views/precontractType/car/registerClass/page/manWifeChange.vue')
      }
    ]
  },
  {
    name: 'taxiUseAlter',
    path: '/taxiUseAlter',
    meta: {
      title: '出租客运车辆使用性质变更'
    },
    component: require('../views/precontractType/car/alterClass/taxiUseAlter.vue')
  },
  {
    name: 'numberAlter',
    path: '/numberAlter',
    meta: {
      title: '机动车打刻原车发动机号码变更备案'
    },
    component: require('../views/precontractType/car/alterClass/numberAlter.vue')
  },
  {
    name: 'markAlter',
    path: '/markAlter',
    meta: {
      title: '机动车打刻原车辆识别代号变更备案'
    },
    component: require('../views/precontractType/car/alterClass/markAlter.vue')
  },
  {
    name: 'fileAlter',
    path: '/fileAlter',
    meta: {
      title: '档案更正'
    },
    component: require('../views/precontractType/car/alterClass/fileAlter.vue')
  },
  {
    name: 'onlineCarAlter',
    path: '/onlineCarAlter',
    meta: {
      title: '网约车使用性质变更'
    },
    component: require('../views/precontractType/car/alterClass/onlineCarAlter.vue')
  },
  {
    name: 'renewingCollarCredential',
    path: '/renewingCollarCredential',
    meta: {
      title: '换领机动车登记证书'
    },
    component: require('../views/precontractType/car/replacementType/renewingCollarCredential.vue')
  },
  {
    name: 'replacementNumber',
    path: '/replacementNumber',
    meta: {
      title: '补换机动车号牌'
    },
    component: require('../views/precontractType/car/replacementType/replacementNumber.vue')
  },
  {
    name: 'renewingDrivingLicense',
    path: '/renewingDrivingLicense',
    meta: {
      title: '补换机动车行驶证'
    },
    component: require('../views/precontractType/car/replacementType/renewingDrivingLicense.vue')
  },
  {
    name: 'renewingQualification',
    path: '/renewingQualification',
    meta: {
      title: '补换检验合格标志'
    },
    component: require('../views/precontractType/car/replacementType/renewingQualification.vue')
  },
  {
    name: 'renewingCertificate',
    path: '/renewingCertificate',
    meta: {
      title: '申领/补领机动车登记证书'
    },
    component: require('../views/precontractType/car/replacementType/renewingCertificate.vue')
  },
  {
    name: 'carEmigration',
    path: '/carEmigration',
    meta: {
      title: '机动车迁出'
    },
    component: require('../views/precontractType/car/carEmigration')
  },
  {
    name: 'rollOutRecover',
    path: '/rollOutRecover',
    meta: {
      title: '转出、注销恢复'
    },
    component: require('../views/precontractType/car/rollOutRecover/rollOutRecover.vue')
  },
  {
    name: 'verifyIssueCard',
    path: '/verifyIssueCard',
    meta: {
      title: '核发临牌'
    },
    component: require('../views/precontractType/car/verifyIssueClass/verifyIssueCard.vue')
  },
  {
    name: 'verifyIssueSchoolCard',
    path: '/verifyIssueSchoolCard',
    meta: {
      title: '核发校车标牌'
    },
    component: require('../views/precontractType/car/verifyIssueClass/verifyIssueSchoolCard.vue')
  },
  {
    name: 'pledgeRegister',
    path: '/pledgeRegister',
    meta: {
      title: '抵押/解押登记现场办理'
    },
    component: require('../views/precontractType/car/sceneManageClass/pledgeRegister.vue')
  },
  {
    name: 'otherPlaceAudit',
    path: '/otherPlaceAudit',
    meta: {
      title: '机动车委托异地年审现场办理'
    },
    component: require('../views/precontractType/car/sceneManageClass/otherPlaceAudit.vue')
  },
  {
    name: 'querySuccess',
    path: '/querySuccess',
    meta: {
      title: '预约查询及取消'
    },
    component: require('../views/precontractType/querySuccess.vue')
  },
  {
    name: 'querySuccess_WeChat',
    path: '/querySuccess_WeChat',
    meta: {
      title: '预约查询及取消'
    },
    component: require('../views/precontractType/querySuccess.vue')
  },
  {
    name: 'armyLicence',
    path: '/armyLicence',
    meta: {
      title: '持军队、武警警察部队机动车驾驶证驾驶'
    },
    component: require('../views/precontractType/card/appClass/armyLicence.vue')
  },
  {
    name: 'temporaryLicence',
    path: '/temporaryLicence',
    meta: {
      title: '临时机动车驾驶证许可证申领'
    },
    component: require('../views/precontractType/card/appClass/temporaryLicence.vue')
  },
  {
    name: 'overseasLicence',
    path: '/overseasLicence',
    meta: {
      title: '持境外驾驶证申请换证'
    },
    component: require('../views/precontractType/card/renewalClass/overseasLicence.vue')
  },
  {
    name: 'HkLicence',
    path: '/HkLicence',
    meta: {
      title: '香港机动车驾驶证免试换证'
    },
    component: require('../views/precontractType/card/renewalClass/HkLicence.vue')
  },
  {
    name: 'noPhysicalCheck',
    path: '/noPhysicalCheck',
    meta: {
      title: '逾期一年以上未体检类'
    },
    component: require('../views/precontractType/card/recoverDrive/noPhysicalCheck.vue')
  },
  {
    name: 'noChangeLicence',
    path: '/noChangeLicence',
    meta: {
      title: '逾期一年以上未换证类'
    },
    component: require('../views/precontractType/card/recoverDrive/noChangeLicence.vue')
  },
  {
    name: 'fullmarkStudy',
    path: '/fullmarkStudy',
    meta: {
      title: '满分学习'
    },
    component: require('../views/precontractType/card/fullmarkStudy.vue')
  },
  {
    name: 'otherBusiness',
    path: '/otherBusiness',
    meta: {
      title: '其它业务'
    },
    component: require('../views/precontractType/card/otherBusiness.vue')
  }
]

export default precontractTypeRouter
