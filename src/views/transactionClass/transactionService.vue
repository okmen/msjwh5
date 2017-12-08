<template>
  <!-- 办理类-驾驶证业务导航页 -->
  <div class="carService-outer">
    <div class="query-link">
      <router-link :to="{ path: '/userAgreement/jszbzhz', query: queryURL }">驾驶证补换证</router-link>
    </div>
    <div class="query-link">
      <router-link :to="{ path: '/userAgreement/jszns', query: queryURL }">驾驶证年审</router-link>
    </div>
    <div class="query-link">
      <router-link :to="{ path: '/applyInterimCard', query: queryURL }">申请机动车临牌</router-link>
    </div>
    <div class="query-link">
      <router-link :to="{ path: '/userAgreement/szjj_hander_rmvp', query: queryURL }">补领机动车号牌</router-link>
    </div>
    <div class="query-link">
      <router-link :to="{ path: '/userAgreement/szjj_hander_rim', query: queryURL }">补换检验合格标志</router-link>
    </div>
    <div class="query-link">
      <router-link :to="{ path: '/userAgreement/szjj_hander_id', query: queryURL }">机动车委托异地定期检验申报</router-link>
    </div>
    <div class="query-link">
      <router-link :to="{ path: '/subscribeServiceMsjw', query: queryURL }">民生警务办理类服务</router-link>
    </div>
    <div class="query-link">
      <router-link :to="{ path: '/transactionServiceMsjw', query: queryURL }">民生警务预约类服务</router-link>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'cardService',
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
