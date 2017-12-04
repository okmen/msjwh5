<template>
  <div id="app">
    <template v-if="showpage"><router-view/></template>
    <template v-else>{{ msg }}</template>
  </div>
</template>

<script>
import { getUserM } from '@/config/baseURL'
export default {
  name: 'app',
  data () {
    return {
      showpage: false,
      msg: '来源错误'
    }
  },
  created () {
    let { idCard, openId, source } = this.$store.state.core
    let localStorage = window.localStorage
    console.log('当前来源:', source)
    // 如果来源参数正常，则显示页面。否则显示为来源错误。
    if (idCard && openId && source === 'M') {
      this.showpage = true
      this.$axios.post(getUserM, {
        identityCard: idCard
      }).then(data => {
        if (data.code === '0000') {
          this.$store.dispatch('updataUserG', data.data)
        }
      })
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
        isLogin: localStorage.getItem('isLogin')
      })
    }
  }
}
</script>

<style lang="less">
@import './assets/style/base';
@import "./assets/style/formTemplate";
</style>
