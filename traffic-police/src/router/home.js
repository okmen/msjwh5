import router from './index'

let loginTo = {}
let homeRouter = [
  {
    name: 'login',
    path: '/login',
    meta: {
      title: '登录'
    },
    component: require('../views/login/login.vue'),
    beforeEnter: (to, from, next) => {
      if (from.name !== 'findPassword' && from.name !== 'initAuthentication' && from.name !== 'carOwner') {
        loginTo = Object.assign({}, from)
      }
      router.from = loginTo
      next()
    }
  },
  {
    name: 'login_dealService',
    path: '/login_dealService',
    meta: {
      title: '登录'
    },
    component: require('../views/login/login_dealService.vue'),
    beforeEnter: (to, from, next) => {
      router.from = from
      next()
    }
  },
  // {
  //   name: 'loginIcp',
  //   path: '/loginIcp',
  //   meta: {
  //     title: '星级用户登录'
  //   },
  //   component: require('../views/login/loginIcp.vue')
  // },
  {
    name: 'findPassword',
    path: '/findPassword',
    meta: {
      title: '忘记密码'
    },
    component: require('../views/login/findPassword.vue')
  },
  {
    name: 'initAuthentication',
    path: '/initAuthentication',
    meta: {
      title: '重新认证'
    },
    component: require('../views/login/initAuthentication.vue')
  },
  {
    name: 'personalCenter',
    path: '/personalCenter',
    meta: {
      title: '个人中心'
    },
    component: require('../views/personalCenter/personalCenter.vue')
  },
  {
    name: 'myECard',
    path: '/myECard',
    meta: {
      title: '我的证件'
    },
    component: require('../views/myECard/myECard.vue')
  },
  {
    name: 'DriverCardNone',
    path: '/DriverCardNone',
    meta: {
      title: '无驾驶证页面'
    },
    component: require('../views/personalCenter/child/DriverCardNone.vue')
  },
  {
    name: 'DriverCardVerify',
    path: '/DriverCardVerify',
    meta: {
      title: '我的证件'
    },
    component: require('../views/personalCenter/child/DriverCardVerify.vue')
  },
  {
    name: 'updatePwd',
    path: '/updatePwd',
    meta: {
      title: '个人资料'
    },
    component: require('../views/personalCenter/child/updatePwd.vue')
  },
  {
    name: 'updateMobile',
    path: '/updateMobile',
    meta: {
      title: '个人资料'
    },
    component: require('../views/personalCenter/child/updateMobile.vue')
  },
  {
    name: 'addVehicle',
    path: '/addVehicle',
    meta: {
      title: '添加车辆'
    },
    component: require('../views/personalCenter/child/addVehicle.vue')
  },
  {
    name: 'updateUser',
    path: '/updateUser',
    meta: {
      title: '个人资料'
    },
    component: require('../views/personalCenter/child/updateUser.vue')
  },
  {
    name: 'userInfo',
    path: '/userInfo',
    component: require('../views/personalCenter/child/userInfo.vue')
  },
  {
    name: 'starUser',
    path: '/starUser',
    meta: {
      title: '星级用户认证'
    },
    component: require('../views/starUser/starUser.vue'),
    redirect: '/starUser/carOwner',
    children: [
      {
        name: 'carOwner',
        path: '/starUser/carOwner',
        meta: {
          title: '星级用户认证'
        },
        component: require('../views/starUser/child/carOwner.vue')
      },
      {
        name: 'carUser',
        path: '/starUser/carUser',
        meta: {
          title: '星级用户认证'
        },
        component: require('../views/starUser/child/carUser.vue')
      },
      {
        name: 'drivingLicense',
        path: '/starUser/drivingLicense',
        meta: {
          title: '星级用户认证'
        },
        component: require('../views/starUser/child/drivingLicense.vue')
      },
      {
        name: 'passerBy',
        path: '/starUser/passerBy',
        meta: {
          title: '星级用户认证'
        },
        component: require('../views/starUser/child/passerBy.vue')
      }
    ]
  },
  {                                                                                             // 星级用户认证微信版本路由
    name: 'starUser_WeChat',
    path: '/starUser_WeChat',
    meta: {
      title: '星级用户认证'
    },
    component: require('../views/starUser_WeChat/starUser.vue'),
    redirect: '/starUser_WeChat/carOwner',
    children: [
      {
        name: 'carOwner_WeChat',
        path: '/starUser_WeChat/carOwner',
        meta: {
          title: '星级用户认证'
        },
        component: require('../views/starUser_WeChat/child/carOwner.vue')
      },
      {
        name: 'carUser_WeChat',
        path: '/starUser_WeChat/carUser',
        meta: {
          title: '星级用户认证'
        },
        component: require('../views/starUser_WeChat/child/carUser.vue')
      },
      {
        name: 'drivingLicense_WeChat',
        path: '/starUser_WeChat/drivingLicense',
        meta: {
          title: '星级用户认证'
        },
        component: require('../views/starUser_WeChat/child/drivingLicense.vue')
      },
      {
        name: 'passerBy_WeChat',
        path: '/starUser_WeChat/passerBy',
        meta: {
          title: '星级用户认证'
        },
        component: require('../views/starUser_WeChat/child/passerBy.vue')
      }
    ]
  },
  {
    name: 'showpage',
    path: '/showpage',
    meta: {
      title: '详情'
    },
    component: require('../components/showpage.vue')
  }
]

export default homeRouter
