<template>
    <div class="insuranceBills-box">
      <mt-swipe :continuous="false" id="commerce-box" :auto="0" :speed="300">
        <mt-swipe-item v-for="(item, index) in commerceData">
          <div class="insuranceBills-box-list">
            <div class="box-header">
              保单号码：{{ item.insuranceno }}
            </div>
            <div class="box-content">
              <div class="box-content-item">
                <span>车牌号码：</span><em>{{ item.carnumber }}</em>
              </div>
              <div class="box-content-item item-inline">
                <span>车辆类型：</span><em>{{ item.cartype }}</em>
              </div>
              <div class="box-content-item item-inline">
                <span>发动机号：</span><em>{{ item.enginenumber }}</em>
              </div>
              <div class="box-content-item">
                <span>车架号：</span><em>{{ item.vin }}</em>
              </div>
              <div class="box-content-item item-inline">
                <span>车险来源：</span><em>{{ item.ly }}</em>
              </div>
              <div class="box-content-item item-inline">
                <span>保单类型：</span><em>{{ item.insurancetype }}</em>
              </div>
              <div class="box-content-item blue-color">
                <span>写入时间：</span><em>{{ item.lrsj }}</em>
              </div>
              <div class="box-content-item item-code">
                <span>二维码</span>
                <div class="code" :id="'qrCode' + index"></div>
              </div>
              <div class="box-content-item item-time">
                <em>开始时间</em>
                <span>{{ item.startdate }}</span>
              </div>
              <div class="box-content-item item-time">
                <em>截止时间</em>
                <span>{{ item.enddate }}</span>
              </div>
            </div>
          </div>
        </mt-swipe-item>
      </mt-swipe>
      <noInsuranceBills v-if="isShowNoInsuranceBills"></noInsuranceBills>
    </div>
</template>
<script>
  import { resultPost } from '../../../service/getData'
  import { getElectronicPolicy } from '../../../config/baseUrl'
  export default {
    name: 'commerce',
    data () {
      return {
        commerceData: [],
        isShowNoInsuranceBills: false,
        dataLen: 0
      }
    },
    beforeMount () {
      let reqData = {
        identityCard: window.localStorage.getItem('identityCard') || '',                  // 身份证
        licensePlateNumber: window.localStorage.getItem('myNumberPlate') || '',           // 车牌号
        mobileNumber: window.localStorage.getItem('mobilePhone'),                         // 手机号
        licensePlateType: window.localStorage.getItem('plateType') || ''                  // 车牌类型
      }
      resultPost(getElectronicPolicy, reqData).then(json => {
        if (json.code === '0000') {
          json.data.forEach((item, index) => {
            if (item.insurancetype === '商业险') {
              this.commerceData.push(item)
              setTimeout(() => {
                let qrCode = new window.QRCode(document.getElementById(`qrCode${this.dataLen}`), {
                  width: 100,
                  height: 100
                })
                qrCode.makeCode(item.ewm)
                this.dataLen++
              }, 0)
            }
          })
        }
        if (this.commerceData.length === 0) {
          this.isShowNoInsuranceBills = true
        } else {
          this.isShowNoInsuranceBills = false
        }
      })
    },
    components: {
      'noInsuranceBills': require('./noInsuranceBills.vue')
    }
  }
</script>
<style lang="less">
.insuranceBills-box{
  position: relative;
  min-height: 850px;
  #commerce-box{
    padding: 34px 50px 0;
    box-sizing: border-box;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .insuranceBills-box-list{
    border: 2px solid #40aadb;
    position: relative;
    border-radius: 8px;
    .box-header{
      background-color: #40aadb;
      font-size: 28px;
      color: #fff;
      font-weight: 600;
      line-height: 80px;
      text-indent: 44px;
    }
    .box-content{
      padding: 20px 40px;
      .box-content-item{
        font-size: 26px;
        line-height: 50px;
        min-width: 49%;
        span{
          color: #999;
        }
        em{
          font-style: normal;
          color: #333;
        }
      }
      .item-inline{
        display: inline-block;
      }
      .blue-color{
        span{
          color: #40aadb;
        }
        em{
          color: #40aadb;
        }
      }
      .item-code{
        padding: 30px 0;
        span{
          display: block;
          width: 100%;
          text-align: center;
        }
        .code{
          width: 200px;
          height: 200px;
          margin: 0 auto;
        }
      }
      .item-time{
        font-weight: 600;
        width: 49%;
        display: inline-block;
        text-align: center;
        span{
          display: block;
          font-size: 40px;
          line-height: 60px;
        }
      }
    }
  }
}
.mint-swipe-indicator{
  width: 20px !important;
  height: 20px !important;
  background-color: #40aadb !important;
}
.mint-swipe-indicator.is-active{
  opacity: 1;
}
</style>

