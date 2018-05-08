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
  }
]

export default takePicturesTipsRouter
