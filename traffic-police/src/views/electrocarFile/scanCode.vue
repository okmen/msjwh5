<template>
  <div class="scan-code">
    <div class="scan-code-img">
      <img src="../../images/scanCode.png"/>
    </div>
    <p class="scan-code-reminder">
      扫描电动车或者驾驶人证件上的二维码进行查询
    </p>
    <div class="scan-code-button" @click="scanCode()">扫描二维码</div>
    <!-- <div class="scan-code-button">使用账号密码登录</div> -->
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>
<style lang="less">
.scan-code-img{
  margin: 160px auto 70px;
  width: 500px;
  img{
    width: 100%;
  }
}
  .scan-code-reminder{
    text-align: center;
    font-size: 28px;
    color: #333333;
    margin-bottom: 70px;
  }
  .scan-code-button{
    width: 85%;
    margin: 0 auto 40px;
    border-radius: 8px;
    height: 80px;
    text-align: center;
    line-height: 80px;
    background: #5bc0de;
    color: white;
  }
</style>
<script>
  import wx from 'weixin-js-sdk'
  export default {
    data () {
      return {
        billNo: ''
      }
    },
    methods: {
      /* eslint-disable */
      scanCode: function () {
        // this.$router.push({name: 'electrocarFile', query: { billNo: '440300000003'}})
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
          success: (res) => {
            var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
            this.$router.push({name: 'electrocarFile', query: { billNo: result}})
          }
        })
      }
      /* eslint-enable */
    }
  }
</script>
