let smallClass = [
  {
    naem: 'smallClass',
    path: '/smallClass',
    meta: {
      title: '微课堂学习'
    },
    component: () => import('@/views/smallClass')
  },
  {
    name: 'motorstudy/:id',
    path: '/motorstudy',
    meta: {
      title: '微课堂学习'
    },
    component: () => import('@/views/smallClass/motorstudy/motorstudy')
  },
  {
    name: 'answer/:id',
    path: '/answer',
    meta: {
      title: '答题'
    },
    component: () => import('@/views/smallClass/motorstudy/answer')
  },
  {
    name: 'grade',
    path: '/grade',
    meta: {
      title: '评分'
    },
    component: () => import('@/views/smallClass/motorstudy/grade')
  },
  {
    name: 'result',
    path: '/result',
    meta: {
      title: '成绩'
    },
    component: () => import('@/views/smallClass/motorstudy/result')
  }
]

export default smallClass
