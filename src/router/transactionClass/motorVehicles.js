export default [
  {
    path: '/applyClass/:id',
    name: 'applyClass',
    meta: {
      title: '申请类'
    },
    component: () => import('@/views/transactionClass/motorVehicles/applyClass/applyClass')
  },
  {
    path: '/replaceLicencePlate',
    name: 'replaceLicencePlate',
    meta: {
      title: '补领机动车号牌'
    },
    component: () => import('@/views/transactionClass/motorVehicles/replacementClass/replaceLicencePlate')
  }
]
