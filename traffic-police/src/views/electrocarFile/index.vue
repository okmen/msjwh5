<template>
  <div class="electrocar-file">
    <div class="switch-header">
      <div class="switch-header-left " :class="{'switch-header-selected':currentView==dirverInfo}" @click="currentView=dirverInfo">司机信息</div>
      <div class="switch-header-right"  :class="{'switch-header-selected':currentView==carInfo}" @click="currentView=carInfo">车辆信息</div>
    </div>
    <component :is="currentView" :ebikeInfo="ebikeInfo" :userInfoList="userInfoList"></component>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>
<style lang="less" scoped>
  .electrocar-file{
    min-height: 100%;
    padding-top: 10px;
    background: white url('../../images/appointBack.png') left bottom/contain no-repeat;
    .switch-header{
      margin: 0 auto;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
  }
</style>
<script>
  import carInfo from './components/carInfo.vue'
  import dirverInfo from './components/dirverInfo.vue'
  import { resultPost } from 'src/service/getData'
  import { electrocarFileScancode } from 'src/config/baseUrl.js'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        currentView: dirverInfo,
        dirverInfo,
        carInfo,
        ebikeInfo: null,
        userInfoList: null
      }
    },
    mounted () {
      resultPost(electrocarFileScancode, {
        fileNo: this.$route.query.billNo
      }).then(data => {
        if (data.code === '0000') {
          this.ebikeInfo = data.data.ebikeInfo
          this.userInfoList = data.data.userInfoList
        } else {
          Toast({
            message: data.msg,
            position: 'middle',
            duration: 2000
          })
        }
      })
    }
  }
</script>
