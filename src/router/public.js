export default [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/public/home')
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录'
    },
    component: () => import('@/views/public/login')
  },
  {
    path: '/dealService',
    name: 'dealService',
    meta: {
      title: '业务列表',
      loginStatus: true
    },
    component: () => import('@/views/transactionClass/dealService')
  },
  {
    path: '/dealServiceMsjw',
    name: 'dealServiceMsjw',
    meta: {
      title: '业务列表',
      loginStatus: true
    },
    component: () => import('@/views/transactionClass/dealServiceMsjw')
  }
]
