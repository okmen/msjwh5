export default [
  {
    path: '/carService',
    name: 'carService',
    meta: {
      title: '办理业务'
    },
    component: () => import('@/views/transactionClass/carService')
  },
  {
    path: '/cardService',
    name: 'cardService',
    meta: {
      title: '办理业务'
    },
    component: () => import('@/views/transactionClass/cardService')
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
