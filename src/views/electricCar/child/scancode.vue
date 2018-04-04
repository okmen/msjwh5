<template>
  <div class="scancode">
    <div class="scancode-img">
      <img src="../../../assets/images/scanCode.png" alt="">
    </div>
    <p class="scancode-text">扫描电动车或者驾驶人证件上的二维码进行查询</p>
    <g-button text="扫码二维码" @click.native="scancodeClick"></g-button>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import { GButton } from 'form'
export default {
  name: 'scancode',
  data () {
    return {
    }
  },
  components: {
    GButton
  },
  methods: {
    scancodeClick () {
      var source = this.$route.query.source
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
        success: (res) => {
          var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
          this.$router.push({path: '/electrocarFile', query: {source: source, billNo: result}})
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .scancode {
    .scancode-img {
      width: 500px;
      margin: 160px auto 70px;
      img {
        width: 100%;
      }
    }
    .scancode-text {
      text-align: center;
      color: #333;
      font-size: 28px;
      margin-bottom: 20px;
    }
  }
</style>
