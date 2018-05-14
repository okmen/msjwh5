let routerTakePhoto = [
  {
    name: 'takePhoto',
    path: '/takePhoto',
    meta: {
      title: '十分钟违停免罚'
    },
    component: () => import('@/views/illegalParking/takePhoto')
  }
]

export default routerTakePhoto
