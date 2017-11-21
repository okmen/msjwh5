<template>
  <div class="esemptionCar-outer">
    <!--Tab切换栏-->
    <div class="nav">
      <div class="nav-tab" :class="{ 'active': cur_tab == 'car'}" @click="cur_tab = 'car'">六年免检申请</div>
      <div class="nav-tab" :class="{ 'active': cur_tab == 'card'}" @click="cur_tab = 'card'">查询及取消</div>
    </div>
    <carService v-if="cur_tab == 'car'"></carService>
    <cardService v-else></cardService>
    <div v-wechat-title="$route.meta.title"></div>
    <page-bottom v-if="isWeChat"></page-bottom>
  </div>
</template>
<script>
  export default {
    name: 'esemptionCar',
    computed: {
      isWeChat: function () {
        return /_WeChat/g.test(this.$route.name)
      }
    },
    data () {
      return {
        cur_tab: 'car'
      }
    },
    methods: {
      // linkToProgress: function () {
      //   this.cur_tab = 'progress'
      //   this.$router.push('/queryProgress')
      // }
    },
    components: {
      'carService': require('./exemption.vue'),
      'cardService': require('./exemptionDemand.vue'),
      'pageBottom': require('../../../../../components/pageBottom.vue')
    }
  }
</script>
<style lang="less" >
  .esemptionCar-outer {
    position: absolute;
    left: 0;
    right:0;
    top:0;
    background-color: #fff;
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
