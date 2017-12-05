export default [
  {
    name: 'applyClass',
    path: '/applyClass/:id',
    meta: {
      title: '申请类'
    },
    component: () => import('@/views//transactionClass/motorVehicles/applyClass/applyClass.vue')
  }
]
