<template>
  <div class="carService-outer">
    <div class="query-link">
      <router-link :to="{ path: '/userAgreement/jszbzhz', query: queryURL }">驾驶证补换证</router-link>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'carService',
    computed: {
      queryURL () {
        return this.$store.getters.queryURL
      }
    }
  }
</script>
<style lang="less" scopsd>
  @import '../../assets/style/subscribeService';
</style>
