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
      title: '驾驶证年审'
    },
    component: () => import('@/views/transactionClass/drivingLicence/annualExaminations')
  },
  {
    path: '/changeCard',
    name: 'changeCard',
    meta: {
      title: '驾驶证补换证',
      loginStatus: true
    },
    component: () => import('@/views/transactionClass/drivingLicence/changeCard')
  }
]
