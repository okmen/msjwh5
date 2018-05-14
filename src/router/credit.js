let creditRouter = [
  {
    name: 'credit',
    path: '/credit',
    meta: {
      title: '信息单据证明',
      loginStatus: true
    },
    component: () => import('@/views/credit/index')
  },
  {
    name: 'vehicleSheet',
    path: '/vehicleSheet',
    meta: {
      title: '机动车信息单',
      loginStatus: true
    },
    component: () => import('@/views/credit/child/vehicleSheet')
  },
  {
    name: 'driverCredit',
    path: '/driverCredit',
    meta: {
      title: '驾驶人安全事故信用表',
      loginStatus: true
    },
    component: () => import('@/views/credit/child/driverCredit')
  },
  {
    name: 'carFree',
    path: '/carFree',
    meta: {
      title: '无车证明',
      loginStatus: true
    },
    component: () => import('@/views/credit/child/driverCredit')
  },
  {
    name: 'driversInformation',
    path: '/driversInformation',
    meta: {
      title: '驾驶人信用单',
      loginStatus: true
    },
    component: () => import('@/views/credit/child/driverCredit')
  },
  {
    name: 'digByCar',
    path: '/digByCar',
    meta: {
      title: '电子回单',
      loginStatus: true
    },
    component: () => import('@/views/credit/child/digByCar')
  },
  {
    name: 'digitalReceipt',
    path: '/digitalReceipt',
    meta: {
      title: '电子回单',
      loginStatus: true
    },
    component: () => import('@/views/credit/child/digitalReceipt')
  },
  {
    name: 'digitalReceiptRecord',
    path: '/digitalReceiptRecord',
    meta: {
      title: '电子回单',
      loginStatus: true
    },
    component: () => import('@/views/credit/child/digitalReceiptRecord')
  }
]

export default creditRouter
