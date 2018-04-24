let routerIllegalParking = [
  {
    name: 'illegalParking',
    path: '/illegalParking',
    meta: {
      title: '十分钟违停免罚'
    },
    component: () => import('@/views/illegalParking/illegalParking')
  }
]

export default routerIllegalParking
