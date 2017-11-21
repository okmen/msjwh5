<template>
  <div class="placeExamineCar-outer">
    <!--Tab切换栏-->
    <div class="nav">
      <div class="nav-tab" :class="{ 'active': cur_tab == 'car'}" @click="cur_tab = 'car'">机动车委托异地定期检验申报</div>
      <div class="nav-tab" :class="{ 'active': cur_tab == 'card'}" @click="cur_tab = 'card'">查询</div>
    </div>
    <carService v-if="cur_tab == 'car'"></carService>
    <cardService v-else></cardService>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>
<script>
  export default {
    name: 'placeExamineCar',
    data () {
      return {
        cur_tab: 'car'
      }
    },
    methods: {
    },
    components: {
      'carService': require('./placeExamine.vue'),
      'cardService': require('./placeExamineDemand.vue')
    }
  }
</script>
<style lang="less" >
  .placeExamineCar-outer {
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
        white-space: nowrap;
        text-overflow:ellipsis;
        overflow:hidden;
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
