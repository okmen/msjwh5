<template>
  <div id="starUser-hbs">
    <ul class="starUser-hbs-list">
      <li class="starUser-hbs-item">
        <div class="starUser-hbs-name">
          <span>身份证号</span>
        </div>
        <div class="starUser-hbs-text">
          <input class="text-input" type="text" maxlength="19" v-model="idCardNumber" placeholder="如果您是外籍人士,请在证件号前加F">
        </div>
      </li>
      <li class="starUser-hbs-item">
        <div class="starUser-hbs-name">
          <span>驾驶证核发地</span>
        </div>
        <div class="starUser-hbs-radio">
          <div class="starUser-hbs-radio-box">
            <input type="radio" id="starUserRadio1" name="drivingLicence" value="1" v-model:checked="originPlace">
            <label name="starUserRadio1" class="checked" for="starUserRadio1">深圳本地</label>
          </div>
          <div class="starUser-hbs-radio-box">
            <input type="radio" id="starUserRadio2" name="drivingLicence" value="2" v-model:checked="originPlace">
            <label name="starUserRadio2" class="checked" for="starUserRadio2">本省外市</label>
          </div>
          <div class="starUser-hbs-radio-box">
            <input type="radio" id="starUserRadio3" name="drivingLicence" value="3" v-model:checked="originPlace">
            <label name="starUserRadio3" class="checked" for="starUserRadio3">外省</label>
          </div>
        </div>
      </li>
      <li class="starUser-hbs-item">
        <div class="starUser-hbs-name">
          <span>手机号码</span>
        </div>
        <div class="starUser-hbs-text">
          <input class="text-input" type="tel" maxlength="11" v-model="telphoneNumber" placeholder="请输入您的手机号码">
        </div>
      </li>
      <li class="starUser-hbs-item clear">
        <div class="starUser-hbs-name">
          <span>验证码</span>
        </div>
        <div class="starUser-hbs-text width-40 left">
          <input class="text-input" type="tel" maxlength="6" v-model="verifCodeNum" placeholder="请输入验证码">
        </div>
        <div class="left starUser-hbs-code"><button type="button" name="button" @click.stop="getVerification()"
          :class="{disabled: isdisabled}" :disabled="this.isdisabled">{{getValidCodeMsg}}</button></div>
      </li>
      <li class="starUser-hbs-item driver-address">
        <div class="starUser-hbs-name">
          <span>联系地址</span>
        </div>
        <div class="starUser-hbs-text">
          <input class="text-input" type="text" maxlength="18" v-model="address" placeholder="请输入您的联系地址(非必填)">
        </div>
      </li>
    </ul>
    <common @btnSureStar="btnSureStar()" ref="getImgUrl"></common>
  </div>
