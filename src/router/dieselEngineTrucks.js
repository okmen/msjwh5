let dieselEngineTrucks = [
  {
    name: 'dieselEngineTrucksTab',
    path: '/dieselEngineTrucksTab',
    meta: {
      title: '柴油轻型自卸货车'
    },
    component: () => import('@/views/dieselEngineTrucks/dieselEngineTrucksTab')
  },
  {
    name: 'dieselEngineTrucks',
    path: '/dieselEngineTrucks',
    meta: {
      title: '柴油轻型自卸货车'
    },
    component: () => import('@/views/dieselEngineTrucks/dieselEngineTrucks')
  },
  {
    name: 'dieselEngineTrucksDemand',
    path: '/dieselEngineTrucksDemand',
    meta: {
      title: '业务查询'
    },
    component: () => import('@/views/dieselEngineTrucks/dieselEngineTrucksDemand')
  },
  {
    name: 'dieseDemand',
    path: '/dieseDemand',
    meta: {
      title: '业务查询'
    },
    component: () => import('@/views/dieselEngineTrucks/dieseDemand')
  },
  {
    name: 'dieseDemandMyCar',
    path: '/dieseDemandMyCar',
    meta: {
      title: '业务查询'
    },
    component: () => import('@/views/dieselEngineTrucks/dieseDemandMyCar')
  },
  {
    name: 'dieseInquire',
    path: '/dieseInquire',
    meta: {
      title: '业务查询'
    },
    component: () => import('@/views/dieselEngineTrucks/dieseInquire')
  }
]

export default dieselEngineTrucks
