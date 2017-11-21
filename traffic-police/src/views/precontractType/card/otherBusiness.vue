<!--
* 其它业务
 -->
<template>
  <div id="otherBusiness">
    <div class="alter-select pad-side-50">
      <div class="alter-chose"><span>业务类型</span></div>
      <div class="alter-wd bg-white">
        <p>此界面提供：信息变更、延期换证、期满换证、规定年龄换证、
        损坏换证、遗失补证、注销业务、降驾换证、转入换证的预约</p>
      </div>
    </div>
    <div class="alter-from">
      <common @appointTaskClick="appointTask"
              :currentBusinessId="businessId"
              :currentBusinessCode="bussinessCode"></common>
    </div>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>
<script>
import { resultPost } from '../../../service/getData'
import { createDriveInfoZJ20 } from '../../../config/baseUrl.js'
import { Toast } from 'mint-ui'
import common from './recoverDrive/child/common.vue'
export default {
  name: 'otherBusiness',
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
      console.log('其它业务', params)
      resultPost(createDriveInfoZJ20, params).then(json => {
        if (json.code === '0000') {
          if (this.$root.$router.isWeChat) {
            window.location.href = json.msg
            return true
          }
          console.log(json)
          let time = json.data.appointmentTime
          let date = json.data.appointmentDate
          let dataInfo = {
            type: 2,
            reserveNo: json.data.waterNumber,      // 流水号
            businessType: this.bussinessName,      // 预约业务名称
            reserveAddress: json.data.orgName,     // 服务点
            appointmentAddress: json.data.orgAddr, // 具体地址
            reserveTime: `${date} ${time}`,        // 预约日期
            mobilephone: params.bookerMobile,      // 手机号码
            appointmentPerson: json.data.name      // 预约人姓名
          }
          this.$store.commit('saveSuccessInfo', dataInfo)
          this.$router.push('/submitSuccess')
        } else {
          Toast({message: json.msg, className: 'white'})
        }
      })
    }
  }
}
</script>
<style lang="less">
#otherBusiness {
  font-size: 26px;
  color: #000;
  overflow: hidden;
  .bg-white{
    background-color: #FFF;
  }
  .alter-select {
    height: 260px;;
    background-color: #fff;
    position: relative;
    padding-left: 230px;
    padding-top: 20px;
    .alter-chose{
      width: 180px;
      position: absolute;
      left: 50px;
      color: #666;
      line-height: 100px;
      span{
        font-size: 28px;
      }
    }
    .alter-wd{
      padding:0 15px;
      line-height: 54px;
      border: 1px solid #e2e2e7;
      border-radius: 10px;
      font-size: 26px;
    }
  }
  .alter-from{
    background:#FFF;
    margin-top:10px;
  }
}
</style>
