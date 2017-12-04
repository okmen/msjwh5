export default [
  {
    path: '/annualExaminations',
    name: 'annualExaminations',
    meta: {
      title: '驾驶证年审'
    },
    component: () => import('@/views//transactionClass/drivingLicence/annualExaminations')
  }
]
