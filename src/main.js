// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import vueWechatTitle from 'vue-wechat-title'

import './config/detect-browser'
import './config/rem'

import './utils/utils'
import './utils/axios'

// import { InfiniteScroll, Indicator, DatetimePicker, MessageBox, Swipe, SwipeItem, Popup, Loadmore, Cell } from 'mint-ui'
import {Toast, Indicator, MessageBox} from 'mint-ui'
Vue.use(vueWechatTitle)
// Vue.use(InfiniteScroll)
// Vue.component(DatePicker.name, DatePicker)
// Vue.component(DatetimePicker.name, DatetimePicker)
// Vue.component(Swipe.name, Swipe)
// Vue.component(SwipeItem.name, SwipeItem)
// Vue.component(Popup.name, Popup)
// Vue.component(Loadmore.name, Loadmore)
// Vue.component(Cell.name, Cell)
Vue.prototype.$toast = Toast
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
