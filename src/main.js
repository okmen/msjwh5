// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import vueWechatTitle from 'vue-wechat-title'
import axios from '@/utils/axios'
import wx from 'weixin-js-sdk'

import './config/detect-browser'
import './config/rem'
import './utils/regExp'
import './utils/utils'
import './utils/M-wx'
import './utils/axios'

// import { InfiniteScroll, Indicator, DatetimePicker, MessageBox, Swipe, SwipeItem, Popup, Loadmore, Cell } from 'mint-ui'
import {Toast, Indicator, MessageBox, Swipe, SwipeItem} from 'mint-ui'
Vue.use(vueWechatTitle)
// Vue.use(InfiniteScroll)
// Vue.component(DatePicker.name, DatePicker)
// Vue.component(DatetimePicker.name, DatetimePicker)
Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)
// Vue.component(Popup.name, Popup)
// Vue.component(Loadmore.name, Loadmore)
// Vue.component(Cell.name, Cell)
Vue.prototype.$toast = Toast
Vue.prototype.$MessageBox = MessageBox
/* eslint-disable */
let ua = window.navigator.userAgent; //浏览器版本
let url = window.location.href;
let data = {
  hostUrl: encodeURIComponent(url.split('#')[0]),
  hostUrl1: url.split('#')[1],
  url: encodeURIComponent(url),
  openIdURL: encodeURIComponent(url.split('?openId')[0])
}

if (/MicroMessenger/i.test(ua)) {
  wxConfig();
}

function wxConfig() {
  let URL = `http://testjava.chudaokeji.com/h5/sdkConfig.html?url=${data.hostUrl}`
  // if (process.env.type === 'test') {
  //   URL = `http://testjava.chudaokeji.com/h5/sdkConfig.html?url=${data.hostUrl}`
  // } else {
  //   URL = `http://gzh.stc.gov.cn/api/h5/sdkConfig.html?url=${data.hostUrl}`
  // }
  console.log(URL, '9999999999999999999')
  axios.post(URL).then((r) => { // 交警环境
    if (r.code == '0000') {
      console.log('saom')
      var res = r.data;
      wx.config({
        debug: true,
        appId: res.appId,
        timestamp: res.timestamp,
        nonceStr: res.noncestr,
        signature: res.signature,
        jsApiList: [
          'scanQRCode'
        ]
      });
    } else {
      alert('访问异常！');
    }
  })
}
/* eslint-enable */
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
