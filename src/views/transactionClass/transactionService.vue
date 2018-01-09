<!--
  办理类-驾驶证业务导航页 ~
-->
<template>
  <div class="carService-outer">
    <div class="query-link" :class="{ 'subscribeService': source === 'M'}">
      <router-link :to="{ path: '/applyEveryMonth', query: queryURL }">申请通行证(外地车)</router-link>
    </div>
    <div class="query-link" :class="{ 'subscribeService': source === 'M'}">
      <router-link :to="{ path: '/applyInterimCard', query: queryURL }">办理临时行驶车号牌</router-link>
    </div>
    <div class="query-link" :class="{ 'subscribeService': source === 'M'}">
      <router-link :to="{ path: '/userAgreement/szjj_hander_id', query: queryURL }">委托核发机动车检验合格标志</router-link>
    </div>
    <div class="query-link" :class="{ 'subscribeService': source === 'M'}">
      <router-link :to="{ path: '/userAgreement/szjj_hander_cvi', query: queryURL }">核发机动车检验合格标志</router-link>
    </div>
    <div class="query-link" :class="{ 'subscribeService': source === 'M'}">
      <router-link :to="{ path: '/userAgreement/szjj_hander_rmvp', query: queryURL }">办理补领、换领机动车号牌</router-link>
    </div>
    <div class="query-link" v-if="source === 'G'">
      <router-link :to="{ path: '/userAgreement/jszns', query: queryURL }">机动车驾驶证年度审验</router-link>
    </div>
    <div class="query-link" :class="{ 'subscribeService': source === 'M'}">
      <router-link :to="{ path: '/repairDrivingLicense', query: queryURL }">补领行驶证</router-link>
    </div>
    <div class="query-link" :class="{ 'subscribeService': source === 'M'}">
      <router-link :to="{ path: '/exchangeDrivingLicense', query: queryURL }">换领行驶证</router-link>
    </div>
    <div class="query-link" :class="{ 'subscribeService': source === 'M'}">
      <router-link :to="{ path: '/replaceQualifiedMark', query: queryURL }">补换检验合格标志</router-link>
    </div>
    <div class="query-link" :class="{ 'subscribeService': source === 'M'}">
      <router-link :to="{ path: '/userAgreement/szjj_hander_iccc', query: queryURL }">机动车联系方式变更</router-link>
    </div>
    <div class="query-link" :class="{ 'subscribeService': source === 'M'}">
      <router-link :to="{ path: '/freeForFirst', query: queryURL }">首违免罚查询</router-link>
    </div>
    <div class="query-link" :class="{ 'subscribeService': source === 'M'}">
      <router-link :to="{ path: '/moveCar', query: queryURL }">一键挪车</router-link>
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
