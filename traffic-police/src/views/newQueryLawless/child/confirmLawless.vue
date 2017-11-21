<template>
  <div class="confirmLawless-outer">
    <div class="confirm-item" v-for="car in carArr">
      <div @click="getLawlessData(car, 'click')">
        <div class="car-number">
          <i class="car-icon"></i>
          {{ car.myNumberPlate }}
          <span class="myself" v-if="car.isMySelf == '0'">本人</span>
          <span class="others" v-else>他人</span>
        </div>
        <div class="item-bottom">您有 <i>{{ car.lawlessNum || 0 }}</i> 笔违法需要处理</div>
        <div class="item-arrow"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import { getClaimConfirm } from '../../../config/baseUrl'
  import { resultPost } from '../../../service/getData'
  import { Toast, MessageBox } from 'mint-ui'
  export default {
    name: 'confirm',
    data () {
      return {
        carArr: [],
        licensePlateNo: '',
        illegalNumber: '',
        plateType: '',
        isMyself: ''
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      getLawlessData (item, type) {
        let reqData = {
          licensePlateNo: item.myNumberPlate,
          licensePlateType: item.plateType,
          vehicleIdentifyNoLast4: item.behindTheFrame4Digits,
          identityCard: item.identityCard,
          sourceOfCertification: 'C',
          mobilephone: window.localStorage.getItem('mobilePhone')
        }
        console.log(reqData)
        resultPost(getClaimConfirm, reqData).then(json => {
          if (json.code === '0000') {
            item.lawlessNum = json.data.length
            let lawlessData = {
              info: item,
              // 兼容新接口
              data: json.data.map(el => {
                el.billNo = el.billNo || el.illegalNo || ''
                el.isNeedClaim = el.isNeedClaim || el.dealType || ''
                el.illegalUnit = el.illegalUnit || el.agency || ''
                return el
              })
            }
            if (type === 'click') {
              this.$store.commit('saveNewLawlessQuery', lawlessData)
              this.$router.push(/_WeChat/g.test(this.$route.name) ? '/newLawlessMsg_WeChat' : '/newLawlessMsg?type=confirm')
            }
          } else {
            if (type === 'click') {
              Toast({
                message: json.msg,
                position: 'middle',
                duration: 2000
              })
            }
          }
          this.carArr.includes(item) ? false : this.carArr.push(item)
        })
      },
      init () {
        let cars = JSON.parse(window.localStorage.cars) || []
        if (cars.length === 0) {
          MessageBox('提示', '暂无车辆,你可以通过深圳交警微信号的“个人中心”绑定车辆').then(action => {
            this.$router.push('/')
          })
        }
        cars.forEach((item) => {
          this.getLawlessData(item, 'init')
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
