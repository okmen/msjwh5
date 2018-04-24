<template>
  <div class="early-outer">
    <!--Tab切换栏-->
    <div class="nav">
      <div class="nav-tab" :class="{ 'active': cur_tab == 'reserve'}" @click="cur_tab = 'reserve'">交通违法预约</div>
      <div class="nav-tab" :class="{ 'active': cur_tab == 'query'}" @click="cur_tab = 'query'">预约查询/取消</div>
    </div>
    <earlyLawless v-if="cur_tab == 'reserve'"></earlyLawless>
    <earlyLawlessQuery v-else></earlyLawlessQuery>
  </div>
</template>
<script>
  import earlyLawless from './illegalAppointment'
  import earlyLawlessQuery from './illegalSearch'
  export default {
    name: 'newEarly',
    data () {
      return {
        // cur_tab: this.$route.params.id === 'query' ? 'query' : 'reserve'
        cur_tab: 'reserve'
      }
    },
    components: {
      earlyLawless, earlyLawlessQuery
    }
  }
</script>
<style lang="less" scoped>
  .early-outer {
    .nav{
      font-size: 0;
      background-color:#fff;
      border-bottom:1px solid #dbdbdb;
      .nav-tab {
        font-size: 1rem;
        display: inline-block;
        width: 50%;
        text-align: center;
        height: 100px;
        line-height: 100px;
        &.active {
           color: #2696dd;
           border-bottom: 6px solid #2696dd;
         }
      }
    }
  }
</style>
