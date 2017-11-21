let takePicturesTipsRouter = [
  // 随手拍功能微信版本路由
  {
    name: 'takePicturesTips_WeChat',                                                         // 微信版本
    path: '/takePicturesTips_WeChat',
    meta: {
      title: '随手拍举报'
    },
    component: require('../views/takePictures_WeChat/child/takePicturesTips.vue')
  },
  {
    name: 'takePicturesSuccess_WeChat',                                                      // 微信版本
    path: '/takePicturesSuccess_WeChat',
    meta: {
      title: '随手拍举报'
    },
    component: require('../views/takePictures_WeChat/child/takePicturesSuccess.vue')
  },
  {
    name: 'takePicturesSuccess1_WeChat',                                                     // 微信版本
    path: '/takePicturesSuccess1_WeChat',
    meta: {
      title: '随手拍举报'
    },
    component: require('../views/takePictures_WeChat/child/takePicturesSuccess1.vue')
  },
  {
    name: 'takePicturesInform_WeChat',                                                       // 微信版本
    path: '/takePicturesInform_WeChat',
    meta: {
      title: '随手拍举报'
    },
    component: require('../views/takePictures_WeChat/takePicturesInform')
  },
  {
    name: 'map_WeChat',                                                                      // 微信版本
    path: '/map_WeChat',
    meta: {
      title: '地图'
    },
    component: require('../views/takePictures_WeChat/map.vue')
  },
  {
    name: 'takePicturesQuery_WeChat',                                                        // 微信版本
    path: '/takePicturesQuery_WeChat',
    meta: {
      title: '随手拍查询'
    },
    component: require('../views/takePictures_WeChat/child/takePicturesQuery')
  },
  {
    name: 'takePicturesSuccess1',                                                                // 举报成功外部链接
    path: '/takePicturesSuccess1',
    meta: {
      title: '随手拍举报成功'
    },
    component: require('../views/takePictures/child/takePicturesSuccess1.vue')
  },
  {
    name: 'takePicturesInform',
    path: '/takePicturesInform',
    meta: {
      title: '随手拍举报'
    },
    component: require('../views/takePictures/takePicturesInform')
  },
  {
    name: 'takePicturesQuery',
    path: '/takePicturesQuery',
    meta: {
      title: '随手拍查询'
    },
    component: require('../views/takePictures/child/takePicturesQuery')
  },
  {
    name: 'map',
    path: '/map',
    meta: {
      title: '地图'
    },
    component: require('../views/takePictures/map.vue')
  },
  {
    name: 'takePicturesTips',
    path: '/takePicturesTips',
    meta: {
      title: '随手拍举报'
    },
    component: require('../views/takePictures/child/takePicturesTips.vue')
  },
  {
    name: 'takePicturesSuccess',
    path: '/takePicturesSuccess',
    meta: {
      title: '随手拍举报成功'
    },
    component: require('../views/takePictures/child/takePicturesSuccess.vue')
  }
]

export default takePicturesTipsRouter
