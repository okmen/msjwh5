<template>
  <div class="changeCard">
    <div class="changeCard-top">
      <g-input class="changeCard-type" title="业务类型" v-model="name" readonly></g-input>
    </div>
    <g-select title="业务类型" :data="censusTypeList" v-model="censusType"></g-select>
    <g-input title="姓名" v-model="userName"></g-input>
    <g-input title="身份证号" maxlength="18" v-model="IDCard"></g-input>
    <g-input title="手机号码" maxlength="11" v-model="mobilePhone" type="tel"></g-input>
    <g-input class="changeCard-inputPhoto" maxlength="25" title="照片回执码" v-model="photoReturnNumberString" type="tel">
      <div slot='right' v-if="source === 'M'" class="RichScan" @click="scanQRCode()">扫一扫</div>
    </g-input>
    <span class="changeCard-examine" @click.stop="example=true">查看示例</span>
    <g-select title="户籍所在地" :data="censusRegisterList" v-model="censusRegisterOne"></g-select>
    <g-input title="收件人名字" v-model="receiverName" placeholder="请输入收件人姓名"></g-input>
    <g-input title="收件人号码" maxlength="11" v-model="receiverMobilePhone" placeholder="请输入收件人号码"></g-input>
    <g-select-one class="changeCard-set" title="深圳市" type="邮寄地址" :data="areaSelectData" v-model="areaSelect"></g-select-one>
    <g-input title="" v-model="mailingAddress" placeholder="请输入详细地址"></g-input>
    <group title="请按示例图上传以下证件照片">
      <div class="upload-group">
        <g-upload text="身份证（正面)" id="file1" :bg="require('../../../assets/images/IDcard-front.png')" v-model="IDCardFront"></g-upload>
        <g-upload text="身份证（反面)" id="file2" :bg="require('../../../assets/images/IDcard-back.png')" v-model="IDCardBack"></g-upload>
        <g-upload v-if = "censusRegisterOne === '3'" text="境外人员临住表" id="file3" :bg="require('../../../assets/images/out-board.png')" v-model="board"></g-upload>
      </div>
    </group>
    <g-button text="确认信息" @click.native="confirmInfo" v-if="bindDriverLicence === '1'"></g-button>
    <g-button text="确认信息" v-if="bindDriverLicence !== '1'" type="gray"></g-button>
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
import {GInput, GSelect, GButton, GSelectOne, Group, GUpload} from 'form'
import { cardRepair, cardReplace } from '@/config/baseURL'
// import { isPhone, isPhotoNum } from '@/utils/regExp'
import wx from 'weixin-js-sdk'
import beforeSubmit from '@/mixins/beforeSubmit'
export default {
  name: 'changeCard',
  data () {
    return {
      name: '驾驶证补换证',
      source: '',
      userName: '',
      IDCard: '',
      mobilePhone: '',
      photoReturnNumberString: '',
      receiverName: '',
      receiverMobilePhone: '',
      mailingAddress: '',
      IDCardFront: '',
      IDCardBack: '',
      board: '',
      bindDriverLicence: '',
      censusTypeList: [
        {name: '补证', value: 1}, {name: '期满换证', value: 2}
      ],
      censusType: 1,
      // censusRegisterList: '',
      censusRegisterOne: '1',
      // areaSelectData: this.$store.state.cityAreaS,
      areaSelect: '福田区',
      example: false                       // 示例弹窗 默认不显示
    }
  },
  components: {
    GInput,
    GSelect,
    GButton,
    GSelectOne,
    Group,
    GUpload
  },
  mixins: [beforeSubmit],
  computed: {
    censusRegisterList () {
      return this.$store.state.censusRegisterList
    },
    areaSelectData () {
      return this.$store.state.cityAreaS
    },
    queryURL () {
      return this.$store.getters.queryURL
    },
    core () {
      return this.$store.state.core
    }
  },
  created () {
    let val = this.$store.state.user
    this.userName = val.userName
    this.IDCard = val.identityCard
    this.mobilePhone = val.mobilePhone
    this.bindDriverLicence = val.bindDriverLicence
    this.source = this.$store.state.core.source
  },
  mounted () {
    if (this.bindDriverLicence !== '1') {
      this.$MessageBox('温馨提示', '您还没绑定驾驶证,请到星级用户中心绑定！')
    }
    document.addEventListener('click', (e) => {
      if (this.example === true) {
        this.example = false
      }
    })
  },
  methods: {
    scanQRCode: function () {
      console.log('1233')
      let that = this
      let ua = window.navigator.userAgent // 浏览器版本
      if (/MicroMessenger/i.test(ua)) {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
            that.photoReturnNumberString = result.split(',')[1]
            console.log(that.photoReturnNumberString, '结果')
          }
        })
      } else {
        // if ((window.Ali.alipayVersion).slice(0, 3) >= 8.1) {
        //   window.Ali.scan({
        //     type: 'qr'
        //   }, function (result) {
        //     if (result.errorCode) {
        //       // 没有扫码的情况
        //       // errorCode=10，用户取消
        //       // errorCode=11，操作失败
        //       switch (result.errorCode) {
        //         case 10:
        //           window.alert('用户取消')
        //           break
        //         default:
        //           window.alert('操作失败')
        //       }
        //     } else {
        //       // 成功扫码的情况
        //       if (result.barCode !== undefined) { // 条码
        //         // result.barCode 返回结果
        //         this.photoReturnNumberString = result.barCode
        //       } else if (result.qrCode !== undefined) { // 二维码
        //         // result.barCode 返回结果
        //         this.photoReturnNumberString = result.barCode
        //       } else if (result.cardNumber !== undefined) { // 银行卡
        //         // result.barCode 返回结果
        //         this.photoReturnNumberString = result.barCode
        //       }
        //     }
        //   })
        // } else {
        //   window.alert('请在钱包8.1以上版本运行')
        // }
      }
    },
    confirmInfo () {
      let obj = {
        userName: '请输入姓名',
        IDCard: '请输入身份证号码',
        mobilePhone: '请输入手机号码',
        photoReturnNumberString: '请输入照片回执码',
        receiverName: '请输入收件人姓名',
        receiverMobilePhone: '请输入收件人手机号码',
        mailingAddress: '请输入详细地址',
        IDCardFront: '请上传身份证（正面）',
        IDCardBack: '请上传身份证（反面）'
      }
      if (this.$_myMinxin_beforeSubmit(obj)) return
      if (this.$verification.isPhone(this.mobilePhone)) return
      if (this.$verification.isPhotoNum(this.photoReturnNumberString)) return
      if (this.censusRegisterOne === '3' && !this.board) {
        this.$toast({message: '请上传境外人员临住表', position: 'middle', duration: 3000})
      } else {
        let reqData = {
          type: '驾驶证补证',
          url: this.censusType === '1' ? cardRepair : cardReplace,
          title: 'repairDriverLicense',
          textObj: {
            identityCard: this.IDCard,
            userName: this.userName,
            mobilephone: this.mobilePhone,
            photoReturnNumberString: this.photoReturnNumberString,
            placeOfDomicile: this.censusRegisterOne,
            receiverName: this.receiverName,
            receiverNumber: this.receiverMobilePhone,
            receiverAddress: `深圳市,${this.areaSelect},${this.mailingAddress}`
          },
          imgObj: {
            PHOTO9: this.IDCardFront || '',
            PHOTO10: this.IDCardBack || '',
            PHOTO31: this.board || ''
          },
          invisibleObj: {
            JZZA: this.IDCardFront || '',      // 居住证照片 页面不给居住证上传入口 直接传与身份证正反面同样的数据
            JZZB: this.IDCardBack || '',
            loginUser: this.IDCard,
            userSource: this.$route.query.source,
            identificationNO: 'A'
          }
        }
        console.log(reqData)
        this.$store.commit('savePassByValue', reqData)
        this.$router.push({path: '/affirmInfo', query: this.queryURL})
      }
    }
  }
}
</script>

<style lang="less" scoped>
.changeCard {
  position:relative;
  padding-bottom: 40px;
  .upload-group{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .RichScan {
    width: 24%;
    line-height: 56px;
    border-radius: 8px;
    text-align: center;
    background-color: #174ed0;
    color: #fff;
    margin-left: 16px;
  }
  .changeCard-examine {
    padding-left: 240px;
    line-height: 70px;
    color: #2696dd;
    text-decoration: underline;
  }
  .example {
    position: absolute;
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
      margin-top: -480px;
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
