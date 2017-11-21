<!-- 
*  #变更类#
*  #网约车使用性质变更
 -->
<template>
  <div class="onlineAlter">
    <common @appointTaskClick="appointTask"
            :currentBusinessId="businessId"
            :currentBusinessCode="bussinessCode"
            :currentBusinessName="bussinessName"></common>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>
<script>
import { resultPost } from '../../../../service/getData'
import { createVehicleInfo } from '../../../../config/baseUrl.js'
import { Toast } from 'mint-ui'
import common from './child/common.vue'
export default {
  name: 'onlineAlter',
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
    appointTask: function (params, code, name) {
      params.businessCode = code
      params.businessName = name
      console.log('网约车', params)
      resultPost(createVehicleInfo, params).then(json => {
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
            reserveNo: number,                    // 流水号
            businessType: this.bussinessName,     // 预约业务名称
            numberPlate: carNumber,               // 车牌号码
            vehicleType: carType,                 // 车牌类型
            reserveAddress: place,                // 服务点
            appointmentAddress: address,          // 地址
            reserveTime: `${date} ${time}`,       // 预约日期
            mobilephone: params.bookerMobile,     // 手机号码
            appointmentPerson: name               // 预约人姓名
          }
          this.$store.commit('saveSuccessInfo', dataInfo)
          this.$router.push('/submitSuccess')
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

