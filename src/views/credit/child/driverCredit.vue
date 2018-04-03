<template>
  <div class="driverCredit">
    <g-input title="申请类型" v-model="applyType" readonly></g-input>
    <g-input title="姓名" v-model="userName" readonly></g-input>
    <g-input title="身份证号" v-model="identityCard" readonly></g-input>
    <g-input title="联系电话" v-model="mobilePhone" readonly></g-input>
    <g-button text="提交" @click.native="confirmInfo"></g-button>
    <div class="warm-prompt">
      <div class="warm-prompt-title">温馨提示：</div>
      <div class="warm-prompt-content">进度查询请前往“个人中心”的“我的业务”</div>
    </div>
  </div>
</template>

<script>
  import { addSafeAccidentCredit, submitApplicationForDriverInformation, addNoneCarCertification } from '@/config/baseURL.js'
  export default {
    data () {
      return {
        applyType: '',
        userName: '',
        identityCard: '',
        mobilePhone: ''
      }
    },
    computed: {
      user () {
        return Object.assign({}, this.$store.state.user)
      }
    },
    created () {
      this.applyType = this.$route.meta.title
      this.userName = this.user.userName
      this.identityCard = this.user.identityCard
      this.mobilePhone = this.user.mobilePhone
    },
    methods: {
      confirmInfo () {
        let applyTypeCurrent, url
        if (this.applyType === '驾驶人安全事故信用表') {
          applyTypeCurrent = '4'
          url = addSafeAccidentCredit
        } else if (this.applyType === '驾驶人信用单') {
          applyTypeCurrent = '1'
          url = submitApplicationForDriverInformation
        } else if (this.applyType === '无车证明') {
          applyTypeCurrent = '3'
          url = addNoneCarCertification
        }
        let obj = {
          applyName: this.userName,
          identityCard: this.identityCard,
          applyPhone: this.mobilePhone,
          applyType: applyTypeCurrent
        }
        console.log(url)
        this.$axios.post(url, obj).then(
            json => {
              console.log(json)
              if (json.code === '0000') {
                let appoinSuccess = this.$store.state.appoinSuccess
                appoinSuccess.appoinType = this.applyType.applicationType
                appoinSuccess.appoinNum = json.msg.replace(/[^0-9]/ig, '')
                this.$router.push({path: '/appointSuccess', query: this.queryURL})
              } else if (json.code === '0001') {
                this.$MessageBox({
                  title: '提示',
                  message: json.msg
                })
              }
            }
        )
      }
    }
  }
</script>

<style lang="less" scoped>
  .driverCredit{
    padding: 40px 0;
  }
  .warm-prompt{
    padding-top: 40px;
    margin-left: 50px;
    margin-right: 50px;
  }
  .warm-prompt-title{
    font-size: 30px;
    color: #333;
    line-height: 60px;
  }
  .warm-prompt-content{
    font-size: 26px;
    color: #666;
    text-indent: 2em;
  }
</style>
