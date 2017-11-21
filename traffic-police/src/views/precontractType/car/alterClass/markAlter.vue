<!-- 
*  #变更类#
*  #机动车打刻原车辆 #识别代号# 变更备案
 -->
<template>
  <div class="markAlter">
    <common @appointTaskClick="appointTask"
            :currentBusinessId="businessId"
            :currentBusinessCode="bussinessCode"
            :currentBusinessName="bussinessName"></common>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>
<script>
import { resultPost } from '../../../../service/getData'
import { markAlter } from '../../../../config/baseUrl'
import common from './child/common.vue'
import { Toast } from 'mint-ui'
export default {
  name: 'markAlter',
  data () {
    return {
      businessId: '',      // 业务id
      bussinessCode: '',   // 业务code
      bussinessName: ''    // 业务名称
    }
  },
  components: {
    common
  },
  mounted () {
    var query = this.$route.query
    // console.log(query)
    this.businessId = query.id
    this.bussinessCode = query.code
    this.bussinessName = query.name
  },
  methods: {
    appointTask: function (params) {
      console.log('识别代号', params)
      resultPost(markAlter, params).then(json => {
        console.log(json)
        if (json.code === '0000') {
          let number = json.data.waterNumber
          let date = json.data.appointmentDate
          let place = json.data.orgName
          let time = json.data.appointmentTime
          let carType = json.data.carTypeName
          let name = json.data.name
          let address = json.data.orgAddr
          let carNumber = json.data.platNumber
          let dataInfo = {
            type: 2,
            reserveNo: number,                   // 流水号
            businessType: this.bussinessName,    // 预约业务名称
            numberPlate: carNumber,              // 车牌号码
            vehicleType: carType,                // 车牌类型
            reserveAddress: place,               // 服务点
            appointmentAddress: address,         // 地址
            reserveTime: `${date} ${time}`,      // 预约日期
            mobilephone: params.bookerMobile,    // 手机号码
            appointmentPerson: name              // 预约人姓名
          }
          this.$store.commit('saveSuccessInfo', dataInfo)
          this.$root.$router.isWeChat ? window.location.href = json.msg : this.$router.push('/submitSuccess')
        } else {
          Toast({ message: json.msg, className: 'white', duration: 1500 })
        }
      })
    }
  }
}
</script>
<style lang="less">

</style>
