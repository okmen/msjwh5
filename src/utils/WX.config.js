import wx from 'weixin-js-sdk'
import axios from '@/utils/axios'

/* eslint-disable */
let ua = window.navigator.userAgent; //浏览器版本
let url = window.location.href;
let data = {
  hostUrl: encodeURIComponent(url.split('#')[0]),
}

if (/MicroMessenger/i.test(ua)) {
  wxConfig();
}

function wxConfig() {
  if (process.env.type === 'test') {
    URL = `http://testjava.chudaokeji.com/h5/sdkConfig.html?url=${data.hostUrl}`
  } else {
    URL = `http://gzh.stc.gov.cn/api/h5/sdkConfig.html?url=${data.hostUrl}`
  }
  axios.post(URL).then((r) => { // 交警环境
    if (r.code == '0000') {
      var res = r.data;
      wx.config({
        debug: false,
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
