import Vue from 'vue'
import Router from 'vue-router'
import publicRouter from './public'
import tDrivingLicence from './transactionClass/drivingLicence' // 办理类驾驶证业务
import aMotorVehicles from './appointmentClass/motorVehicles' // 预约类机动车业务
import motorVehicles from './transactionClass/motorVehicles.js'
import personCenter from './personCenter' // 个人中心
import credit from './credit' // 信息单据证明
import { getQueryString, wxShare } from '@/utils/utils'
import qs from 'qs'

Vue.use(Router)
Router.prototype.selfPush = function (...rest) {
  let queryURL = window.VM.$store.getters.queryURL
  if (rest[0] instanceof Object) {
    router.push({path: rest[0].path, query: {...queryURL, ...rest[0].query}})
  } else if (typeof rest[0] === 'string') {
    if (rest[0].indexOf('?') >= 0) {
      router.push(`${rest[0]}&${qs.stringify(queryURL)}`)
    } else {
      router.push(`${rest[0]}?${qs.stringify(queryURL)}`)
    }
  }
}
let router = new Router({
  routes: [
    {
      path: '/userAgreement/:id', // 办理类
      name: 'userAgreement',
      meta: {
        title: '用户须知'
      },
      component: () => import('@/components/userAgreement')
    },
    {
      name: 'userAgreement_precontract', // 预约类
      path: '/userAgreement_precontract',
      meta: {
        title: '用户须知'
      },
      component: () => import('@/components/userAgreement_precontract.vue')
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
    {
      name: 'appointSuccess',
      path: '/appointSuccess',
      meta: {
        title: '预约申办成功'
      },
      component: () => import('@/components/appointSuccess')
    },
    ...publicRouter,
    ...tDrivingLicence,
    ...aMotorVehicles,
    ...motorVehicles,
    ...personCenter,
    ...credit
  ]
})

router.beforeEach((to, from, next) => {
  // 微信分享
  wxShare({
    title: to.meta.title,
    fullPath: to.fullPath,
    source: to.query.source
  })
  // 如果来源是高德，且未IOS系统
  let source = getQueryString('source')
  if (source === 'G' && window.AmapApp.util.os.ios) {
    console.log('高德来源，设置标题', to.meta.title)
    window.AmapApp.Bridge.send({
      action: 'setWebViewTitle',
      title: to.meta.title
    })
  }
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
