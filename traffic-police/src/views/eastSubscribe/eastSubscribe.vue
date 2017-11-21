<template>
    <div id="eastSubscribe-outer">
      <div class="nav">
        <div class="nav-tab" :class="{ 'active': cur_tab == 'appointmentTime'}" @click="cur_tab = 'appointmentTime'">预约</div>
        <div class="nav-tab" :class="{ 'active': cur_tab == 'inquireAppointmentTime'}" @click="cur_tab = 'inquireAppointmentTime'">预约查询</div>
      </div>
      <appointmentTime v-if="cur_tab == 'appointmentTime'"></appointmentTime>
      <inquireAppointmentTime v-else></inquireAppointmentTime>
      <div v-wechat-title="$route.meta.title"></div>
    </div>
</template>

<script>
export default {
  name: 'eastSubscribe',
  data () {
    return {
      cur_tab: 'appointmentTime',
      diu: ''
    }
  },
  components: {
    'appointmentTime': require('./child/appointmentTime.vue'),
    'inquireAppointmentTime': require('./child/inquireAppointmentTime.vue')
  }
}
</script>

<style lang="less" scoped>
#app{
  width: 100%;
  height: 100%;
}
#eastSubscribe-outer{
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
    &.active {
       color: #2696dd;
       border-bottom: 6px solid #2696dd;
       box-sizing: border-box;
     }
    }
  }
}
</style>