</template>
<script>
  import common from './common'
  import { resultPost } from '../../../service/getData'
  import { drivingLicense, sendSMS } from '../../../config/baseUrl'
  import { Toast, Indicator } from 'mint-ui'
  import { mapActions } from 'vuex'
  export default{
    name: 'drivingLicense',
    components: {
      common
    },
    data () {
      return {
        getValidCodeMsg: '发送验证码',
        isdisabled: false,
        idCardNumber: '',   // 身份证号码
        originPlace: '',    // 驾驶证所属地
        telphoneNumber: '', // 电话号码
        verifCodeNum: '',   // 验证码
        address: ''         // 联系地址
      }
    },
    methods: {
      getVerification: function () {  // 获取验证码
        let sendPhoneNumber = {
          mobilephone: this.telphoneNumber,
          businessType: 'szjj'
        }
        let time = 30
        if (/^1[34578]\d{9}$/.test(this.telphoneNumber)) {
          this.getValidCodeMsg = `已发送（${time}）`
          this.isdisabled = true
          countDown(this)
          resultPost(sendSMS, sendPhoneNumber).then(json => {
            if (json.code === '0000') {
              Toast({
                message: '验证码已发送，请查收',
                position: 'bottom',
                className: 'white',
                duration: 1500
              })
            }
          })
        } else {
          Toast({
            message: '请输入正确的手机号码',
            position: 'bottom',
            className: 'white',
            duration: 1500
          })
        }
        function countDown (that) {
          setTimeout(() => {
            if (time === 0) {
              that.isdisabled = false
              that.getValidCodeMsg = '发送验证码'
            } else {
              time--
              that.getValidCodeMsg = `已发送（${time}）`
              countDown(that)
            }
          }, 1000)
        }
      },
      btnSureStar: function () {   // 确认提交按钮
        let idImgOne = this.$refs.getImgUrl.idCardImgPositive
        let idImgTwo = this.$refs.getImgUrl.idCardImgNegative
        let idImgThree = this.$refs.getImgUrl.idCardImgHandHeld
        if (!this.idCardNumber) {
          Toast({message: '请输入您的身份证号码', position: 'bottom', className: 'white'})
        } else if (/[（* | ）* ]/g.test(this.idCardNumber)) {
          Toast({message: '请使用英文状态下的括号', position: 'bottom', className: 'white'})
        } else if (!this.originPlace) {
          Toast({message: '请选择驾驶证所属地', position: 'bottom', className: 'white'})
        } else if (!this.telphoneNumber) {
          Toast({message: '请输入您的手机号码', position: 'bottom', className: 'white'})
        } else if (!this.verifCodeNum) {
          Toast({message: '请输入验证码', position: 'bottom', className: 'white'})
        } else if (!idImgOne || !idImgTwo || !idImgThree) {
          Toast({message: '请上传身份证照片', position: 'bottom', className: 'white'})
        } else {
          Indicator.open('提交中...') // 图片转换为base64后提交会需要时间
          let driverLicenseData = {
            identityCard: this.idCardNumber,
            driverLicenseIssuedAddress: this.originPlace,
            mobilephone: this.telphoneNumber,
            validateCode: this.verifCodeNum,
            linkAddress: this.address,
            idCardImgPositive: idImgOne.split(',')[1],
            idCardImgNegative: idImgTwo.split(',')[1],
            idCardImgHandHeld: idImgThree.split(',')[1],
            openId: window.localStorage.openId,
            businessType: this.$root.$router.businessType || '1'
          }
          console.log(driverLicenseData)
          resultPost(drivingLicense, driverLicenseData).then(json => {
            console.log(json)
            let jsonMsg = json.msg
            let getJsonMsg = ''
            if (jsonMsg.indexOf(' ') === -1) {
              getJsonMsg = jsonMsg
            } else {
              getJsonMsg = jsonMsg.split(' ')[0]
            }
            if (json.code === '0000') {
              Indicator.close()
              this.postAppoin({
                appoinNum: json.msg.split(':')[1],
                appoinType: '星级用户认证'
              })
              // this.$router.push('/appointSuccess_WeChat')
              window.location.href = json.data
            } else {
              Indicator.close()
              Toast({
                message: getJsonMsg,
                position: 'bottom',
                className: 'white'
              })
            }
          })
        }
      },
      beforeDestory () {
        Toast.close()
      },
      ...mapActions({
        postAppoin: 'postAppoin'
      })
    }
  }
</script>
<style lang="less" scoped>
#starUser-hbs {
  padding-bottom: 20px;
  .starUser-hbs-list {
    overflow: hidden;
    .starUser-hbs-item {
      margin-top: 24px;
      padding-left: 180px;
      position: relative;
      line-height: 56px;
      .starUser-hbs-name {
        width: 180px;
        position: absolute;
        left: 0;
      }
      .starUser-hbs-text {
        width: 100%;
        display: inline-block;
      }
      .starUser-hbs-radio {
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
      .starUser-hbs-code {
        text-indent: 28px;
        button{
          background:none;
          border:none;
          text-decoration: underline;
          outline:none;
          &.disabled{
            background: #ccc;
            color: #fff;
          }
        }
      }
    }
    .driver-address{
      margin-bottom:40px;
    }
  }
}

</style>
