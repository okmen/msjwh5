export default [
  {
    path: '/annualExaminations',
    name: 'annualExaminations',
    meta: {
      title: '驾驶证年审'
    },
    component: () => import('@/views//transactionClass/drivingLicence/annualExaminations')
  },
  {
    path: '/changeCard',
    name: 'changeCard',
    meta: {
      title: '补换证类',
      loginStatus: true
    },
    component: () => import('@/views//transactionClass/drivingLicence/changeCard')
  }
]
