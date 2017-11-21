<!-- 
*  #变更类#
*  #出租客运车辆使用性质变更
 -->
<template>
    <div class="taxiUserAlter">
      <common @appointTaskClick="appointTask"
              :currentBusinessId="businessId"
              :currentBusinessCode="bussinessCode"></common>
      <div v-wechat-title="$route.meta.title"></div>
    </div>
  </div>
</template>
<script>
import { resultPost } from '../../../../service/getData'
import { taxiAlter } from '../../../../config/baseUrl'
import common from './child/common.vue'
import { Toast } from 'mint-ui'
export default {
  name: 'taxiUserAlter',
  props: ['businessId', 'bussinessCode'],    // 拿到当前业务的id和code  然后传给 common组件
  data () {
    return {
    }
  },
  components: {
    common
  },
  mounted () {
  },
  methods: {
    appointTask: function (params, orderPlace) {  // 从 common 组件获取 reqData
      console.log('出租客运车辆使用性质变更', params)
      resultPost(taxiAlter, params).then(json => {
        console.log(json)
        if (json.code === '0000') {
          let dataInfo = {
            type: 2,
            reserveNo: json.data.waterNumber,    // 流水号
            numberPlate: params.platNumber,      // 车牌号码
            mobilephone: params.bookerMobile,    // 手机号码
            reserveAddress: orderPlace,          // 服务点
            reserveTime: json.data.bidDate       // 预约日期
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
