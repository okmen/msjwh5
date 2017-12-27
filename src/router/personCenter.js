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
  }
]
