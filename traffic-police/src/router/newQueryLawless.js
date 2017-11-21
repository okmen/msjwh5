let newQueryLawlessRouter = [
  {
    name: 'newQueryLawless',
    path: '/newQueryLawless',
    meta: {
      title: '违法处理类业务'
    },
    component: require('../views/newQueryLawless/queryLawless.vue')
  },
  {
    name: 'newqueryByCar',
    path: '/newqueryByCar',
    meta: {
      title: '交通违法查询'
    },
    component: require('../views/newQueryLawless/child/newqueryByCar.vue')
  },
  {
    name: 'newqueryByCar_manual',               // 手动交通违法查询
    path: '/newqueryByCar_manual',
    meta: {
      title: '交通违法查询'
    },
    component: require('../views/newQueryLawless/child/newqueryByCar_manual.vue')
  },
  {
    name: 'newqueryByCard',               // 手动交通驾驶证违法查询
    path: '/newqueryByCard',
    meta: {
      title: '交通违法驾驶证查询'
    },
    component: require('../views/newQueryLawless/child/newqueryByCard.vue')
  },
  {
    name: 'newLawlessMsg',
    path: '/newLawlessMsg',
    meta: {
      title: '违法查询结果'
    },
    component: require('../views/newQueryLawless/child/newLawlessMsg.vue')
  },
  {
    name: 'newLawlessMsg_noBtn',
    path: '/newLawlessMsg_noBtn',
    meta: {
      title: '违法查询结果'
    },
    component: require('../views/newQueryLawless/child/newLawlessMsg_noBtn.vue')
  },
  {
    name: 'appeal',
    path: '/appealEntry',
    meta: {
      title: '违法申诉入口'
    },
    component: require('../views/newQueryLawless/child/appealQuery.vue')
  },
  {
    name: 'appeal_WeChat',                                                           // 微信版本
    path: '/appealEntry_WeChat',
    meta: {
      title: '违法申诉入口'
    },
    component: require('../views/newQueryLawless/child/appealQuery.vue')
  },
  {
    name: 'illegalAppealResult',
    path: '/illegalResult',
    meta: {
      title: '违法申诉结果页'
    },
    component: require('../views/newQueryLawless/child/illegalAppealResult.vue')
  },
  {
    name: 'newqueryAppeal',
    path: '/newqueryAppeal',
    meta: {
      title: '违法申诉提交表单'
    },
    component: require('../views/newQueryLawless/child/appealForm.vue')
  },
  {
    name: 'confirmLawless',
    path: '/confirmLawless',
    meta: {
      title: '违法在线确认'
    },
    component: require('../views/newQueryLawless/child/confirmLawless.vue')
  },
  {
    name: 'newEarly',
    path: '/newEarly',
    meta: {
      title: '交通违法预约'
    },
    component: require('../views/newQueryLawless/child/early.vue')
  },
  {
    name: 'newPayLawless',
    path: '/newPayLawless',
    meta: {
      title: '交通违法缴款'
    },
    component: require('../views/newQueryLawless/child/newPayLawless.vue')
  },
  {
    name: 'newTimeSelect',
    path: '/newTimeSelect',
    meta: {
      title: '交通违法预约'
    },
    component: require('../views/newQueryLawless/child/illegalTimeSelect.vue')
  },
  {
    name: 'illegalImage',
    path: '/illegalImage',
    meta: {
      title: '违法图片'
    },
    component: require('../views/newQueryLawless/child/illegalImage.vue')
  },
  {
    name: 'illegalAppointmentMs',
    path: '/illegalAppointmentMs',
    meta: {
      title: '违法预约'
    },
    component: require('../views/newQueryLawless/child/illegalAppointmentMs.vue')
  }
]

export default newQueryLawlessRouter
