<template>
  <div class="confirmLawless-outer">
    <div class="confirm-item" v-for="(car,index) in cars" :key="index">
      <div @click="getLawlessData(car)">
        <div class="car-number">
          <i class="car-icon"></i>
          {{ car.myNumberPlate }}
          <span class="myself" v-if="car.isMySelf == '0'">本人</span>
          <span class="others" v-else>他人</span>
        </div>
        <div class="item-arrow"></div>
      </div>
    </div>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>

<script>
  import { toQueryElectronicReceiptPage } from '@/config/baseURL.js'
  export default {
    name: 'confirm',
    data () {
      return {
        cars: []
      }
    },
    mounted () {
      this.cars = JSON.parse(window.localStorage.getItem('cars'))
      this.isLogin = window.localStorage.getItem('isLogin')
      // 判断是否登录和绑定车辆！没有登录直接跳转登录,没有绑定车辆直接跳转绑定车辆
      if (!this.isLogin) {
        this.$router.push('/login')
      } else if (this.cars.length === 0) {
        this.$MessageBox({
          title: '温馨提示',
          message: '暂无车辆,你可以通过深圳交警微信号的“个人中心”绑定车辆'
        }).then(action => {
          this.$router.push('/')
        })
      }
    },
    methods: {
      getLawlessData: function (obj) {
        console.log(obj)
        let digitalReceiptData = {
          drivingLicenceNo: obj.identityCard || '',
          licensePlateNo: obj.myNumberPlate,
          billNo: '',
          licenseType: obj.plateType
        }
        this.$axios.post(toQueryElectronicReceiptPage, digitalReceiptData).then(json => {
          if (json.code === '0000') {
            this.digitData = json.data
            this.$router.push({path: 'digitalReceiptRecord', query: {answererror: JSON.stringify(this.digitData)}})
          } else {
            this.$MessageBox({
              title: '提示',
              message: json.msg
            })
          }
        })
      }
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
          display: inline-block;
          background-image: url("../../../assets/images/car1.png");
          background-size: cover;
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
        position: absolute;
        right:20px;
        top:50%;
        margin-top: -26px;
        background: url("../../../assets/images/arrow_blue.png") no-repeat;
        background-size: contain;
        width: 28px;
        height: 52px;
      }
    }
  }
</style>
