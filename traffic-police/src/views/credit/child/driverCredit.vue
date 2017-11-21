<template>
  <div class="driverCredit">
    <div class="ip-inform-item" v-for="(item, index) in list">
      <div class="ip-inform-title">{{item.name}}</div>
      <div class="ip-inform-content">
        <input type="text" class="ip-inform-only" readonly :value="item.value" style="background: #efeff4">
      </div>
    </div>
    <div class="submit" @click="submit">
      提 &nbsp交
    </div>
    <div class="warm-prompt">
      <div class="warm-prompt-title">温馨提示：</div>
      <div class="warm-prompt-content">进度查询请前往“个人中心”的“我的业务”</div>
    </div>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>
<script>
  import { resultPost } from '../../../service/getData'
  import { MessageBox } from 'mint-ui'
  import { addSafeAccidentCredit, submitApplicationForDriverInformation, addNoneCarCertification } from '../../../config/baseUrl'
  export default {
    data () {
      return {
        userName: '',
        IDcard: '',
        phoneNumber: ''
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => vm.$store.commit('getUserInfo', to))
    },
    computed: {
      list () {
        let userInfo = this.$store.state.userInfo
        return [
          {name: '申请类型', value: userInfo.applicationType},
          {name: '姓名', value: userInfo.userName},
          {name: '身份证号', value: userInfo.IDcard},
          {name: '联系电话', value: userInfo.phoneNumber}
        ]
      }
    },
    watch: {
      popupMsg (val) {
        if (val === false) {
          this.$router.push('/')
        }
      }
    },
    methods: {
      submit () {
        let userInfo = this.$store.state.userInfo
        let applyType, url
        if (userInfo.applicationType === '驾驶人安全事故信用表') {
          applyType = '4'
          url = addSafeAccidentCredit
        } else if (userInfo.applicationType === '驾驶人信用单') {
          applyType = '1'
          url = submitApplicationForDriverInformation
        } else if (userInfo.applicationType === '无车证明') {
          applyType = '3'
          url = addNoneCarCertification
        }
        let obj = {
          applyName: userInfo.userName,
          identityCard: userInfo.IDcard,
          applyPhone: userInfo.phoneNumber,
          applyType: applyType
        }
        resultPost(url, obj).then(
            json => {
              console.log(json)
              if (json.code === '0000') {
                let appoinSuccess = this.$store.state.appoinSuccess
                appoinSuccess.appoinType = userInfo.applicationType
                appoinSuccess.appoinNum = json.msg.replace(/[^0-9]/ig, '')
                this.$router.push('/appointSuccess')
              } else if (json.code === '0001') {
                MessageBox({
                  title: '提示',
                  message: json.msg
                }).then(action => {
                  this.$router.push('/')
                })
              }
            }
        )
      }
    }
  }
</script>
<style lang="less" scoped>
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
  .submit{
    margin: 68px 50px 0px;
    height: 80px;
    width: 650px;
    background: rgb(38,150,221);
    text-align: center;
    line-height: 80px;
    color: white;
    font-size: 30px;
    border-radius: 10px;
  }
  .driverCredit{
    background: white;
    height: 100%;
    padding-top: 30px;
  }
  input {
    color:gray;
  }
  .ip-inform-title {
    font-size: 30px;
    width: 135px;
  }
  .ip-inform-content {
    width: 485px;
    display: flex;
    justify-content: space-between;
  }
  .ip-inform-item{
    height: 96px;
    display: flex;
    margin-left: 50px;
    margin-right: 50px;
    justify-content: space-between;
    align-items: center;
  }
  .ip-inform-only {
    width: 100%;
    height: 60px;
    border-radius: 8px;
    padding: 0 22px;
  }
</style>
