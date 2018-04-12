<template>
  <div class="dieselEngineTrucksTab-outer">
    <!--Tab切换栏-->
    <div class="nav">
      <div class="nav-tab" :class="{ 'active': cur_tab == 'car'}" @click="cur_tab = 'car'">申请电子通行证</div>
      <div class="nav-tab" :class="{ 'active': cur_tab == 'card'}" @click="cur_tab = 'card'">业务查询</div>
    </div>
    <carService v-if="cur_tab == 'car'"></carService>
    <cardService v-else></cardService>
  </div>
</template>
<script>
  import carService from './dieselEngineTrucks.vue'
  import cardService from './dieselEngineTrucksDemand.vue'
  export default {
    name: 'dieselEngineTrucksTab',
    data () {
      return {
        cur_tab: 'car'
      }
    },
    components: {
      carService,
      cardService
    }
  }
</script>
<style lang="less" >
  .dieselEngineTrucksTab-outer {
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
