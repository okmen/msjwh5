<template>
  <div class="confirmLawless">
    <div class="confirm-nav" v-for="car in carArr">
        <div @click="getLawlessData(car, 'click')">
        <div class="car-number">
          <i class="car-icon"></i>
          {{ car.myNumberPlate }}
          <span class="myself" v-if="car.isMySelf == '0'">本人</span>
          <span class="others" v-else>他人</span>
        </div>
        <div class="item-bottom">您有 <i>{{ car.lawlessNum || 0 }}</i> 笔违法可以在线确认处理</div>
        <div class="item-arrow"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getClaimConfirm } from '@/config/baseURL'
export default {
  name: 'confirmLawless',
  data () {
    return {
      carArr: [],
      licensePlateNo: '',
      illegalNumber: '',
      plateType: '',
      isMyself: ''
    }
  },
  computed: {
    queryURL () {
      return this.$store.getters.queryURL
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      // 初始化车辆信息
      let cars = this.$store.state.user.cars || []
      // 判断没有绑定车辆跳转车辆查询
      if (cars.length !== 0 && cars[0].myNumberPlate) {
        cars.forEach((item) => {
          this.getLawlessData(item, 'init')
        })
      } else {
        this.$MessageBox.confirm('暂无车辆,你可以通过“个人中心”绑定车辆').then(action => {
          this.$router.push({path: '/personalCenter', query: this.queryURL})
        })
      }
    },
    getLawlessData (item, type) {
      let reqData = {
        licensePlateNo: item.myNumberPlate,
        licensePlateType: item.plateType,
        vehicleIdentifyNoLast4: item.behindTheFrame4Digits,
        identityCard: item.identityCard,
        sourceOfCertification: 'M',
        mobilephone: this.$store.state.user.mobilePhone
      }
      console.log(reqData)
      this.$axios.post(getClaimConfirm, reqData).then(json => {
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
            // this.$router.push(/_WeChat/g.test(this.$route.name) ? '/newLawlessMsg_WeChat' : '/newLawlessMsg?type=confirm')
            let source = this.$route.query.source
            this.$router.push({path: '/newLawlessMsg', query: {source: source, type: 'confirm'}})
          }
        } else {
          if (type === 'click') {
            this.$toast(json.msg)
          }
        }
        if (!this.carArr.includes(item)) {
          this.carArr.push(item)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .confirmLawless {
    padding: 40px 40px;
    .confirm-nav {
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
          background-image: url("../../../assets/images/car1.png");
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
        background-image: url("../../../assets/images/arrow_blue.png");
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
