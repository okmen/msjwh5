<template>
  <!-- 驾驶证类-驾驶证业务导航页 -->
  <div class="carService-outer">
    <div class="query-link" :class="{ 'subscribeService': source === 'M'}">
      <router-link :to="{ path: '/userAgreement/jszns', query: queryURL }">驾驶证年审</router-link>
    </div>
    <div class="query-link" :class="{ 'subscribeService': source === 'M'}">
      <router-link :to="{ path: '/userAgreement/jszbzhz', query: queryURL }">驾驶证补换证</router-link>
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
  .subscribeService {
    margin-left: 30px;
  }
</style>
