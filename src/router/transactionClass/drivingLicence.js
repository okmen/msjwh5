export default [
  {
    path: '/subscribeService',
    name: 'subscribeService',
    meta: {
      title: '办理类服务'
    },
    component: () => import('@/views/transactionClass/subscribeService')
  },
  {
    path: '/transactionService',
    name: 'transactionService',
    meta: {
      title: '办理类服务'
    },
    component: () => import('@/views/transactionClass/transactionService')
  },
  {
    path: '/annualExaminations',
    name: 'annualExaminations',
    meta: {
      title: '机动车驾驶证年度审验',
      loginStatus: true
    },
    component: () => import('@/views/transactionClass/drivingLicence/annualExaminations')
  },
  {
    path: '/changeCard/:id',
    name: 'changeCard',
    meta: {
      title: '机动车驾驶证换证',
      loginStatus: true
    },
    component: () => import('@/views/transactionClass/drivingLicence/changeCard')
  },
  {
    path: '/degradeCard',
    name: 'degradeCard',
    meta: {
      title: '驾驶证自愿降级',
      loginStatus: true
    },
    component: () => import('@/views/transactionClass/drivingLicence/degradeCard')
  }
]
