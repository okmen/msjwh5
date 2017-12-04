import Vue from 'vue'
import Router from 'vue-router'
import publicRouter from './public'
import transactionClass from './transactionClass/drivingLicence'

Vue.use(Router)

export default new Router({
  routes: [
    ...publicRouter,
    ...transactionClass
  ]
})
