<!--驾驶证降级-->
<template>
<div class="degrade-card">
  <g-input title="证件名称" value="居民身份证" readonly></g-input>
  <g-input title="证件号码" readonly :value="loginUser"></g-input>
  <g-input title="申请人证件号" readonly :value="IDcard"></g-input>
  <g-input title="申请人驾驶证号"readonly :value="driverLicense"></g-input>
  <g-input title="申请人姓名" readonly :value="name"></g-input>
  <g-select title="户籍所在地" :data="censusRegister" v-model="censusRegisterOne"></g-select>
  <g-input title="照片回执码" v-model="photoReturnNumberString" placeholder="请输入照片回执码">
    <div slot="right" class="degrade-btn" v-if="$route.query.source === 'M'">
      <g-button text="扫一扫" noMargin="true"  @click.native="scanCode"></g-button>
    </div>
  </g-input>
  <span class="changeCard-examine" @click.stop="example=true">查看示例</span>
  <g-input title="收件人姓名" v-model="receiverName"></g-input>
  <g-input title="收件人号码" v-model="receiverNumber"></g-input>
  <g-select-one type="邮寄地址" title="深圳市" :data="cityArea" v-model="cityAreaOne" ref="cityAreaOneStr"></g-select-one>
  <g-input title="" v-model="mailingAddress" placeholder="请输入详细地址"></g-input>
  <group title="请按示例图上传以下证件照片">
    <div class="upload-group">
      <g-upload id="file1" text="身份证（人像面）" :bg="require('../../../assets/images/IDcard-front.png')" v-model="cardFront"></g-upload>
      <g-upload id="file2" text="身份证（国徽面）" :bg="require('../../../assets/images/IDcard-back.png')" v-model="cardBack"></g-upload>
      <g-upload id="file3" text="驾驶证照片" :bg="require('../../../assets/images/drivinglicense.png')" v-model="drivinglicenseImg"></g-upload>
    </div>
  </group>
  <g-button text="确认信息" @click.native="confirmInfo"></g-button>
  <!-- 查看示例-弹窗 -->
  <div class="example" v-if="example">
    <div class="example-box" @click.stop="example=true">
      <img src="../../../assets/images/example.png">
      <button class="btn btn-blue" type="button" name="button" @click.stop="example=!example">关闭</button>
    </div>
  </div>
</div>
</template>

<script>
  import GInput from '../../../components/form/GInput'
  import wx from 'weixin-js-sdk'
  import beforeSubmit from '@/mixins/beforeSubmit'
  import { degradeCard } from '@/config/baseURL'
  export default {
    components: {GInput},
    name: 'degrade-card',
    data () {
      return {
        censusRegisterOne: '1',
        receiverName: '',
        receiverNumber: '',
        cityAreaOne: '01',
        photoReturnNumberString: '',
        cardFront: '',
        cardBack: '',
        drivinglicenseImg: '',
        example: false,
        mailingAddress: ''
      }
    },
    mixins: [beforeSubmit],
    computed: {
      user () {
        return this.$store.state.user
      },
      loginUser () {
        return this.user.identityCard
      },
      IDcard () {
        return this.user.identityCard
      },
      driverLicense () {
        return this.user.identityCard
      },
      name () {
        return this.user.userName
      },
      censusRegister () {
        return this.$store.state.censusRegister
      },
      cityArea () {
        return this.$store.state.cityArea
      }
    },
    created () {
      if (this.user.bindDriverLicence !== '1') {
        this.$MessageBox('温馨提示', '您还没绑定驾驶证,请到民生警务个人中心绑定！')
      }
      this.receiverNumber = this.user.mobilePhone
      this.receiverName = this.name
    },
    methods: {
      scanCode () {
        let that = this
        let ua = window.navigator.userAgent // 浏览器版本
        if (/MicroMessenger/i.test(ua)) {
          wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
              var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
              that.photoReturnNumberString = result.split(',')[1]
            }
          })
        }
      },
      confirmInfo () {
        let obj = {
          photoReturnNumberString: '请输入照片回执码',
          receiverName: '请输入收件人姓名',
          receiverNumber: '请输入收件人手机号码',
          mailingAddress: '请输入详细地址',
          cardFront: '请上传身份证（人像面）',
          cardBack: '请上传身份证（国徽面）',
          drivinglicenseImg: '请上传驾驶证照片'
        }
        if (this.$_myMinxin_beforeSubmit(obj)) return
        if (this.$verification.isPhone(this.receiverNumber)) return
        if (this.$verification.isPhotoNum(this.photoReturnNumberString)) return
        let reqData = {
          type: '驾驶证自愿降级',
          url: degradeCard,
          textObj: {
            identificationNO: 'A',
            identityCard: this.IDcard,
            proposerIdentityCard: this.IDcard,
            driverLicense: this.driverLicense,
            userName: this.name,
            placeOfDomicile: this.censusRegisterOne,
            photoReturnNumberString: this.photoReturnNumberString,
            receiverName: this.receiverName,
            receiverNumber: this.receiverNumber,
            receiverAddress: '深圳市' + this.$refs.cityAreaOneStr.currentName + this.mailingAddress
          },
          imgObj: {
            PHOTO9: this.cardFront,
            PHOTO10: this.cardBack,
            JSZZP: this.drivinglicenseImg
          },
          invisibleObj: {
            loginUser: this.loginUser,
            userSource: this.$route.query.source
          }
        }
        console.log(reqData)
        this.$store.commit('savePassByValue', reqData)
        this.$router.push('/affirmInfo')
      }
    }
  }
</script>

<style scoped lang="less">
.degrade-card{
  padding: 20px 0 40px;
  .upload-group{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .degrade-btn{
    width: 200px;
    .g-button{
      padding-top: 0;
      padding-bottom: 0;
      padding-right: 0;
      height: 30px;
    }
  }
  .changeCard-examine {
    padding-left: 240px;
    line-height: 70px;
    color: #2696dd;
    text-decoration: underline;
  }
  .example {
    position: fixed;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,.5);
    .example-box {
      left: 5%;
      right:5%;
      top:50%;
      height: 500px;
      background-color: #fff;
      position: absolute;
      margin-top: -300px;
      border-radius: 10px;
      text-align: center;
      padding: 60px;
      img {
        width: 440px;
      }
      .btn {
        width: 280px;
        margin-top:30px;
        display: inline-block;
      }
    }
  }
}
</style>
