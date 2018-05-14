let takePicturesTipsRouter = [
  {
    name: 'takePicturesTips',
    path: '/takePicturesTips',
    meta: {
      title: '随手拍举报'
    },
    component: () => import('@/views/takePictures/takePicturesTips')
  },
  {
    name: 'takePicturesInform',
    path: '/takePicturesInform',
    meta: {
      title: '随手拍举报'
    },
    component: () => import('@/views/takePictures/takePicturesInform')
  },
  {
    name: 'takePicturesSuccess',
    path: '/takePicturesSuccess',
    meta: {
      title: '随手拍举报'
    },
    component: () => import('@/views/takePictures/takePicturesSuccess')
  },
  {
    name: 'takePicturesQuery',
    path: '/takePicturesQuery',
    meta: {
      title: '随手拍举报'
    },
    component: () => import('@/views/takePictures/takePicturesQuery')
  }
]

export default takePicturesTipsRouter
