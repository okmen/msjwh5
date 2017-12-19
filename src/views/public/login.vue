<template>
  <div id="login-outer">
    <div class="logo"></div>
    <div class="login-form">
      <input v-model:value="loginName" type="tel" placeholder="请输入手机号或身份证号">
      <input v-model:value="password" id="login-password" type="password" placeholder="请输入密码">
      <button id="login-btn" @click.stop="loginClick()">登 录</button>
    </div>
  </div>
</template>

<script>
import { login } from '@/config/baseURL'
import { Toast } from 'mint-ui'

export default {
  name: 'login',
  data () {
    return {
      loginName: '',
      password: '',
      openId: ''
    }
  },
  methods: {
    loginClick: function () {
      if (!this.loginName) {
        Toast({
          message: '用户名不能为空',
          position: 'bottom',
          duration: 2000
        })
        return false
      }
      if (!/^[a-zA-Z0-9()]+$/.test(this.loginName)) {
        Toast({
          message: '用户名只能是字母和数字',
          position: 'bottom',
          duration: 2000
        })
        return false
      }
      if (!this.password) {
        Toast({
          message: '密码不能为空',
          position: 'bottom',
          duration: 2000
        })
        return false
      }
      let reqData = {
        loginName: this.loginName,
        password: window.btoa(this.password),
        loginClient: window.localStorage.getItem('sourceOfCertification')
      }
      this.$axios.post(login, reqData).then(data => {
        if (data.code === '0000') {
          this.$store.dispatch('updataUserG', data.data)
          this.$router.replace(this.$route.query.url)
        } else if (data.code === '0002') {
          Toast({
            message: data.msg,
            position: 'bottom',
            duration: 2000
          })
        }
      })
    }
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
background-image: url('./../../assets/images/login-banner.png');
background-size: cover;
padding-top: 330px;
box-sizing: border-box;
position: relative;
.logo{
  width: 200px;
  height: 174px;
  background-image: url('./../../assets/images/login-logo.png');
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
    background-image: url('./../../assets/images/login-user.png');
    background-repeat: no-repeat;
    background-size: 35px;
    background-position: 30px center;
    &::-webkit-input-placeholder {
      color: rgba(255, 255, 255, .5);
    }
  }
  #login-password{
    background-image: url('./../../assets/images/login-password.png');
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
}
}
</style>
