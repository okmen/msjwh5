export default [
  {
    name: 'updateUser',
    path: '/updateUser',
    meta: {
      title: '补全或修改资料'
    },
    component: () => import('@/views/personCenter/updateUser')
  },
  {
    name: 'logOut',
    path: '/logOut',
    meta: {
      title: '退出登录'
    },
    component: () => import('@/views/personCenter/logOut')
  },
  {
    name: 'addVehicle',
    path: '/addVehicle',
    meta: {
      title: '添加车辆'
    },
    component: () => import('@/views/personCenter/addVehicle')
  },
  {
    name: 'myCar',
    path: '/myCar',
    meta: {
      title: '绑定车辆'
    },
    component: () => import('@/views/personCenter/myCar')
  },
  {
    name: 'personalCenter',
    path: '/personalCenter',
    meta: {
      title: '民生警务个人中心'
    },
    component: () => import('@/views/personCenter/personalCenter')
  }
]
