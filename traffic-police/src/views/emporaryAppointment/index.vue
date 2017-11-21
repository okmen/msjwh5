<template>
  <div id="emporary-appointment">
    <div class="nav">
      <router-link  class="nav-tab" to="/emporaryAppointment/makeAppointment" >临时预约</router-link>
      <router-link  class="nav-tab" to="/emporaryAppointment/queryAppointment" >预约查询</router-link>
    </div>
    <router-view class="view"></router-view>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>

<script>
  export default {
    name: 'emporaryAppointment',
    data () {
      return {
        diu: ''
      }
    }
  }
</script>

<style lang="less" scoped>
  #app{
    width: 100%;
    height: 100%;
  }
  #emporary-appointment{
    width: 100%;
    min-height: 100%;
    position: relative;
    .nav{
      font-size: 0;
      background-color:#fff;
      border-bottom:1px solid #dbdbdb;
      .nav-tab {
        font-size: 32px;
        font-weight: 600;
        display: inline-block;
        width: 50%;
        text-align: center;
        height: 100px;
        line-height: 100px;
        color: #b0b0b0;
        &.router-link-active {
          color: #2696dd;
          border-bottom: 6px solid #2696dd;
          box-sizing: border-box;
        }
      }
    }
  }
</style>
