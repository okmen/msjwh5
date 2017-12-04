import Vue from 'vue'
import Router from 'vue-router'
import publicRouter from './public'
import transactionClass from './transactionClass/drivingLicence'
import dealServiceRouter from './dealService/dealService.js' // 办理类服务
import { getQueryString } from '@/utils/utils'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/userAgreement/:id',
      name: 'userAgreement',
      meta: {
        title: '用户须知'
      },
      component: () => import('@/components/userAgreement')
    },
    {
      path: '/affirmInfo',
      name: 'affirmInfo',
      meta: {
        title: '信息确认'
      },
      component: () => import('@/components/affirmInfo')
    },
    ...publicRouter,
    ...transactionClass,
    ...dealServiceRouter // 办理类服务
  ]
})

router.beforeEach((to, from, next) => {
  // 如果页面需要登录，且来源是高德
  if (to.meta.loginStatus && getQueryString('source') === 'G') {
    // 未登录则跳转到
    if (!window.localStorage.getItem('isLogin')) {
      console.log('当前页面需要登录且来源是高德才能访问')
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
