<template lang="html">
  <div class="confirmLawless-WeChat">
    <confirm-lawless></confirm-lawless>
    <page-bottom :class="{positionBottom: positionBottom}"></page-bottom>
  </div>
</template>

<script>
export default {
  components: {
    'confirmLawless': require('../../newQueryLawless/child/confirmLawless.vue'),
    'pageBottom': require('../../../components/pageBottom.vue')
  },
  data () {
    return {
      positionBottom: false
    }
  },
  mounted () {
    let isLogin = JSON.parse(window.localStorage.getItem('isLogin'))
    if (!isLogin) {
      this.$router.push('/login')
    }
    this.$nextTick(function () {
      this.positionBottom = document.getElementById('app').offsetHeight >= document.getElementsByClassName('confirmLawless-WeChat')[0].offsetHeight
    })
  }
}
</script>

<style lang="less">
  .positionBottom{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
