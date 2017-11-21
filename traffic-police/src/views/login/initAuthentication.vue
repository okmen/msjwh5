<template>
    <div id="login-outer">
      <div class="logo"></div>
      <div class="login-form">
        <input v-model:value="userName" type="text" placeholder="请输入您的姓名">
        <input class="identityCard" v-model:value="identityCard" type="text" placeholder="请输入您的身份证号码">
        <input class="mobilephone" v-model:value="mobilephone" type="tel" placeholder="请输入新的手机号">
        <div class="validateCode">
          <input class="inpValidateCode" v-model:value="validateCode" type="tel" placeholder="输入验证码">
          <button type="button" name="button" :disabled="isdisabled" @click.stop="sendValidateCode()" :class="{disabled: isdisabled}">{{btnValidateCode}}</button>
        </div>
        <div class="login-img">
          <p>上传相关证件照片</p>
          <div class="login-img-flex">
            <div class="login-item-img">
              <label class="login-item-img-one" for="file1">
                <input id="file1" type="file" accept="image/*" >
                <img :src="imgOne1" />
              </label>
              <div class="login-item-text-one">身份证(正面)</div>
            </div>
            <div class="login-item-img">
              <label class="login-item-img-one" for="file2">
                <input id="file2" type="file" accept="image/*" >
                <img :src="imgOne2" />
              </label>
              <div class="login-item-text-one">手持身份证</div>
            </div>
          </div>
        </div>
        <button id="login-btn" @click.stop="loginClick()"> 重 新 认 证 </button>
      </div>
      <div v-wechat-title="$route.meta.title"></div>
    </div>
</template>

<script>
import uploadFile from '../../service/uploadFile.js'
import { resultPost } from '../../service/getData'
import { sendSMS, verificatioCode, reauthentication } from '../../config/baseUrl'
import { Toast, MessageBox } from 'mint-ui'
import { mapActions } from 'vuex'
export default {
  name: 'login',
  data () {
    return {
      userName: '',
      identityCard: '',
      validateCode: '',
      mobilephone: '',
      btnValidateCode: '获取验证码',
      openId: '',
      isdisabled: false,
      imgOne1: require('../../images/IDcard-front.png'),
      imgOne2: require('../../images/ID-hand.png')
    }
  },
  methods: {
    uploadImg () {
      uploadFile.upload({
        id: 'file1',
        callback: (res) => {
          console.log(res)
          this.imgOne1 = res.imgUrl
          // this.IDcardFront = res.imgUrl
        }
      })
      uploadFile.upload({
        id: 'file2',
        callback: (res) => {
          console.log(res)
          this.imgOne2 = res.imgUrl
          // this.IDcarfBack = res.imgUrl
        }
      })
    },
    loginClick: function () {
      // let that = this
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
        authenticationType: '5',
        photo6: this.imgOne2.split(',')[1] || '',
        photo9: this.imgOne1.split(',')[1] || '',
        businessType: this.$root.$router.businessType || ''
      }
      console.log(reqData)
      resultPost(verificatioCode, {mobilephone: this.mobilephone, validateCode: this.validateCode}).then(json => {
        if (json.code === '0000') {
          resultPost(reauthentication, reqData).then(data => {
            console.log(data)
            if (data.code === '0000') {
              this.postAppoin({
                appoinNum: data.data,
                appoinType: '星级用户重新认证'
              })
              this.$root.$router.isWeChat ? window.location.href = data.msg : this.$router.push('/appointSuccess')
            } else {
              MessageBox.alert(data.msg).then(action => {
                this.$router.push('/findPassword')
              })
            }
          })
        } else {
          Toast({
            message: json.data,
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
    },
    ...mapActions({
      postAppoin: 'postAppoin'
    })
  },
  mounted () {
    this.uploadImg()
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
    .login-img{
      font-size: 28px;
      p{
        color: #d6e8f3;
      }
      .login-img-flex{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-top: 10px;
        flex-wrap: wrap;
        .login-item-img{
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-right: 28px;
        }
      }
      .login-item-img-one{
        width: 200px;
        height: 200px;
        border: 2px solid #eee;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 20px;
        background-color: rgba(255, 255, 255, .3);
        input{
          display: none;
        }
        img{
          max-height: 90%;
          max-width: 90%;
        }
      }
      .login-item-text-one{
        color: #d6e8f3;
      }
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
