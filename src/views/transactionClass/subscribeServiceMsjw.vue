<template>
  <div class="subscribeServiceMsjw-outer">
    <div class="subscribeServiceMsjw-outer-nav">
      <div class="query-link">
        <router-link :to="{ path: '/userAgreement/jszbzhz', query: queryURL }">驾驶证补换证</router-link>
      </div>
      </div>
  </div>
</template>
<script>
  export default {
    name: 'transactionServiceMsjw',
    computed: {
      queryURL () {
        return this.$store.getters.queryURL
      }
    }
  }
</script>
<style lang="less" scopsd>
  @import '../../assets/style/subscribeServiceMsjw';
</style>
