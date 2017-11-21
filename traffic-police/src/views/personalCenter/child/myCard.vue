<template>
  <div class="myCard-outer" v-if="myCardShow">
    <div class="card-box">
      <ul>
        <li>
          档案编号:
          <span>{{ fileNumber }}</span>
        </li>
        <li>
          当前状态:
          <span :class="{ 'normal': status == '正常'}">{{ status }}</span>
        </li>
        <li>
          可用计分:
          <span :class="{ 'normal': availableScore == '12分'}">{{ availableScore }}</span>
        </li>
        <li>
          体检日期:
          <span>{{ physicalExaminationDate }}</span>
        </li>
        <li>
          有效日期:
          <span>{{ effectiveDate }}</span>
        </li>
      </ul>
      <!--<div class="own-card">{{ isReceive }}</div>-->
    </div>
  </div>
  <div v-else>
    <DriverCardNone></DriverCardNone>
  </div>
</template>
<style lang="less">
  .myCard-outer {
    margin-top: 40px;
    padding:0 50px;
    .card-box {
      font-size: 0.9rem;
      padding: 20px 40px;
      border:1px solid #a7d9f9;
      background-color: #fff;
      border-radius: 4px;
      ul {
        margin-left:15%;
        li {
          height: 70px;
          line-height: 70px;
          span {
            margin-left: 20px;
            text-align: left;
            &.normal {
              color: #09bb07;
             }
             /* 待添加更多状态样式 */
          }
        }
      }
      /*.own-card {*/
        /*text-align: right;*/
        /*margin-top: 60px;*/
        /*font-size: 0.9rem;*/
        /*color:#aaa;*/
      /*}*/
    }
  }
</style>
<script>
  import { bindCard, noPwdLogin } from '../../../config/baseUrl'
  import { resultPost, resultPostNoLoading } from '../../../service/getData'
  import { Indicator, Toast } from 'mint-ui'
  export default {
    name: 'myCard',
    data () {
      return {
        fileNumber: '',
        status: '',
        availableScore: '',
        physicalExaminationDate: '',
        mobilePhone: '',
        effectiveDate: '',
        isLogin: false,
        // 无驾驶证不显示信息
        myCardShow: false
//        isReceive: ''
      }
    },
    components: {
      DriverCardNone: require('./DriverCardNone.vue')
    },
    mounted () {
      let reqData = {
        identityCard: window.localStorage.getItem('identityCard')
      }
      this.mobilePhone = !window.localStorage.getItem('mobilePhone') ? '' : window.localStorage.getItem('mobilePhone')
      this.isLogin = window.localStorage.getItem('isLogin')
      if (!this.isLogin) {
        Indicator.close()
        this.$router.push('/login')
        return false
      }
      if (this.mobilePhone) {
        let noPwdLoginData = {
          loginName: this.mobilePhone
        }
        resultPostNoLoading(noPwdLogin, noPwdLoginData).then(json => {
          if (json.code === '0000') {
            let userData = json.data.authenticationBasicInformation
            let userCars = JSON.stringify(json.data.cars)
            console.log(userData)
            json.data.cars.forEach(item => {
              if (item.isMySelf === 0) {
                window.localStorage.setItem('myNumberPlate', decodeURIComponent(item.myNumberPlate)) // 车牌号码
                window.localStorage.setItem('behindTheFrame4Digits', decodeURIComponent(item.behindTheFrame4Digits)) // 车架号后4位
                window.localStorage.setItem('plateType', decodeURIComponent(item.plateType)) // 车牌类型
              }
            })
            window.localStorage.setItem('fileNumber', decodeURIComponent(json.data.fileNumber))
            window.localStorage.setItem('identityCard', decodeURIComponent(userData.identityCard)) // 身份证
            window.localStorage.setItem('mobilePhone', decodeURIComponent(userData.mobilephone)) // 手机号码
            window.localStorage.setItem('userName', decodeURIComponent(userData.trueName)) // 用户名字
            window.localStorage.setItem('cars', userCars)   // 名下车牌信息
            window.localStorage.setItem('isLogin', true) // 是否登录
          }
        })
      }
      Indicator.open()
      resultPost(bindCard, reqData).then(json => {
        Indicator.close()
        if (json.code === '0000') {
          this.fileNumber = json.data.fileNumber
          this.status = json.data.status
          this.availableScore = json.data.availableScore
          this.physicalExaminationDate = json.data.physicalExaminationDate
          this.effectiveDate = json.data.effectiveDate
          json.data.fileNumber ? this.myCardShow = true : this.myCardShow = false
        } else {
          Toast({
            message: json.msg,
            position: 'bottom',
            duration: 2000
          })
        }
      })
    },
    beforeDestory () {
      Indicator.close()
    }
  }
</script>
