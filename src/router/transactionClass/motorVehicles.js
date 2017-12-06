export default [
  {
    path: '/applyInterimCard',
    name: 'applyInterimCard',
    meta: {
      title: '申请机动车临牌'
    },
    component: () => import('@/views/transactionClass/motorVehicles/applyClass/applyInterimCard')
  },
  {
    path: '/replaceLicencePlate',
    name: 'replaceLicencePlate',
    meta: {
      title: '补换机动车号牌'
    },
    component: () => import('@/views/transactionClass/motorVehicles/replacementClass/replaceLicencePlate')
  }
]
