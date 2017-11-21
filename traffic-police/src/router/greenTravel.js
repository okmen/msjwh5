let routerConfig = [
  {
    name: 'greenTravel',
    path: '/greenTravel',
    meta: {
      title: '绿色出行'
    },
    component: require('../views/greenTravel/greenTravel.vue')
  },
  {
    name: 'starLevel',
    path: '/greenTravel/starLevel',
    meta: {
      title: '绿色出行'
    },
    component: require('../views/greenTravel/starLevel.vue')
  },
  {
    name: 'prize',
    path: '/prize',
    meta: {
      title: '奖励说明'
    },
    component: require('../views/greenTravel/prize.vue')
  },
  {
    name: 'greenApply',
    path: '/greenTravel/greenApply',
    meta: {
      title: '绿色出行-录入信息'
    },
    component: require('../views/greenTravel/greenApply.vue')
  },
  {
    name: 'greenApplyNoLogin',
    path: '/greenTravel/greenApplyNoLogin',
    meta: {
      title: '绿色出行-非星级用户录入信息'
    },
    component: require('../views/greenTravel/greenApplyNoLogin.vue')
  },
  {
    name: 'greenApplyDate',
    path: '/greenTravel/greenApplyDate',
    meta: {
      title: '申报停驶日期'
    },
    component: require('../views/greenTravel/greenApplyDate.vue')
  },
  {
    name: 'greenComplaint',
    path: '/greenTravel/greenComplaint',
    meta: {
      title: '申报停驶日期'
    },
    component: require('../views/greenTravel/greenComplaint.vue')
  },
  {
    name: 'greenItem',
    path: '/greenTravel/greenItem',
    meta: {
      title: '申报停驶日期'
    },
    component: require('../views/greenTravel/greenItem.vue')
  }
]

export default routerConfig
