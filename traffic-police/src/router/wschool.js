let wschoolRouter = [
  {
    name: 'wschool',
    path: '/wschool',
    meta: {
      title: '微学堂'
    },
    component: require('../views/wschool/wschool.vue')
  },
  {
    name: 'electricCar',
    path: '/electricCar',
    meta: {
      title: '电动车管理'
    },
    component: require('../views/wschool/electricCar.vue')
  },
  {
    name: 'motorstudy',
    path: '/motorstudy',
    meta: {
      title: '微学堂学习'
    },
    component: require('../views/wschool/subclass/motorstudy.vue')
  },
  {
    name: 'motorstudy_WeChat',                                                 // 微信版本
    path: '/motorstudy_WeChat',
    meta: {
      title: '微学堂学习'
    },
    component: require('../views/wschool/subclass/motorstudy.vue')
  },
  {
    name: 'answer',
    path: '/answer',
    meta: {
      title: '答题'
    },
    component: require('../views/wschool/subclass/answer.vue')
  },
  {
    name: 'grade',
    path: '/grade',
    meta: {
      title: '评分'
    },
    component: require('../views/wschool/subclass/child/grade.vue')

  },
  {
    name: 'result',
    path: '/result',
    meta: {
      title: '成绩'
    },
    component: require('../views/wschool/subclass/child/result.vue')
  },
  {
    name: 'answers',
    path: '/answers',
    meta: {
      title: '学习答题'
    },
    component: require('../views/wschool/subclass/answers.vue')
  }
]

export default wschoolRouter
