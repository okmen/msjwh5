<template>
  <div class="dealService-outer">
    <!--Tab切换栏-->
    <div class="nav">
      <div class="nav-tab" :class="{ 'active': cur_tab == 'takePicturesInform'}" @click="curTab('takePicturesInform')">随手拍举报</div>
      <div class="nav-tab"  :class="{ 'active': cur_tab == 'takePicturesQuery'}" @click="curTab('takePicturesQuery')">随手拍举报查询</div>
    </div>
    <component :is="currentView"></component>
  </div>
</template>
<script>
  import takePicturesInform from './takePicturesInform'
  import takePicturesQuery from './takePicturesQuery'
  export default {
    name: 'takePicturesTab',
    data () {
      return {
        currentView: 'takePicturesInform',
        cur_tab: 'takePicturesInform'
      }
    },
    methods: {
      curTab (str) {
        this.currentView = str
        this.cur_tab = str
      }
    },
    components: {
      takePicturesInform,
      takePicturesQuery
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
          color: #174ed0;
          border-bottom: 6px solid #174ed0;
        }
      }
    }
  }
</style>
