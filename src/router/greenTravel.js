let routerConfig = [
  {
    name: 'greenTravel',
    path: '/greenTravel',
    meta: {
      title: '绿色出行'
    },
    component: () => import('@/views/greenTravel/greenTravel')
  },
  {
    name: 'prize',
    path: '/prize',
    meta: {
      title: '奖励说明'
    },
    component: () => import('@/views/greenTravel/prize')
  },
  {
    name: 'greenApply',
    path: '/greenTravel/greenApply',
    meta: {
      title: '绿色出行-录入信息',
      loginStatus: true
    },
    component: () => import('@/views/greenTravel/greenApply')
  },
  {
    name: 'greenApplyDate',
    path: '/greenTravel/greenApplyDate',
    meta: {
      title: '申报停驶日期'
    },
    component: () => import('@/views/greenTravel/greenApplyDate')
  }
]

export default routerConfig
