let queryLawlessRouter = [
  {
    name: 'queryLawless',
    path: '/queryLawless',
    meta: {
      title: '违法处理类业务'
    },
    component: require('../views/queryLawless/queryLawless.vue')
  },
  {
    name: 'appeal',
    path: '/appeal',
    meta: {
      title: '违法申诉'
    },
    component: require('../views/queryLawless/child/appealQuery.vue')
  },
  {
    name: 'confirm',
    path: '/confirm',
    meta: {
      title: '违法确认'
    },
    component: require('../views/queryLawless/child/confirmLawless.vue')
  },
  {
    name: 'confirmClaim',
    path: '/confirmClaim/licensePlateNo/:licensePlateNo/plateType/:plateType',
    meta: {
      title: '交通违法打单'
    },
    component: require('../views/queryLawless/child/confirmLawlessPrint.vue')
  },
  {
    name: 'early',
    path: '/early',
    meta: {
      title: '交通违法预约'
    },
    component: require('../views/queryLawless/child/early.vue')
  },
  {
    name: 'illegalTimeSelect',
    path: '/illegalTimeSelect',
    meta: {
      title: '交通违法预约'
    },
    component: require('../views/queryLawless/child/illegalTimeSelect.vue')
  },
  {
    name: 'payLawless',
    path: '/payLawless',
    meta: {
      title: '违法缴款'
    },
    component: require('../views/queryLawless/child/payLawless.vue')
  },
  {
    name: 'queryLawlessPage',
    path: '/queryLawlessPage',
    meta: {
      title: '查询违法记录页面'
    },
    component: require('../views/queryLawless/child/queryLawlessPage.vue')
  },
  {
    name: 'illegalAppealResult',
    path: '/illegalAppealResult',
    meta: {
      title: '违法申诉结果页'
    },
    component: require('../views/queryLawless/child/illegalAppealResult.vue')
  },
  {
    name: 'illegalOrderDeal',
    path: '/illegalOrderDeal',
    meta: {
      title: '违法预约结果查询'
    },
    component: require('../views/queryLawless/child/illegalOrderDeal.vue')
  }
]

export default queryLawlessRouter
