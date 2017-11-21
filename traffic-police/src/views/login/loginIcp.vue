<template>
    <div id="login-outer">
      <div class="logo"></div>
      <div class="login-form">
        <input v-model:value="loginName" type="tel" placeholder="请输入手机号或身份证号">
        <input v-model:value="password" id="login-password" type="password" placeholder="请输入密码">
        <button id="login-btn" @click.stop="loginClick()">星级用户登录</button>
        <div class="login-link">
          <router-link to="/findPassword" class="login-link-forget">忘记密码</router-link>
        </div>
      </div>
      <div class="login-icpTara">
        <a :href="icpTara">我不是星级用户，直接使用</a>
        <p>请注册星级用户，注册后使用</p>
        <p>远程处理系统体验更佳</p>
      </div>
    </div>
</template>

<script>
import { resultPost } from '../../service/getData'
import { login } from '../../config/baseUrl'
import { Toast, Indicator } from 'mint-ui'

export default {
  name: 'loginIcp',
  data () {
    return {
      loginName: '',
      password: '',
      openId: '',
      icpTara: '' // 快车直配连接
    }
  },
  methods: {
    loginClick: function () {
      // let that = this
      if (!this.loginName) {
        Toast({
          message: '用户名不能为空',
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
      let url = window.location.href
      let data = {
        url: encodeURIComponent(url),
        openIdURL: url.split('?openId')[0]
      }
      if (!this.openId) {
        // 交警u-load环境
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc2b699cf2f919b58&redirect_uri=http%3A%2F%2Fgzh.stc.gov.cn%2Fapi%2Foauth%2Fcallback.html&response_type=code&scope=snsapi_userinfo&state=${data.openIdURL}#wechat_redirect`
      }
      let reqData = {
        loginName: this.loginName,
        password: this.password,
        openId: this.openId,
        loginClient: window.localStorage.getItem('sourceOfCertification')
      }
      Indicator.open()
      console.log(login)
      resultPost(login, reqData).then(data => {
        Indicator.close()
        console.log(data)
        if (data.code === '0000') {
          let userData = data.data.authenticationBasicInformation
          let userCars = JSON.stringify(data.data.cars)
          let userNumberPlate = ''
          let plateType = ''
          console.log(userData)
          data.data.cars.forEach(item => {
            if (item.isMySelf === 0) {
              userNumberPlate = item.myNumberPlate // 车牌号码
              plateType = item.plateType // 车牌类型
              window.localStorage.setItem('myNumberPlate', decodeURIComponent(item.myNumberPlate)) // 车牌号码
              window.localStorage.setItem('behindTheFrame4Digits', decodeURIComponent(item.behindTheFrame4Digits)) // 车架号后4位
              window.localStorage.setItem('plateType', decodeURIComponent(item.plateType)) // 车牌类型
            }
          })
          window.localStorage.setItem('identityCard', decodeURIComponent(userData.identityCard)) // 身份证照
          window.localStorage.setItem('mobilePhone', decodeURIComponent(userData.mobilephone)) // 手机号码
          window.localStorage.setItem('userName', decodeURIComponent(userData.trueName)) // 用户名字
          window.localStorage.setItem('cars', userCars)   // 名下车牌信息
          window.localStorage.setItem('isLogin', true) // 是否登录
          window.alert(`https://icp-tara.pingan.com.cn:10443/icp-tara/do/page/changePage?cername=${userData.trueName}&certno=${userData.identityCard}&carMark=${userNumberPlate}&openid=${this.openId}&mobile=${userData.mobilephone}&userType=1&carType=${plateType}`)
          // 跳转至快车直赔的页面
          window.location.href = `https://icp-tara.pingan.com.cn:10443/icp-tara/do/page/changePage?cername=${userData.trueName}&certno=${userData.identityCard}&carMark=${userNumberPlate}&openid=${this.openId}&mobile=${userData.mobilephone}&userType=1&carType=${plateType}`
        } else {
          Toast({
            message: data.msg,
            position: 'bottom',
            duration: 2000
          })
        }
      })
    }
  },
  mounted () {
    Indicator.close()
    let ua = window.navigator.userAgent // 浏览器版本
    this.openId = window.localStorage.getItem('openId')
    let data = {
      url: 'http://gzh.stc.gov.cn/h5/#/login'
    }
    if (!this.openId) {
      if (/MicroMessenger/i.test(ua)) { // 微信跳转获取openId
        window.localStorage.setItem('sourceOfCertification', 'C')
        // 交警u-load环境
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc2b699cf2f919b58&redirect_uri=http%3A%2F%2Fgzh.stc.gov.cn%2Fapi%2Foauth%2Fcallback.html&response_type=code&scope=snsapi_userinfo&state=${data.url}#wechat_redirect`
      } else if (/AlipayClient/i.test(ua)) { // 支付宝
        window.localStorage.setItem('sourceOfCertification', 'Z')
        window.location.href = `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2016082201786470&scope=auth_user&redirect_uri=http%3A%2F%2Fszjj.u-road.com%2Fapi%2FoauthAlipay%2Fcallback.html&state=${data.url}`
      }
    }
    this.icpTara = `https://icp-tara.pingan.com.cn:10443/icp-tara/do/page/changePage?cername=&certno=&carMark=&openid=${this.openId}&mobile=&userType=1&carType=`
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
    #login-password{
      background-image: url('../../images/login-password.png');
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
  .login-icpTara{
    position: absolute;
    bottom: 56px;
    padding: 0 173px;
    text-align: center;
    a{
      font-size: 32px;
      color: #fff;
      line-height: 55px;
      text-decoration: underline;
    }
    p{
      font-size: 28px;
      color: #014066;
      line-height: 36px;
    }
  }
}
</style>
