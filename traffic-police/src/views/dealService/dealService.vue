<template>
  <div class="dealService-outer">
    <!--Tab切换栏-->
    <div class="nav">
      <div class="nav-tab" :class="{ 'active': cur_tab == 'car'}" @click="cur_tab = 'car'">机动车业务</div>
      <div class="nav-tab" :class="{ 'active': cur_tab == 'card'}" @click="cur_tab = 'card'">驾驶证业务</div>
      <div class="nav-tab" :class="{ 'active': cur_tab == 'progress'}" @click="linkToProgress">办理进度查询</div>
    </div>
    <carService v-if="cur_tab == 'car'"></carService>
    <cardService v-else></cardService>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>
<script>
  export default {
    name: 'serviceTab',
    data () {
      return {
        cur_tab: 'car'
      }
    },
    methods: {
      linkToProgress: function () {
        if (window.localStorage.getItem('isLogin')) {
          this.cur_tab = 'progress'
          this.$router.push(/_WeChat/g.test(this.$route.name) ? '/queryProgress_WeChat' : '/queryProgress')
          return
        } else {
          this.$router.push('/login_dealService')
          return
        }
      }
    },
    components: {
      'carService': require('./child/carService.vue'),
      'cardService': require('./child/cardService.vue')
    }
  }
</script>
<style lang="less" >
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
        width: 33%;
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
