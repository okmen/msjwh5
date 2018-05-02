let routerQueryIllegalParking = [
  {
    name: 'queryIllegalParking',
    path: '/queryIllegalParking',
    meta: {
      title: '查询违停免罚'
    },
    component: () => import('@/views/illegalParking/list')
  }
]

export default routerQueryIllegalParking
