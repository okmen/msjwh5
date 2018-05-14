let peopleWillCloudRouter = [
  {
    name: 'trafficCivilization',
    path: '/trafficCivilization',
    mate: {
      title: '文明交通我做主',
      loginStatus: true
    },
    component: () => import('@/views/peopleWillCloud/trafficCivilization')
  },
  {
    name: 'peopleWillCloud',
    path: '/peopleWillCloud',
    meta: {
      title: '交通文明我做主'
    },
    component: () => import('@/views/peopleWillCloud/peopleWillCloud'),
    redirect: '/peopleWillCloud/facility',
    children: [
      {
        name: 'facility',
        path: '/peopleWillCloud/facility',
        meta: {
          title: '交通文明我做主'
        },
        component: () => import('@/views/peopleWillCloud/child/facility')
      },
      {
        name: 'secure',
        path: '/peopleWillCloud/secure',
        meta: {
          title: '交通文明我做主'
        },
        component: () => import('@/views/peopleWillCloud/child/secure')
      },
      {
        name: 'jam',
        path: '/peopleWillCloud/jam',
        meta: {
          title: '交通文明我做主'
        },
        component: () => import('@/views/peopleWillCloud/child/jam')
      },
      {
        name: 'order',
        path: '/peopleWillCloud/order',
        meta: {
          title: '交通文明我做主'
        },
        component: () => import('@/views/peopleWillCloud/child/order')
      }
    ]
  }
]

export default peopleWillCloudRouter
