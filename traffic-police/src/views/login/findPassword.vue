<template>
    <div id="login-outer">
      <div class="logo"></div>
      <div class="login-form">
        <input v-model:value="userName" type="text" placeholder="请输入您的姓名">
        <input class="identityCard" v-model:value="identityCard" type="text" placeholder="请输入您的身份证号码">
        <input class="mobilephone" v-model:value="mobilephone" type="tel" placeholder="请输入手机号">
        <div class="validateCode">
          <input class="inpValidateCode" v-model:value="validateCode" type="tel" placeholder="输入验证码">
          <button type="button" name="button" :disabled="isdisabled" @click.stop="sendValidateCode()" :class="{disabled: isdisabled}">{{btnValidateCode}}</button>
        </div>
        <button id="login-btn" @click.stop="loginClick()"> 找 回 密 码</button>
        <div class="login-link">
          <router-link :to="isWeChat ? '/starUser_WeChat' : '/starUser'" class="login-link-forget">注册</router-link>
          <router-link to="/login" class="login-link-register">登录</router-link>
        </div>
        <div class="login-hint">
          <p>温馨提示:</p>
          <p>若您的手机号码已不再使用,或者不能正常接收到短信验证码,您可以通过 “<router-link to="/initAuthentication" class="login-hint-register">其他方式</router-link>” 变更手机号码！</p>
        </div>
      </div>
      <div v-wechat-title="$route.meta.title"></div>
    </div>
</template>

<script>
import { resultPost } from '../../service/getData'
import { resetPwd, sendSMS } from '../../config/baseUrl'
import { Toast, Indicator } from 'mint-ui'

export default {
  name: 'login',
  computed: {
    isWeChat: function () {
      return this.$root.$router.isWeChat
    }
  },
  data () {
    return {
      userName: '',
      identityCard: '',
      validateCode: '',
      mobilephone: '',
      btnValidateCode: '获取验证码',
      openId: '',
      isdisabled: false
    }
  },
  methods: {
    loginClick: function () {
      let that = this
      if (!this.userName) {
        Toast({
          message: '姓名不能为空',
          position: 'bottom',
          duration: 2000
        })
        return false
      }
      if (!this.identityCard) {
        Toast({
          message: '身份证不能为空',
          position: 'bottom',
          duration: 2000
        })
        return false
      }
      if (!this.mobilephone) {
        Toast({
          message: '手机号不能为空',
          position: 'bottom',
          duration: 2000
        })
        return false
      }
      if (!this.validateCode) {
        Toast({
          message: '验证码不能为空',
          position: 'bottom',
          duration: 2000
        })
        return false
      }
      let reqData = {
        identityCard: this.identityCard,
        mobilephone: this.mobilephone,
        userName: this.userName,
        sourceOfCertification: 'C',
        validateCode: this.validateCode
      }
      Indicator.open()
      resultPost(resetPwd, reqData).then(data => {
        Indicator.close()
        console.log(data)
        if (data.code === '0000') {
          that.$router.push('/login')
        } else {
          Toast({
            message: data.msg,
            position: 'bottom',
            duration: 2000
          })
        }
      })
    },
    sendValidateCode: function () {
      if (!this.mobilephone) {
        Toast({
          message: '手机号不能为空',
          position: 'bottom',
          duration: 2000
        })
        return false
      }
      let reqData = {
        mobilephone: this.mobilephone,
        businessType: 'szjj'
      }
      let time = 30
      this.btnValidateCode = `已发送（${time}）`
      this.isdisabled = true
      resultPost(sendSMS, reqData).then(json => {
        console.log(json)
      })
      function countDown (that) {
        setTimeout(() => {
          if (time === 0) {
            that.isdisabled = false
            that.btnValidateCode = '发送验证码'
          } else {
            time--
            that.btnValidateCode = `已发送（${time}）`
            countDown(that)
          }
        }, 1000)
      }
      countDown(this)
    }
  },
  mounted () {
    // this.openId = window.localStorage.getItem('openId')
    // let url = window.location.href
    // let data = {
    //   url: encodeURIComponent(url)
    // }
    // if (!this.openId) {
    //   window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx48a8104946507c1e&redirect_uri=http%3A%2F%2Ftestjava.chudaokeji.com%2Foauth%2Fcallback.html&response_type=code&scope=snsapi_userinfo&state=${data.url}#wechat_redirect`
    // }
  }

}
</script>

<style lang="less">
#app{
  width: 100%;
  height: 100%;
}
#login-outer{
  width: 100%;
  height: 100%;
  min-height: 1218px;
  background-image: url('../../images/login-banner.png');
  background-size: cover;
  padding-top: 330px;
  box-sizing: border-box;
  position: relative;
  .logo{
    width: 200px;
    height: 174px;
    background-image: url('../../images/login-logo.png');
    background-size: cover;
    position: absolute;
    left: 50%;
    top: 80px;
    right: 50%;
    transform: translateX(-50%);
  }
  .login-form{
    padding: 0 64px;
    input{
      display: block;
      width: 100%;
      height: 80px;
      font-size: 30px;
      line-height: 80px;
      box-sizing: border-box;
      border: none;
      border-radius: 8px;
      background-color: rgba(255, 255, 255, .2);
      margin-bottom: 24px;
      padding-left: 90px;
      outline: none;
      background-image: url('../../images/login-user.png');
      background-repeat: no-repeat;
      background-size: 35px;
      background-position: 30px center;
      &::-webkit-input-placeholder {
        color: rgba(255, 255, 255, .5);
      }
    }
    .validateCode{
      overflow: hidden;
      input{
        float: left;
        width: 60%;
      }
      button{
        float: left;
        color: #fff;
        font-size: 30px;
        background-color: rgba(255, 255, 255, .0);
        line-height: 80px;
        margin-left: 60px;
        text-decoration: underline;
        outline: none;
      }
    }
    .mobilephone{
      background-image: url('../../images/phoneIoc.png');
    }
    .identityCard{
      background-image: url('../../images/IDIoc.png');
    }
    .inpValidateCode{
      background-image: url('../../images/validationIoc.png');
    }
    #login-btn{
      display: block;
      width: 100%;
      height: 80px;
      background-color: #ffbe00;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 36px;
      margin-top: 70px;
    }
    .login-link{
      width: 100%;
      height: 70px;
      padding: 0 45px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      a{
        color: #fff;
        font-size: 28px;
        text-decoration: underline;
      }
    }
    .login-hint{
      p{
        font-size: 26px;
        color: #fff;
        line-height: 35px;
        a{
          color: #ffbe00;
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
