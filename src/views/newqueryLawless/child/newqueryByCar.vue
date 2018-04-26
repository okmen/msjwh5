<!-- 违法查询 -->
<template>
  <div class="newqueryByCar">
    <div class="newqueryByCar-nav">
      <ul>
        <li v-for="item in carArr" @click="newqueryByCar(item, 'click')">
          <span>{{ item.myNumberPlate }}</span>
          <i>{{ item.lawlessNum }}</i>
          <em class="blue" v-if="item.isMySelf == '0'">本人</em>
          <em class="yellow" v-else>他人</em>
        </li>
      </ul>
    </div>
    <g-button class="btnn" text="驾驶证查询" @click.native="drivingLicenseEnquiry"></g-button>
    <p class="hint">温馨提示：可查粤B牌车全国的违法及外地车深圳的违法</p>
  </div>
</template>

<script>
import { GButton } from 'form'
import { queryLawlessByCar } from '@/config/baseURL'
export default {
  name: 'newqueryByCar',
  data () {
    return {
      carArr: [],
      mobilePhone: ''
    }
  },
  components: {
    GButton
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
      this.mobilePhone = this.$store.state.user.mobilePhone
      let cars = this.$store.state.user.cars === undefined ? [] : this.$store.state.user.cars
      // 判断没有绑定车辆跳转车辆查询
      if (cars.length !== 0 && cars[0].myNumberPlate) {
        cars.forEach((item) => {
          this.newqueryByCar(item, 'init')
        })
      } else {
        this.$router.push({path: '/newqueryByCar_manual', query: this.queryURL})
      }
    },
    newqueryByCar (item, type) {
      let reqData = {
        sourceOfCertification: 'C',
        licensePlateNo: item.myNumberPlate,
        licensePlateType: item.plateType,
        vehicleIdentifyNoLast4: item.behindTheFrame4Digits,
        identityCard: item.identityCard,
        mobilephone: this.mobilePhone
      }
      this.$axios.post(queryLawlessByCar, reqData).then(json => {
        if (json.code === '0000') {
          item.lawlessNum = json.data.length
          let lawlessData = {
            info: item,
            data: json.data
          }
          if (type === 'click') {
            this.$store.commit('saveNewLawlessQuery', lawlessData)
            // this.$router.push('/newLawlessMsg')
            this.$router.push({path: '/newLawlessMsg', query: this.queryURL})
          }
        } else {
          if (type === 'click') {
            this.$toast({
              message: json.msg,
              position: 'middle',
              duration: 2000
            })
          }
        }
        // this.carArr.includes(item) ? false : this.carArr.push(item)
        if (!this.carArr.includes(item)) {
          this.carArr.push(item)
        }
      })
    },
    drivingLicenseEnquiry () {
      this.$router.push({path: '/newqueryByCard', query: this.queryURL})
    }
  }
}
</script>

<style lang="less" scoped>
  .newqueryByCar {
    padding: 30px 30px 0;
    .newqueryByCar-nav {
      li {
        height: 104px;
        border: 2px solid #2696dd;
        border-radius: 6px;
        padding-left: 130px;
        position: relative;
        margin-top: 20px;
        &::after{
          content: '';
          position: absolute;
          top:50%;
          left: 40px;
          transform: translateY(-50%);
          width: 43px;
          height: 34px;
          background-image: url('../../../assets/images/car1.png');
          background-size: cover;
        }
        &::before{
          content: '';
          position: absolute;
          top: 50%;
          right: 40px;
          transform: translateY(-50%);
          width: 21px;
          height: 38px;
          background-image: url('../../../assets/images/arrow_blue.png');
          background-size: cover;
        }
        span{
          font-size: 40px;
          font-weight: 600;
          color: #2696dd;
          line-height: 100px;
        }
        i{
          display: block;
          position: absolute;
          font-size: 18px;
          background-color: red;
          color: #fff;
          border-radius: 20px;
          left: 65px;
          top: 15px;
          padding: 0 9px;
          z-index: 10;
        }
        em{
          font-style: normal;
          display: inline-block;
          width: 60px;
          height: 30px;
          font-size: 20px;
          color: #fff;
          text-align: center;
          border-radius: 10Px;
        }
        em.blue{
          background-color: #2696dd;
        }
        em.yellow{
          background-color: #ffbe00;
        }
      }
    }
    .btnn {
      padding: 0
    }
    .hint {
      /*margin-top: 10px;*/
      font-size: 24px;
      color: #666
    }
  }
</style>