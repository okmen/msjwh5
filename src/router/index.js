import Vue from 'vue'
import Router from 'vue-router'
import publicRouter from './public'

Vue.use(Router)

export default new Router({
  routes: [
    ...publicRouter
  ]
})
