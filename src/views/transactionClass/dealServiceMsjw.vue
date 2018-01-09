<!--
  驾驶证类-驾驶证业务导航页
-->
<template>
  <div class="carService-outer">
    <div class="query-link" :class="{ 'subscribeService': source === 'M'}">
      <router-link :to="{ path: '/userAgreement/jszns', query: queryURL }">机动车驾驶证年度审验</router-link>
    </div>
    <div class="query-link" :class="{ 'subscribeService': source === 'M'}">
      <router-link :to="{ path: '/userAgreement/jszbz', query: queryURL }">机动车驾驶证补办</router-link>
    </div>
    <div class="query-link" :class="{ 'subscribeService': source === 'M'}">
      <router-link :to="{ path: '/userAgreement/jszhz', query: queryURL }">机动车驾驶证换证</router-link>
    </div>
    <div class="query-link" :class="{ 'subscribeService': source === 'M'}">
      <router-link :to="{ path: '/userAgreement/jszyqhz', query: queryURL }">驾驶证延期换证</router-link>
    </div>
    <div class="query-link" :class="{ 'subscribeService': source === 'M'}">
      <router-link :to="{ path: '/userAgreement/jszzr', query: queryURL }">驾驶证转入</router-link>
    </div>
    <div class="query-link" :class="{ 'subscribeService': source === 'M'}">
      <router-link :to="{ path: '/userAgreement/jsrlxfsbg', query: queryURL }">驾驶人联系方式变更</router-link>
    </div>
    <div class="query-link" :class="{ 'subscribeService': source === 'M'}">
      <router-link :to="{ path: '/userAgreement/jszzyjj', query: queryURL }">驾驶证自愿降级</router-link>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'cardService',
    data () {
      return {
        source: ''
      }
    },
    computed: {
      queryURL () {
        return this.$store.getters.queryURL
      }
    },
    mounted () {
      this.source = this.$store.state.core.source
    }
  }
</script>
<style lang="less" scopsd>
  @import '../../assets/style/subscribeService';
</style>
