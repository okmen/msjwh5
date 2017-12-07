export default [
  {
    path: '/subscribeService',
    name: 'subscribeService',
    meta: {
      title: '办理业务'
    },
    component: () => import('@/views/transactionClass/subscribeService')
  },
  {
    path: '/transactionService',
    name: 'transactionService',
    meta: {
      title: '办理业务'
    },
    component: () => import('@/views/transactionClass/transactionService')
  },
  {
    path: '/subscribeServiceMsjw',
    name: 'subscribeServiceMsjw',
    meta: {
      title: '办理业务'
    },
    component: () => import('@/views/transactionClass/subscribeServiceMsjw')
  },
  {
    path: '/transactionServiceMsjw',
    name: 'transactionServiceMsjw',
    meta: {
      title: '预约业务'
    },
    component: () => import('@/views/transactionClass/transactionServiceMsjw')
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
      title: '补换证类',
      loginStatus: true
    },
    component: () => import('@/views/transactionClass/drivingLicence/changeCard')
  },
  {
    path: '/replaceQualifiedMark',
    name: 'replaceQualifiedMark',
    meta: {
      title: '补换检验合格标志',
      loginStatus: true
    },
    component: () => import('@/views/transactionClass/drivingLicence/replaceQualifiedMark')
  }
]
