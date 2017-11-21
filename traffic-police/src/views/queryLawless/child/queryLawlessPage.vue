<template>
  <div class="queryLawlessPage-outer">
    <!--Tab切换栏-->
    <div class="nav">
      <div class="nav-tab" :class="{ 'active': cur_tab == 'car'}" @click="cur_tab = 'car'">车牌号查询</div>
      <div class="nav-tab" :class="{ 'active': cur_tab == 'card'}" @click="cur_tab = 'card'">驾驶证查询</div>
    </div>
    <!--<div v-wechat-title="$route.meta.title"></div>-->
    <!--or-->
    <!--<router-view v-wechat-title="$route.meta.title"></router-view>-->
    <!--分类查询块-->
    <queryByCard v-if="cur_tab == 'card'"></queryByCard>
    <queryByCar v-else></queryByCar>
  </div>
</template>
<script>
  export default {
    name: 'queryTab',
    data () {
      return {
        cur_tab: 'car',
        diu: ''
      }
    },
    components: {
      'queryByCard': require('./queryByCard.vue'),
      'queryByCar': require('./queryByCar.vue')
    }
  }
</script>
<style lang="less" >
  .queryLawlessPage-outer {
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
