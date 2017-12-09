<template>
  <div id="app">
    <template v-if="showpage"><router-view v-wechat-title="$route.meta.title"/></template>
    <template v-else>{{ msg }}</template>
    <div @click="handleLogout" style="position: fixed; bottom: 0px; right: 0;">退出登录</div>
  </div>
</template>

<script>
import { getUserM } from '@/config/baseURL'
import { getQueryString } from '@/utils/utils'
export default {
  name: 'app',
  data () {
    return {
      showpage: false,
      token: 'f7ffc8ad-03a0-4ec0-9e5d-9da3500e4fbe',
      openid: window.localStorage.getItem('openid'),
      msg: '正在加载数据中'
    }
  },
  created () {
    let { source } = this.$store.state.core
    let localStorage = window.localStorage
    console.log('当前来源:', source)
    // 如果来源参数正常，则显示页面。否则显示为来源错误。
    if (source === 'M') {
      this.$axios.post(getUserM, {
        openId: this.openid
      }).then(data => {
        console.log(data)
        if (data.code === '0000') {
          this.showpage = true
          this.$store.dispatch('updataUserG', data.data)
        }
        if (data.code === '400') {
          let entranceURL = window.location.href
          let URL = `https://msjwt.szga.gov.cn/yhtx/html/login.html?resbind=ssjj&openid=${this.openid}&token=${this.token}&redirect=${entranceURL}`
          localStorage.setItem('entranceURL', entranceURL)
          window.location.href = URL
        }
      })
    // 高德来源
    } else if (source === 'G') {
      this.showpage = true
      this.$store.commit('updataUser', {
        cars: JSON.parse(localStorage.getItem('cars')),
        myNumberPlate: localStorage.getItem('myNumberPlate'),
        behindTheFrame4Digits: localStorage.getItem('behindTheFrame4Digits'),
        plateType: localStorage.getItem('plateType'),
        fileNumber: localStorage.getItem('fileNumber'),
        identityCard: localStorage.getItem('identityCard'),
        mobilePhone: localStorage.getItem('mobilePhone'),
        userName: localStorage.getItem('userName'),
        isLogin: localStorage.getItem('isLogin'),
        bindDriverLicence: localStorage.getItem('bindDriverLicence')
      })
    } else {
      this.msg = '来源错误'
    }
    // 如果存在 code 则显示正在授权中
    if (getQueryString('code')) {
      this.msg = '正在获取授权，请稍候 ...'
    }
    // 如果存在 identityId 则跳转路径
    if (getQueryString('identityId')) {
      window.location.href = window.localStorage.getItem('entranceURL')
    }
  },
  methods: {
    handleLogout () {
      let nAxios = this.$axios.create({
        headers: {
          'Content-Type': 'application/json'
        }
      })
      nAxios.post('https://msjwt.szga.gov.cn/govnetUserAuthProvider/services/userCenter/logout', {
        openid: this.openid,
        token: this.token
      }).then(data => {
        console.log(data)
        if (data.data.code === '200') {
          window.location.reload()
        }
      })
    }
  }
}
</script>

<style lang="less">
@import './assets/style/base';
@import "./assets/style/formTemplate";
</style>
