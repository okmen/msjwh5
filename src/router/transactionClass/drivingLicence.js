export default [
  {
    path: '/dealService',
    name: 'dealService',
    meta: {
      title: '办理业务'
    },
    component: () => import('@/views/transactionClass/dealService')
  },
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
  }
]
