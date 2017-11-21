let creditRouter = [
  {
    name: 'credit',
    path: '/credit',
    meta: {
      title: '信息单据证明'
    },
    component: require('../views/credit/index.vue')
  },
  {
    name: 'motorVehicle',
    path: '/motorVehicle',
    meta: {
      title: '机动车信息单'
    },
    component: require('../views/credit/child/motorVehicle.vue')
  },
  {
    name: 'driverCredit',
    path: '/driverCredit',
    meta: {
      title: '驾驶人安全事故信用表'
    },
    component: require('../views/credit/child/driverCredit.vue')
  },
  {
    name: 'carFree',
    path: '/carFree',
    meta: {
      title: '无车证明'
    },
    component: require('../views/credit/child/driverCredit.vue')
  },
  {
    name: 'driversInformation',
    path: '/driversInformation',
    meta: {
      title: '驾驶人信用单'
    },
    component: require('../views/credit/child/driverCredit.vue')
  },
  {
    name: 'digitalReceipt',
    path: '/digitalReceipt',
    meta: {
      title: '电子回单'
    },
    component: require('../views/credit/child/digitalReceipt.vue')
  },
  {
    name: 'digitalreceipTinquire',
    path: '/digitalreceipTinquire',
    meta: {
      title: '电子回单'
    },
    component: require('../views/credit/child/digitalreceipTinquire.vue')
  },
  {
    name: 'digitalReceiptRecord',
    path: '/digitalReceiptRecord',
    meta: {
      title: '电子回单'
    },
    component: require('../views/credit/child/digitalReceiptRecord.vue')
  },
  {
    name: 'digByCar',
    path: '/digByCar',
    meta: {
      title: '电子回单'
    },
    component: require('../views/credit/child/digByCar.vue')
  }
]

export default creditRouter
