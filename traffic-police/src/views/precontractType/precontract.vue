<template>
  <div class="dealService-outer">
    <!--Tab切换栏-->
    <div class="nav" v-if="!isWeChat">
      <div class="nav-tab" :class="{ 'active': cur_tab == 'car'}" @click="changeTab('car')">机动车业务</div>
      <div class="nav-tab" :class="{ 'active': cur_tab == 'card'}" @click="changeTab('card')">驾驶证业务</div>
      <div class="nav-tab" :class="{ 'active': cur_tab == 'progress'}" @click="changeTab('progress')">预约查询及取消</div>
    </div>
    <carService v-if="cur_tab == 'car'" @initSuccess="renderSuccess"></carService>
    <cardService v-else-if="cur_tab == 'card'"></cardService>
    <queryAndCancel v-else></queryAndCancel>
    <div v-wechat-title="$route.meta.title"></div>
    <page-bottom v-if="isWeChat" :class="{positionBottom: positionBottom}"></page-bottom>
  </div>
</template>
<script>
  export default {
    name: 'serviceTab',
    watch: {
      cur_tab (val) {
        this.$route.meta.title = this.currentTab[val]
      }
    },
    computed: {
      isWeChat: function () {
        return /_WeChat/g.test(this.$route.name)
      }
    },
    data () {
      return {
        currentTab: {
          car: '机动车业务',
          card: '驾驶证业务',
          progress: '预约查询及取消'
        },
        cur_tab: 'progress',
        positionBottom: false
      }
    },
    methods: {
      renderSuccess: function () {
        if (this.isWeChat) {
          this.positionBottom = (document.getElementById('app').offsetHeight - document.getElementsByClassName('dealService-outer')[0].offsetHeight) > document.getElementsByClassName('tp-bottom')[0].offsetHeight
        }
      },
      changeTab: function (str) {
        this.cur_tab = str
        this.$nextTick(function () {
          if (this.isWeChat) {
            this.positionBottom = (document.getElementById('app').offsetHeight - document.getElementsByClassName('dealService-outer')[0].offsetHeight) > document.getElementsByClassName('tp-bottom')[0].offsetHeight
          }
        })
      }
    },
    mounted () {
      this.$root.$router.isWeChat = this.isWeChat
      this.cur_tab = this.$route.params.id === 'progress' ? 'progress' : 'car'
      this.$route.meta.title = this.currentTab[this.cur_tab]
      this.$nextTick(function () {
        if (this.isWeChat) {
          this.positionBottom = (document.getElementById('app').offsetHeight - document.getElementsByClassName('dealService-outer')[0].offsetHeight) > document.getElementsByClassName('tp-bottom')[0].offsetHeight
        }
      })
    },
    // methods: {
    //   linkToProgress: function () {
    //     this.cur_tab = 'progress'
    //     this.$router.push('/queryProgress')
    //   }
    // },
    components: {
      'carService': require('./carService.vue'),
      'cardService': require('./cardService.vue'),
      'queryAndCancel': require('./queryAndCancel.vue'),
      'pageBottom': require('../../components/pageBottom.vue')
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
    .tp-bottom{
      margin-top: 28px;
    }
    .positionBottom{
      margin-top: 0;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
</style>
