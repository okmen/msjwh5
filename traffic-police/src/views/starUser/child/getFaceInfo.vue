<template>
    <div class="get-face-info form-template">
      <div class="self-input form-template-item">
        <span class="form-template-item-left">手机号码</span>
        <input type="text" placeholder="请输入手机号码"  class="form-template-item-right" v-model="mobilePhone">
      </div>
      <div class="form-template-item">
        <span class="form-template-item-left">验证码</span>
        <div class="form-template-item-right send-code">
          <input type="text" placeholder="请输入验证码" class="send-code-input" v-model="verificationCode" maxlength="6">
          <span class="send-code-btn" @click="getVerificationCode" v-if="showTime">获取验证码</span>
          <span class="send-code-btn" style="background: gray" v-if="!showTime">{{countDown}} s</span>
        </div>
      </div>
      <div  class="form-template-item" style="background:#09bb07; display: flex;align-items: center;justify-content: center; border-radius: 8px;color: white;font-size: 18px;margin-top: 15px" @click="sweepInto">提 交</div>
    </div>
</template>
<style scoped lang="less">
  .send-code {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    .send-code-input {
      width: 250px;
    }
    .send-code-btn {
      background: #09bb07;
      height: 70px;
      line-height: 70px;
      text-align: center;
      color: white;
      width: 180px;
      border-radius: 8px;
    }
  }
</style>
<script>
  import { resultPost } from '../../../service/getData'
  import {Toast, MessageBox} from 'mint-ui'
  import {isPhone} from 'service/regExp.js'
  import {faceautonym, sendSMS, verificatioCode, weChatBrushFaceAuthentication} from 'config/baseUrl.js'
//  import 'vconsole'
  export default {
    data () {
      return {
        showTime: true,
        countDown: 60,
        mobilePhone: '',
        verificationCode: '',
        uid: window.localStorage.getItem('openId'),
        userName: '',
        IDcard: '',
        appid: '4435',
        secretkey: '9828577231bdc6d01754e292023cdbb8',
        aeskey: '26cb3f325891d42bec10efdeec9a4f95',
        redirect: '',
        signature: null,
        sig: null,
        infoSignature: null,
        infoSig: null
      }
    },
    created () {
      resultPost(faceautonym, {
        token: this.$route.query.token,
        appid: this.appid
      }).then(data => {
        if (data.code !== '0000') {
          this.$router.push('/registerChoose')
        }
      })
    },
    methods: {
      getVerificationCode () {
        if (!isPhone(this.mobilePhone)) {
          Toast({
            message: '手机号码格式不正确',
            duration: 2000
          })
          return false
        }
        resultPost(sendSMS, {mobilephone: this.mobilePhone, businessType: 'szjj'}).then(data => {
          console.log(data, '验证码')
          if (data.code === '0000') {
            MessageBox('提示', '验证码已发送')
            this.showTime = false
            this.timer = setInterval(() => {
              if (this.countDown === 0) {
                clearInterval(this.timer)
                this.showTime = true
                this.countDown = 60
                return
              }
              this.countDown--
            }, 1000)
          } else {
            MessageBox('提示', data.msg)
          }
        })
      },
      sweepInto () {
        if (!isPhone(this.mobilePhone)) {
          Toast({
            message: '手机号码格式不正确',
            duration: 2000
          })
          return false
        }
        if (!this.verificationCode) {
          Toast({
            message: '验证码不能为空',
            duration: 2000
          })
          return false
        }
        resultPost(verificatioCode, {mobilephone: this.mobilePhone, validateCode: this.verificationCode}).then(data => {
          if (data.code === '0000') {
            let _this = this
            // 如果有返回的token，就尝试拉去实名认证信息
            if (this.$route.query.token && this.$route.query.uid) {
              resultPost(faceautonym, {
                token: this.$route.query.token,
                appid: this.appid
              }).then(data => {
                console.log(data, 1111)
                if (data.code === '0000') {
                  window.localStorage.setItem('isLogin', false) // 是否登录
                  let requestData = {
                    name: data.data.name,
                    identityCard: data.data.ID,
                    mobilephone: _this.mobilePhone,
                    userSource: 'C',
                    certificationType: 4,
                    photo6: data.data.videopic1,
                    openId: window.localStorage.getItem('openId')
                  }
                  resultPost(weChatBrushFaceAuthentication, requestData).then(json => {
                    console.log(json, 2222)
                    if (json.code === '0000') {
                      MessageBox.alert('您的信息已成功提交,我们将在3工作日内发送短信告知您审核结果').then(action => {
                        _this.$router.push('/')
                      })
                    } else {
                      MessageBox('验证失败,请重试', json.msg)
                    }
                  })
                } else {
                  MessageBox('提示', data.msg)
                }
              })
            }
          } else {
            MessageBox('提示', data.data)
          }
        })
      }
    }
  }
</script>
