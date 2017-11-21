<template>
  <!-- gjw这里要改成一个滑动 -->
  <div class="drivingCard-outer">
    <div class="body">
      <mt-swipe :continuous="false" id="commerce-box" :auto="0" :speed="300">
        <mt-swipe-item v-for="(item, index) in drivingData">
          <img :src="'data:image/png;base64,' + item.data.electronicDrivingLicense">
          <!--<img :src="codeUrl">-->
          <p>行驶证电子二维码</p>
          <div class="qrCode" :id="'qrCode' + index"></div>
        </mt-swipe-item>
      </mt-swipe>
    </div>
  </div>
</template>
<script>
  import { resultPost } from '../../../service/getData'
  import { drivingCard } from '../../../config/baseUrl'
  import { Toast, Indicator } from 'mint-ui'
  export default {
    name: 'drivingCard',
    data () {
      return {
        drivingData: [],
        drivingJson: {}
      }
    },
    mounted () {
      let carArr = JSON.parse(window.localStorage.cars)
      if (!carArr.length) {
        Toast({
          message: '未绑定车辆',
          position: 'bottom',
          className: 'white'
        })
        return false
      }
      carArr.forEach((item, index) => {
        let reqData = {
          numberPlatenumber: item.myNumberPlate,
          plateType: item.plateType,
          mobileNumber: window.localStorage.mobilePhone
        }
        Indicator.open()
        console.log('请求前===' + index)
        resultPost(drivingCard, reqData).then(json => {
          Indicator.close()
          if (!json.data.electronicDriverLicense) {
            Toast({
              message: json.msg,
              position: 'bottom',
              duration: 2000
            })
          }
          console.log('请求后===' + index)
          if (json.code === '0000') {
            this.drivingData = []
            this.drivingJson[index] = json
            // this.drivingData[index] = json
            Object.keys(this.drivingJson).sort().forEach((x, y) => {
              // console.log(this.drivingJson)
              this.drivingData.push(this.drivingJson[x])
              console.log(this.drivingData)
              setTimeout(() => {
                let qrCode = new window.QRCode(document.getElementById(`qrCode${x}`), {
                  width: 256,
                  height: 256
                })
                qrCode.makeCode(this.drivingJson[x])
              }, 0)
            })
          } else {
            Toast({
              message: json.msg,
              position: 'bottom',
              duration: 2000
            })
          }
        })
      })
    }
  }
</script>
<style lang="less">
  .drivingCard-outer {
    padding: 0 50px;
    height: 100%;
    .title {
      height: 100px;
      line-height: 100px;
      background-color: #fff;
      text-align: center;
    }
    .body {
      height: 80%;
      img {
        width: 100%;
      }
      p{
        text-align: center;
        font-size: 28px;
        padding-top: 50px;
        padding-bottom: 30px;
      }
      .qrCode{
        width: 256px;
        height: 256px;
        overflow: hidden;
        margin: 0 auto;
      }
    }
  }
</style>

