export default [
  {
    name: 'applyClass',
    path: '/applyClass/:id',
    meta: {
      title: '申请类'
    },
    component: () => import('@/views/transactionClass/motorVehicles/applyClass/applyClass.vue')
  },
  {
    name: 'replaceLicencePlate',
    path: 'replaceLicencePlate',
    meta: {
      title: '补领机动车号牌'
    },
    component: () => import('@/views/transactionClass/motorVehicles/replacementClass/replaceLicencePlate.vue')
  }
]
