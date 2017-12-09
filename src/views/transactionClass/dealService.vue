<template>
  <div class="dealService-outer">
    <!--Tab切换栏-->
    <div class="nav">
      <div class="nav-tab" :class="{ 'active': cur_tab == 'transactionService'}" @click="curTab('transactionService')">办理类</div>
      <div class="nav-tab" :class="{ 'active': cur_tab == 'subscribeService'}" @click="curTab('subscribeService')">预约类</div>
    </div>
    <component :is="currentView"></component>
  </div>
</template>
<script>
  import subscribeService from './subscribeService'
  import transactionService from './transactionService'
  export default {
    name: 'serviceTab',
    data () {
      return {
        currentView: 'transactionService',
        cur_tab: 'transactionService'
      }
    },
    methods: {
      curTab (str) {
        this.currentView = str
        this.cur_tab = str
      }
    },
    components: {
      subscribeService,
      transactionService
    }
  }
</script>
<style lang="less" scopsd>
  .dealService-outer {
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
