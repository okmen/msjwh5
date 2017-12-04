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
  }
]
