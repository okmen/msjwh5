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
      title: '补领机动车号牌'
    },
    component: () => import('@/views/transactionClass/motorVehicles/replacementClass/replaceLicencePlate')
  },
  {
    path: '/placeExamineCar',
    name: 'placeExamineCar',
    meta: {
      title: '机动车委托异地定期检验申报',
      loginStatus: true
    },
    component: () => import('@/views/transactionClass/motorVehicles/placeExamine/placeExamineCar')
  },
  {
    path: '/placeExamine',
    name: 'placeExamine',
    meta: {
      title: '机动车委托异地定期检验申报',
      loginStatus: true
    },
    component: () => import('@/views/transactionClass/motorVehicles/placeExamine/placeExamine')
  },
  {
    path: '/placeExamineDemand',
    name: 'placeExamineDemand',
    meta: {
      title: '机动车委托异地定期检验申报',
      loginStatus: true
    },
    component: () => import('@/views/transactionClass/motorVehicles/placeExamine/placeExamineDemand')
  },
  {
    path: '/replaceQualifiedMark',
    name: 'replaceQualifiedMark',
    meta: {
      title: '补换检验合格标志',
      loginStatus: true
    },
    component: () => import('@/views/transactionClass/motorVehicles/replaceQualifiedMark/replaceQualifiedMark')
  }
]
