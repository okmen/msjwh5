<template>
  <!-- 办理类-驾驶证业务导航页 -->
  <div class="carService-outer">
    <div class="query-link" :class="{ 'subscribeService': source === 'M'}">
      <router-link :to="{ path: '/applyInterimCard', query: queryURL }">申请机动车临牌</router-link>
    </div>
    <div class="query-link" :class="{ 'subscribeService': source === 'M'}">
      <router-link :to="{ path: '/userAgreement/szjj_hander_id', query: queryURL }">机动车委托异地定期检验申报</router-link>
    </div>
    <div class="query-link" :class="{ 'subscribeService': source === 'M'}">
      <router-link :to="{ path: '/userAgreement/szjj_hander_rim', query: queryURL }">补换检验合格标志</router-link>
    </div>
    <div class="query-link" :class="{ 'subscribeService': source === 'M'}">
      <router-link :to="{ path: '/userAgreement/szjj_hander_rmvp', query: queryURL }">补领机动车号牌</router-link>
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
