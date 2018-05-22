<template>
  <div class="feePayment">
    <p class="feePayment-head"><img src="../../assets/images/feePayment-icon-1.png" alt="">请填写缴费信息</p>
    <g-select title="业务类型" :data="typeData" v-model="feetype" ref="name"></g-select>
    <g-input class="changeCard-inputPhoto" maxlength="25" title="缴款编号" placeholder="请输入缴款编号" v-model="billNo" type="tel">
      <div slot='right' class="RichScan" @click="scanQRCode()">扫一扫</div>
    </g-input>
    <g-input title="手机号码" v-model="mobilephone" placeholder="请输入手机号码"></g-input>
    <Verify title="验证码" v-model="verifyCode" ref="callVerifyByCode"></Verify>
    <g-button text="查询" @click.native="newqueryByCard"></g-button>
  </div>
</template>

<script>
import Verify from '@/components/Verify'
import { toQueryFeePage } from '@/config/baseURL'
import wx from 'weixin-js-sdk'
export default {
  name: 'index',
  data () {
    return {
      typeData: [
        {
          value: '01',
          name: '机动车业务'
        },
        {
          value: '02',
          name: '驾驶证业务'
        },
        {
          value: '',
          name: '“9”开头缴费流水业务'
        }
      ],
      feetype: '01',
      mobilephone: '',
      verifyCode: '',
      billNo: ''
    }
  },
  components: {
    Verify
  },
  methods: {
    scanQRCode: function () {
      let that = this
      let ua = window.navigator.userAgent // 浏览器版本
      if (/MicroMessenger/i.test(ua)) {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
            that.billNo = result.split(',')[1]
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
        //         // 成功扫码的情况
        //       if (result.barCode !== undefined) { // 条码
        //         // result.barCode 返回结果
        //         this.billNo = result.barCode
        //       } else if (result.qrCode !== undefined) { // 二维码
        //         // result.barCode 返回结果
        //         this.billNo = result.barCode
        //       } else if (result.cardNumber !== undefined) { // 银行卡
        //         // result.barCode 返回结果
        //         this.billNo = result.barCode
        //       }
        //     }
        //   })
        // } else {
        //   window.alert('请在钱包8.1以上版本运行')
        // }
      }
    },
    newqueryByCard () {
      if (!this.billNo) {
        this.$toast('请输入缴款编号')
        return
      }
      if (this.$verification.isPhone(this.mobilephone)) return
      if (!this.$refs.callVerifyByCode.checkCode()) return
      let reqData = {
        sourceOfCertification: 'C',
        billNo: this.feetype + this.billNo,
        mobilephone: this.mobilephone
      }
      console.log(reqData)
      this.$axios.post(toQueryFeePage, reqData).then(json => {
        if (json.code === '0000') {
          window.location.href = json.msg
        } else {
          this.$toast(json.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .feePayment {
    .feePayment-head {
      background: #c3c3c3;
      padding: 0 1rem;
      color: #fff;
      font-size: 28px;
      line-height: 75px;
      img {
        width: 32px;
        height: 36px;
        vertical-align: middle;
        margin-right: 10px;
      }
    }
    .RichScan {
      width: 22%;
      line-height: 56px;
      border-radius: 8px;
      text-align: center;
      background-color: #174ed0;
      color: #fff;
      margin-left: 16px;
    }
  }
</style>
