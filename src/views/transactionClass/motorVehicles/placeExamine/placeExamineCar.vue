<template>
  <div class="dealService-outer">
    <!--Tab切换栏-->
    <!-- <div class="nav">
      <div class="nav-tab" :class="{ 'active': cur_tab == 'placeExamine'}" @click="curTab('placeExamine')">机动车委托异地定期检验申报</div>
      <div class="nav-tab" :class="{ 'active': cur_tab == 'placeExamineDemand'}" @click="curTab('placeExamineDemand')">查询</div>
    </div> -->
    <component :is="currentView"></component>
  </div>
</template>
<script>
  import placeExamineDemand from './placeExamineDemand'
  import placeExamine from './placeExamine'
  export default {
    name: 'serviceTab',
    data () {
      return {
        currentView: 'placeExamine',
        cur_tab: 'placeExamine'
      }
    },
    methods: {
      curTab (str) {
        this.currentView = str
        this.cur_tab = str
      }
    },
    components: {
      placeExamineDemand,
      placeExamine
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
