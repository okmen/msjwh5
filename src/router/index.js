import Vue from 'vue'
import Router from 'vue-router'
import publicRouter from './public'
import tDrivingLicence from './transactionClass/drivingLicence' // 办理类驾驶证业务
import dealServiceRouter from './transactionClass/dealService.js' // 办理类服务
import aMotorVehicles from './appointmentClass/motorVehicles' // 预约类机动车业务
import transactionClass from './transactionClass/drivingLicence'
import motorVehicles from './transactionClass/motorVehicles.js'
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
    {
      path: '/submitSuccess',
      name: 'submitSuccess',
      meta: {
        title: '提交成功'
      },
      component: () => import('@/components/submitSuccess')
    },
    ...publicRouter,
    ...tDrivingLicence,
    ...dealServiceRouter, // 办理类服务
    ...aMotorVehicles,
    ...transactionClass,
    ...motorVehicles
  ]
})

router.beforeEach((to, from, next) => {
  let source = getQueryString('source')
  // 如果页面需要登录，且来源是高德
  if (to.meta.loginStatus && source === 'G') {
    // 未登录则跳转到
    if (!window.localStorage.getItem('isLogin')) {
      console.log('当前页面需要登录且来源是高德才能访问')
      router.push({
        path: '/login?source=G',
        query: {
          url: to.fullPath
        }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
