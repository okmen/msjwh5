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
  },
  {
    path: '/changeConnect',
    name: 'changeConnect',
    meta: {
      title: '驾驶人联系方式变更',
      loginStatus: true
    },
    component: () => import('@/views/transactionClass/drivingLicence/changeConnect')
  },
  {
    path: '/intoCard',
    name: 'intoCard',
    meta: {
      title: '驾驶证转入',
      loginStatus: true
    },
    component: () => import('@/views/transactionClass/drivingLicence/intoCard')
  },
  {
    path: '/postponeChangeCard',
    name: 'postponeChangeCard',
    meta: {
      title: '驾驶证延期换证',
      loginStatus: true
    },
    component: () => import('@/views/transactionClass/drivingLicence/postponeChangeCard')
  }
]
