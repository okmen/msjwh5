import Vue from 'vue'
import Router from 'vue-router'
import publicRouter from './public'
import transactionClass from './transactionClass/drivingLicence'

Vue.use(Router)

export default new Router({
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
    ...transactionClass
  ]
})
