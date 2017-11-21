let peopleWillCloudRouter = [
  {
    name: 'trafficCivilization',
    path: '/trafficCivilization',
    mate: {
      title: '文明交通我做主'
    },
    component: require('../views/peopleWillCloud/trafficCivilization.vue')
  },
  {
    name: 'peopleWillCloud',
    path: '/peopleWillCloud',
    meta: {
      title: '交通文明我做主'
    },
    component: require('../views/peopleWillCloud/peopleWillCloud.vue'),
    redirect: '/peopleWillCloud/facility',
    children: [
      {
        name: 'facility',
        path: '/peopleWillCloud/facility',
        meta: {
          title: '交通文明我做主'
        },
        component: require('../views/peopleWillCloud/child/facility.vue')
      },
      {
        name: 'secure',
        path: '/peopleWillCloud/secure',
        meta: {
          title: '交通文明我做主'
        },
        component: require('../views/peopleWillCloud/child/secure.vue')
      },
      {
        name: 'jam',
        path: '/peopleWillCloud/jam',
        meta: {
          title: '交通文明我做主'
        },
        component: require('../views/peopleWillCloud/child/jam.vue')
      },
      {
        name: 'order',
        path: '/peopleWillCloud/order',
        meta: {
          title: '交通文明我做主'
        },
        component: require('../views/peopleWillCloud/child/order.vue')
      }
    ]
  }
]

export default peopleWillCloudRouter
