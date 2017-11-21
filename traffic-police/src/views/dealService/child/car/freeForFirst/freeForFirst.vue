<template>
  <div class="freeForFirst-outer">
    <!--Tab切换栏-->
    <div class="nav">
      <div class="nav-tab" :class="{ 'active': cur_tab == 'car'}" @click="cur_tab = 'car'">通过车辆查询</div>
      <div class="nav-tab" :class="{ 'active': cur_tab == 'card'}" @click="cur_tab = 'card'">通过序列号查询</div>
    </div>
    <freeByCar v-if="cur_tab == 'car'"></freeByCar>
    <freeByCode v-else></freeByCode>
    <div class="tp-look-tips">
      <router-link :to="getHash('/freeAbstract')">首违免罚介绍</router-link>
    </div>
    <div v-wechat-title="$route.meta.title"></div>
    <page-bottom v-if="isWeChat"></page-bottom>
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
    computed: {
      isWeChat: function () {
        return /_WeChat/g.test(this.$route.name)
      }
    },
    components: {
      'freeByCar': require('./freeByCar.vue'),
      'freeByCode': require('./freeByCode.vue'),
      'pageBottom': require('../../../../../components/pageBottom.vue')
    },
    methods: {
      getHash: function (hash) {
        if (/_WeChat/.test(this.$route.name)) {
          var hashArr = hash.split('/')
          return `/${hashArr[1]}_WeChat/${hashArr[2] || ''}`
        }
        return hash
      }
    }
  }
</script>
<style lang="less" scoped>
  .freeForFirst-outer {
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
    .tp-look-tips{
      width:100%;
      padding: 40px 0 40px 40px;
      a{
        font-size:26px;
        color:#24a6f8;
        text-decoration:underline;
      }
    }
  }


</style>
