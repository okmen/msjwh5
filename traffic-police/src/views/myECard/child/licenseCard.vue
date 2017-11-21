<template>
  <div class="licenseCard-outer">
    <div class="body">
      <img :src="imageUrl">
      <!--<img :src="codeUrl">-->
      <p>驾驶证电子二维码</p>
      <div id="qrCode"></div>
    </div>
  </div>
</template>
<script>
  import { resultPost } from '../../../service/getData'
  import { licenseCard } from '../../../config/baseUrl'
  import { Toast, Indicator } from 'mint-ui'
  export default {
    name: 'drivingCard',
    data () {
      return {
        imageUrl: '',
        codeUrl: ''
      }
    },
    mounted () {
      Indicator.open()
      let reqData = {
        driverLicenseNumber: window.localStorage.getItem('identityCard'),
        userName: window.localStorage.getItem('userName'),
        mobileNumber: window.localStorage.getItem('mobilePhone')
      }
      let qrcode = new window.QRCode(document.getElementById('qrCode'), {
        width: 256,
        height: 256
      })
      resultPost(licenseCard, reqData).then(json => {
        Indicator.close()
        if (json.code === '0000') {
          if (!json.data.electronicDriverLicense) {
            Toast({
              message: json.msg,
              position: 'bottom',
              duration: 2000
            })
          }
          this.imageUrl = 'data:image/png;base64,' + json.data.electronicDriverLicense
          qrcode.makeCode(json.data.electronicDriverLicenseQRCode)
        } else {
          Toast({
            message: json.msg,
            position: 'bottom',
            duration: 2000
          })
        }
      })
    }
  }
</script>
<style lang="less">
  .licenseCard-outer {
    padding: 0 50px;
    .title {
      height: 100px;
      line-height: 100px;
      background-color: #fff;
      text-align: center;
    }
    .body {
      img {
        width: 100%;
      }
      p{
        text-align: center;
        font-size: 28px;
        padding-top: 50px;
        padding-bottom: 30px;
      }
      #qrCode{
        width: 40%;
        margin: 0 auto;
      }
    }
  }
</style>
