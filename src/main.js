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

import {GButton, GInput, Group, GSelect, GSelectOne, GUpload, GRadio, GDatePicker} from 'form'
import {Toast, Indicator, MessageBox, Swipe, Popup, SwipeItem, Cell, DatetimePicker} from 'mint-ui'
Vue.use(vueWechatTitle)
Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)
Vue.component(Popup.name, Popup)
Vue.component(DatetimePicker.name, DatetimePicker)
Vue.component('g-button', GButton)
Vue.component('g-input', GInput)
Vue.component('group', Group)
Vue.component('g-select', GSelect)
Vue.component('g-select-one', GSelectOne)
Vue.component('g-upload', GUpload)
Vue.component('g-radio', GRadio)
Vue.component('g-date-picker', GDatePicker)
Vue.component(Cell.name, Cell)
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
