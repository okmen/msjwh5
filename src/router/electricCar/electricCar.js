let electricCar = [
  {
    name: '/electricCar',
    path: '/electricCar',
    meat: {
      title: '电动车管理'
    },
    component: () => import('@/views/electricCar')
  },
  {
    name: 'scancode',
    path: '/scancode',
    meat: {
      title: '电动车档案扫一扫'
    },
    component: () => import('@/views/electricCar/child/scancode')
  },
  {
    name: 'electrocarFile',
    path: '/electrocarFile',
    meat: {
      title: '电动车档案'
    },
    component: () => import('@/views/electricCar/child/electrocarFile')
  }
]

export default electricCar
