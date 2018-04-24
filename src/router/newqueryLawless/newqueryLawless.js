let newqueryLawless = [
  {
    name: 'newqueryLawless',
    path: '/newqueryLawless',
    meta: {
      title: '违法处理业务'
    },
    component: () => import('@/views/newqueryLawless')
  },
  {
    name: 'newqueryByCar',
    path: '/newqueryByCar',
    meta: {
      title: '交通违法查询'
    },
    component: () => import('@/views/newqueryLawless/child/newqueryByCar')
  },
  {
    name: 'newqueryByCard',
    path: '/newqueryByCard',
    meta: {
      title: '交通违法驾驶证查询'
    },
    component: () => import('@/views/newqueryLawless/child/newqueryByCard')
  },
  {
    name: 'newqueryByCar_manual',
    path: '/newqueryByCar_manual',
    meta: {
      title: '交通违法查询'
    },
    component: () => import('@/views/newqueryLawless/child/newqueryByCar_manual')
  },
  {
    name: 'newLawlessMsg',
    path: '/newLawlessMsg',
    meta: {
      title: '交通违法查询结果'
    },
    component: () => import('@/views/newqueryLawless/child/newLawlessMsg')
  },
  {
    name: 'newqueryAppeal',
    path: '/newqueryAppeal',
    meta: {
      title: '交通违法申述'
    },
    component: () => import('@/views/newqueryLawless/child/appealForm')
  },
  {
    name: 'illegalImage',
    path: '/illegalImage',
    meta: {
      title: '违法图片'
    },
    component: () => import('@/views/newqueryLawless/child/illegalImage')
  },
  {
    name: 'newTimeSelect',
    path: '/newTimeSelect',
    meta: {
      title: '交通违法预约'
    },
    component: () => import('@/views/newqueryLawless/child/illegalTimeSelect')
  },
  {
    name: 'newPayLawless',
    path: '/newPayLawless',
    meta: {
      title: '违法处理类业务'
    },
    component: () => import('@/views/newqueryLawless/child/newPayLawless')
  },
  {
    name: 'confirmLawless',
    path: '/confirmLawless',
    meta: {
      title: '违法处理类业务'
    },
    component: () => import('@/views/newqueryLawless/child/confirmLawless')
  },
  {
    name: 'appealEntry',
    path: '/appealEntry',
    meta: {
      title: '违法申诉入口'
    },
    component: () => import('@/views/newqueryLawless/child/appealQuery')
  },
  {
    name: 'newEarly',
    path: '/newEarly',
    meta: {
      title: '交通违法预约'
    },
    component: () => import('@/views/newqueryLawless/child/newEarly')
  }
]

export default newqueryLawless
