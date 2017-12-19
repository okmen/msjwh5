// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import vueWechatTitle from 'vue-wechat-title'

import './config/detect-browser'
import './config/rem'
import './utils/regExp'
import './utils/utils'
import './utils/M-wx'
import './utils/axios'
import './utils/WX.config'

import {Toast, Indicator, MessageBox, Swipe, SwipeItem} from 'mint-ui'
Vue.use(vueWechatTitle)
Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)
Vue.prototype.$toast = Toast
Vue.prototype.$MessageBox = MessageBox

window.addEventListener('popstate', function (e) { // 监听手机返回按钮, 清除loading效果
  Indicator.close()
  MessageBox.close()
}, false)

Vue.config.productionTip = false

/* eslint-disable no-new */
window.VM = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
