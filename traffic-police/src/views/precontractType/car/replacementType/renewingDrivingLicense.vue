<!-- 补换机动车行驶证 -->

<template>
  <div class="renewingDrivingLicense">
    <common 
      @submitClick="subFn"
      :currentBusinessId="businessId"
      :currentCode="businessCode"
    ></common>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>

<script>
import { resultPost } from '../../../../service/getData'
import { createVehicleInfo } from '../../../../config/baseUrl.js'
import { Toast } from 'mint-ui'
import common from './child/common.vue'
export default {
  name: 'renewingDrivingLicense',
  props: ['businessId', 'businessCode'],    // 拿到当前业务的id  然后传给 common组件
  data () {
    return {
    }
  },
  components: {
    common
  },
  mounted () {
    this.nametypes = this.$route.query.name
  },
  methods: {
    subFn: function (params) {
      console.log('renewingDrivingLicense', params)
      resultPost(createVehicleInfo, params).then(json => {
        console.log(json)
        if (json.code === '0000') {
          this.certificate = json.data
          let dataInfo = {
            type: 2,
            reserveNo: json.data.waterNumber,    // 流水号
            businessType: this.nametypes,         // 业务类型
            numberPlate: json.data.platNumber,    // 车牌号码
            vehicleType: json.data.carTypeName,   // 车辆类型
            reserveAddress: json.data.orgName,     // 服务点
            appointmentAddress: json.data.orgAddr,  // 预约地址
            reserveTime: `${json.data.appointmentDate} ${json.data.appointmentTime}`,  // 预约日期
            mobilephone: params.bookerMobile,   // 手机号码
            appointmentPerson: json.data.name   // 预约人
          }
          this.$store.commit('saveSuccessInfo', dataInfo)
          this.$root.$router.isWeChat ? window.location.href = json.msg : this.$router.push('/submitSuccess')
        } else {
          Toast({message: json.msg, position: 'bottom', className: 'white'})
        }
      })
    }
  }
}
</script>
<style lang="css" scoped>
</style>