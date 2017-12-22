export default [
  {
    path: '/applyInterimCard',
    name: 'applyInterimCard',
    meta: {
      title: '办理临时行驶车号牌',
      loginStatus: true
    },
    component: () => import('@/views/transactionClass/motorVehicles/applyClass/applyInterimCard')
  },
  {
    path: '/replaceLicencePlate',
    name: 'replaceLicencePlate',
    meta: {
      title: '办理补证、换领机动车号牌',
      loginStatus: true
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
      title: '委托核发机动车检验合格标志',
      loginStatus: true
    },
    component: () => import('@/views/transactionClass/motorVehicles/placeExamine/placeExamine')
  },
  {
    path: '/placeExamineDemand',
    name: 'placeExamineDemand',
    meta: {
      title: '委托核发机动车检验合格标志',
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
  },
  {
    path: '/esemptionCar',
    name: 'esemptionCar',
    meta: {
      title: '核发机动车检验合格标志',    // 原业务为-六年免检申请
      loginStatus: true
    },
    component: () => import('@/views/transactionClass/motorVehicles/exemption/esemptionCar')
  },
  {
    name: 'exemptionAbolish',
    path: '/exemptionAbolish',
    meta: {
      title: '核发机动车检验合格标志'   // 六年免检查询取消
    },
    component: () => import('@/views/transactionClass/motorVehicles/exemption/exemptionAbolish')
  }
]
