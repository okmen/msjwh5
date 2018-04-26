<template>
  <div class="newPayLawless">
    <g-select title="业务类型" :data="isPedestrian" v-model="isPedestrianShowMessage"></g-select>
    <g-input class="changeCard-inputPhoto" maxlength="25" title="处罚决定书号" placeholder="请输入缴款编号" v-model="billNo" type="tel">
      <div slot='right' class="RichScan" @click="scanQRCode()">扫一扫</div>
    </g-input>
    <plate-number-full v-if="isPedestrianShowMessage == '1'" v-model="plateNumber"></plate-number-full>
    <Verify title="验证码" v-model="verifyCode" ref="callVerifyByCode"></Verify>
    <g-button text="查询" @click.native="newqueryByCard"></g-button>
    <div class="hint">
      <h4>温馨提示：</h4>
      <p class="pay-red">无处罚决定书，请前往“违法在线处理”进行查询或缴费</p>
      <p>缴款交易提示成功的，违法记录将以24小时内完成核销，请您在交易成功24小时以后查询违法处理结果，请勿急于重复缴款。如违法记录仍未核销的 款项将在15日内退回。</p>
    </div>
  </div>
</template>

<script>
import { queryPay } from '@/config/baseURL'
import PlateNumberFull from '@/components/PlateNumberFull'
import Verify from '@/components/Verify'
import wx from 'weixin-js-sdk'
export default {
  name: 'newPayLawless',
  data () {
    return {
      plateNumber: '',
      isPedestrianShowMessage: '1',
      isPedestrian: [
        {name: '机动车', value: '1'},
        {name: '行人/非机动车驾驶人', value: '0'}
      ],
      billNo: '',
      verifyCode: ''
    }
  },
  components: {
    PlateNumberFull, Verify
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
      } else if (!this.plateNumber && this.isPedestrianShowMessage === '1') {
        this.$toast('请输入车牌号码')
      } else if (!this.$refs.callVerifyByCode.checkCode()) {
        return false
      } else {
        if (this.isPedestrianShowMessage === '0') {
          this.plateNumber = '无'
        }
        let reqData = {
          sourceOfCertification: 'C',
          billNo: this.billNo,
          licensePlateNo: this.plateNumber.toLocaleUpperCase()
        }
        console.log(reqData)
        this.$axios.post(queryPay, reqData).then(json => {
          if (json.code === '0000') {
            window.location.href = json.msg
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .newPayLawless {
    .RichScan {
      width: 22%;
      line-height: 56px;
      border-radius: 8px;
      text-align: center;
      background-color: #174ed0;
      color: #fff;
      margin-left: 16px;
    }
    .hint {
      padding: 20px 36px;
      .pay-red{
        color: #FF0000;
      }
    }
  }
</style>
