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
    name: '/newqueryByCard',
    path: '/newqueryByCard',
    meta: {
      title: '交通违法驾驶证查询'
    },
    component: () => import('@/views/newqueryLawless/child/newqueryByCard')
  },
  {
    name: '/newqueryByCar_manual',
    path: '/newqueryByCar_manual',
    meta: {
      title: '交通违法查询'
    },
    component: () => import('@/views/newqueryLawless/child/newqueryByCar_manual')
  }
]

export default newqueryLawless
