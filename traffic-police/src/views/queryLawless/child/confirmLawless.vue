<template>
  <div class="confirmLawless-outer">
    <div class="confirm-item" v-for="car in carMsg">
      <router-link :to="{ name: 'confirmClaim', params: { licensePlateNo: car.numberPlateNumber, plateType: car.plateType, behindTheFrame4Digits: car.behindTheFrame4Digits }}" >
        <div class="car-number">
          <i class="car-icon"></i>
          {{ car.numberPlateNumber }}
          <span class="myself" v-if="car.isMyself == '本人'">本人</span>
          <span class="others" v-else>他人</span>
        </div>
        <div class="item-bottom">您有 <i>{{ car.illegalNumber }}</i> 笔违章需要处理</div>
        <div class="item-arrow"></div>
      </router-link>
    </div>
  </div>
</template>
<script>
  import { bindCar } from '../../../config/baseUrl'
  import { resultPost } from '../../../service/getData'
  import { Indicator, Toast, MessageBox } from 'mint-ui'
  export default {
    name: 'confirm',
    data () {
      return {
        carMsg: [],
        licensePlateNo: '',
        illegalNumber: '',
        plateType: '',
        isMyself: ''
      }
    },
    mounted () {
      let reqData = {
        identityCard: window.localStorage.getItem('identityCard'),
        mobilephone: window.localStorage.getItem('mobilePhone')
      }
      Indicator.open()
      resultPost(bindCar, reqData).then(json => {
        Indicator.close()
        if (json.code === '0000') {
          this.carMsg = json.data
          if (json.data.length === 0) {
            MessageBox('提示', '暂无车辆,你可以通过深圳交警微信号的“个人中心”绑定车辆').then(action => {
              this.$router.push('/')
            })
          }
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
  .confirmLawless-outer {
    padding: 40px 40px;
    .confirm-item {
      display: block;
      position: relative;
      padding-left: 40px;
      width: 100%;
      border: 2px solid #2696dd;
      border-radius: 16px;
      margin-bottom: 40px;
      .car-number {
        height: 100px;
        line-height: 100px;
        color: #2696dd;
        font-weight: bold;
        .car-icon {
          background-image: url("../../../images/car1.png");
          background-size: cover;
          display: inline-block;
          width: 52px;
          height: 40px;
          vertical-align: -8px;
        }
        span {
          vertical-align: 4px;
          padding: 0 10px;
          height: 20px;
          color: #fff;
          font-size: 0.7rem;
          border-radius: 20px;
          &.myself {
            background-color: #2696dd;
          }
          &.others {
            background-color: #ffbe00;
          }
        }
      }
      .item-bottom {
        font-weight: bold;
        color: #333;
        margin-bottom: 28px;
        i {
          color: red;
        }
      }
      .item-arrow {
        background-image: url("../../../images/arrow_blue.png");
        background-repeat:no-repeat;
        background-size: contain;
        width: 28px;
        height: 52px;
        position: absolute;
        right:20px;
        top:50%;
        margin-top: -26px;
      }
    }
  }
</style>
