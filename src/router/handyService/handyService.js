let handyService = [
  {
    name: 'handyService',
    path: '/handyService',
    meta: {
      title: '便民服务'
    },
    component: () => import('@/views/handyService')
  },
  {
    name: 'bindCar',
    path: '/bindCar',
    meta: {
      title: '一键救援'
    },
    component: () => import('@/views/handyService/child/bindCar')
  }
]

export default handyService
