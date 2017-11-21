<!--  *换领机动车登记证书 -->
<template>
  <div class="renewingCollarCredential">
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
  name: 'renewingCollarCredential',
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
      console.log('renewingCollarCredential', params)
      resultPost(createVehicleInfo, params).then(json => {
        console.log(json)
        if (json.code === '0000') {
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
          this.$router.push('/submitSuccess')
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