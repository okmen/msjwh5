export default [
  {
    name: 'updateUser',
    path: '/updateUser',
    meta: {
      title: '补全或修改资料'
    },
    component: () => import('@/views/personCenter/updateUser')
  }
]
