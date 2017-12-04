<template>
  <div id="app">
    <template v-if="showpage"><router-view/></template>
    <template v-else>来源错误</template>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      showpage: false
    }
  },
  created () {
    let { idCard, openId, source } = this.$store.state.core
    console.log('当前来源:', source)
    // 如果来源参数正常，则显示页面。否则显示为来源错误。
    if (idCard && openId && source === 'M') {
      this.showpage = true
      this.$store.dispatch('updataUserM')
    }
  }
}
</script>

<style lang="less">
@import './assets/style/base';
@import "./assets/style/formTemplate";
</style>
