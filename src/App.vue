<template>
  <div id="app">
    <template v-if="showpage"><router-view v-wechat-title="$route.meta.title"/></template>
    <template v-else>
      <div class="m-noLoadingPage">{{ msg }}</div>
    </template>
    <!-- <div @click="handleLogout" style="position: fixed; bottom: 0px; right: 0;">民生警务退出登录</div> -->
    <!-- <div @click="handleLogoutG" style="position: fixed; bottom: 0px; left: 0;">高德退出</div> -->
  </div>
</template>

<script>
import { getUserM } from '@/config/baseURL'
import { token, msjwURL, authURL } from '@/config/msjw.config'
import { getQueryString } from '@/utils/utils'
export default {
  name: 'app',
  data () {
    return {
      showpage: false,
      token: token,
      openid: window.localStorage.getItem('openid'),
      msg: '正在加载数据中 ...',
      authStatusTag: {
        '1': '无效用户',
        '2': '未认证',
        '3': '已认证',
        '4': '认证中',
        '5': '认证失败'
      }
    }
  },
  created () {
    // 添加弹窗
    this.init()
    let { source } = this.$store.state.core
    let localStorage = window.localStorage
    console.log('当前来源:', source)
    // 如果来源参数正常，则显示页面。否则显示为来源错误。
    if (source === 'M') {
      this.$axios.post(getUserM, {
      // this.$axios.post('http://192.168.1.99:8080/web/msjw/getMSJWinfo.html', {
        openId: this.openid
      }).then(data => {
        if (data.code === '0000') {
          this.showpage = true
          this.$store.dispatch('updataUserG', data.data)
        }
        if (data.code === '400') {
          let entranceURL = window.location.href
          let URL = `${msjwURL}/yhtx/html/login.html?resbind=ssjj&openid=${this.openid}&token=${this.token}&redirect=${entranceURL}`
          localStorage.setItem('entranceURL', entranceURL)
          window.location.href = URL
        }
        if (data.code === '0002') {
          this.msg = '正在跳转实名认证页面 ...'
          this.$MessageBox({
            title: '实名认证状态错误',
            message: `当前：${this.authStatusTag[data.data.authStatus]}`,
            confirmButtonText: '前往实名认证',
            closeOnClickModal: false
          }).then(() => {
            window.location.href = authURL
          })
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
    // 如果存在 username 则跳转路径
    if (getQueryString('username')) {
      this.msg = '授权成功，正在跳转 ...'
      window.location.href = window.localStorage.getItem('entranceURL')
    }
  },
  methods: {
    // 弹窗用原生样式，每天弹3次
    init () {
      let oTimer = window.localStorage.getItem('voteTime')
      if (oTimer) {
        oTimer = new Date(oTimer)
        let nTimer = new Date()
        if (nTimer.getFullYear() > oTimer.getFullYear() || nTimer.getMonth() > oTimer.getMonth() || nTimer.getDate() > oTimer.getDate()) {
          window.localStorage.removeItem('voteTime')
          window.localStorage.removeItem('vote')
          this.instart()
        } else {
          if (window.localStorage.getItem('vote') === 'NaN' || window.localStorage.getItem('vote') === 'undefined') {
            this.localVote = 0
            this.instart()
          } else {
            if (window.localStorage.getItem('vote') < 3) {
              this.localVote = window.localStorage.getItem('vote')
              this.instart()
            }
          }
        }
      } else {
        this.instart()
      }
    },
    instart: function () {
      let _this = this
      this.$MessageBox({
        title: '温馨提示',
        confirmButtonText: '好的',
        message: '根据2018年春节法定节假期的安排，网上交警、微信等渠道受理的车管业务于2018年2月15日-2月21起后台暂停处理，于2月22日起恢复正常。请广大车主、驾驶人合理安排申办业务时间，如急需办理业务的，请提前于2月15日前到各车管窗口办理业务，以免对假期出行造成影响。不便之处，敬请谅解，祝佳节愉快！'
      }).then(action => {
        console.log(_this.localVote)
        _this.localVote = +_this.localVote + 1
        window.localStorage.setItem('vote', _this.localVote)
        window.localStorage.setItem('voteTime', new Date())
      })
    },
    handleLogout () {
      let nAxios = this.$axios.create({
        headers: {
          'Content-Type': 'application/json'
        }
      })
      nAxios.post(`${msjwURL}/govnetUserAuthProvider/services/userCenter/logout`, {
        openid: this.openid,
        token: this.token
      }).then(data => {
        if (data.data.code === '200') {
          window.location.reload()
        }
      })
    },
    handleLogoutG () {
      this.$MessageBox.confirm('确定退出登录吗?').then(action => {
        console.log(action)
        window.localStorage.clear()
        this.$router.push({ path: '/login?source=G', query: { url: this.$route.fullPath } })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="less">
@import './assets/style/base';
@import "./assets/style/formTemplate";
</style>
