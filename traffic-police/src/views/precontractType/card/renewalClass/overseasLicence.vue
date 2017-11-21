<!--
  持境外驾驶证申请换证
-->

<template>
  <div class="overseasLicence">
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
import { createDriveInfoZJ17 } from '../../../../config/baseUrl.js'
import { Toast } from 'mint-ui'
import common from './child/common.vue'
export default {
  name: 'overseasLicence',
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
      console.log('overseasLicence', params)
      resultPost(createDriveInfoZJ17, params).then(json => {
        if (json.code === '0000') {
          if (this.$root.$router.isWeChat) {
            window.location.href = json.msg
            return true
          }
          let dataInfo = {
            type: 2,
            reserveNo: json.data.waterNumber,    // 流水号
            businessType: this.nametypes,        // 业务类型
            reserveAddress: json.data.orgName,   // 服务点
            appointmentAddress: json.data.orgAddr,          // 预约地址
            reserveTime: `${json.data.appointmentDate} ${json.data.appointmentTime}`,      // 预约日期
            mobilephone: params.bookerMobile,   // 手机号码
            appointmentPerson: json.data.name
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
<style lang="less" scoped>
</style>
