<template>
  <div class="p-page">
    <div class="m-tips"><img src="~src/images/feePayment-icon-1.png" alt="">请填写缴费信息</div>
    <div class="m-form">
      <div class="item">
        <label>业务类型</label>
        <div class="box">
          <el-select v-model="form.type" class="zly-select" size="small">
            <el-option
              v-for="item in typeData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="item">
        <label>缴费编号</label>
        <div class="box">
          <el-input v-model="form.number" placeholder="请输入缴费编号" size="small" />
        </div>
        <div class="right">
          <div class="button" @click="scanQRCode()"><i class="code-icon"></i>扫一扫</div>
        </div>
      </div>
      <div class="item">
        <label>手机号码</label>
        <div class="box">
          <el-input v-model="form.tel" placeholder="请输入手机号码" size="small" />
        </div>
      </div>
      <div class="item">
        <label>验证码</label>
        <div class="box">
          <el-input v-model="form.code" placeholder="请输入验证码" id="inp" size="small"/>
        </div>
        <div class="right"><div id="code" class="button"></div></div>
      </div>
      <div class="item">
        <div class="btn submit" @click="submit">查询</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Select, Option, Input } from 'element-ui'
import { verifyCode } from '../../config/verifyCode.js'
import { resultPost } from '../../service/getData'
import { toQueryFeePage } from '../../config/baseUrl'
import { Toast } from 'mint-ui'
import wx from 'weixin-js-sdk'
export default {
  components: {
    'el-select': Select,
    'el-option': Option,
    'el-input': Input
  },
  data () {
    return {
      typeData: [
        {
          value: '01',
          label: '机动车业务'
        },
        {
          value: '02',
          label: '驾驶证业务'
        },
        {
          value: '',
          label: '“9”开头缴费流水业务'
        }
      ],
      verifyCode: false,
      form: {
        type: '01',
        number: '',
        tel: ''
      }
    }
  },
  methods: {
    // 微信扫一扫
    scanQRCode () {
      let that = this
      let ua = window.navigator.userAgent // 浏览器版本
      if (/MicroMessenger/i.test(ua)) {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
            that.from.number = result.split(',')[1]
          }
        })
      } else {
        if ((window.Ali.alipayVersion).slice(0, 3) >= 8.1) {
          window.Ali.scan({
            type: 'qr'
          }, function (result) {
            if (result.errorCode) {
              // 没有扫码的情况
              // errorCode=10，用户取消
              // errorCode=11，操作失败
              switch (result.errorCode) {
                case 10:
                  window.alert('用户取消')
                  break
                default:
                  window.alert('操作失败')
              }
            } else {
                // 成功扫码的情况
              if (result.barCode !== undefined) { // 条码
                // result.barCode 返回结果
                this.from.number = result.barCode
              } else if (result.qrCode !== undefined) { // 二维码
                // result.barCode 返回结果
                this.from.number = result.barCode
              } else if (result.cardNumber !== undefined) { // 银行卡
                // result.barCode 返回结果
                this.from.number = result.barCode
              }
            }
          })
        } else {
          window.alert('请在钱包8.1以上版本运行')
        }
      }
    },
    // 提交查询
    submit () {
      if (!/^1\d{10}$/.test(this.form.tel)) {
        Toast({
          message: '手机号码格式错误',
          position: 'bottom'
        })
        return false
      }
      if (!this.form.number) {
        Toast({
          message: '请输入缴费编号',
          position: 'bottom'
        })
        return false
      }
      if (!this.verifyCode) {
        Toast({
          message: '验证码错误',
          position: 'bottom'
        })
        return false
      }
      let reqData = {
        billNo: this.form.type + this.form.number,
        mobilephone: this.form.tel
      }
      console.log(reqData)
      resultPost(toQueryFeePage, reqData).then(json => {
        if (json.code === '0000') {
          window.location.href = json.msg
        } else {
          Toast({
            message: json.msg,
            position: 'middle'
          })
        }
      })
    }
  },
  mounted () {
    // 挂载验证码，并注册验证回调函数
    verifyCode(document.querySelector('#inp input'), document.getElementById('code'), (result, code) => {
      if (!result) {
        Toast({
          message: '验证码错误',
          position: 'bottom'
        })
        return false
      }
      this.verifyCode = result
    })
  }
}
</script>

<style lang="less" scoped>
@import '~src/style/form.less';
@import 'style/feePayment.less';
</style>