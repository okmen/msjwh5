let dealServiceRouter = [
  {
    name: 'applyClass',
    path: '/applyClass/:id',
    meta: {
      title: '申请类'
    },
    component: resolve => { require(['@/views/dealService/child/car/applyClass/applyClass.vue'], resolve) }
  }
]

export default dealServiceRouter
