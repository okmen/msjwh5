<template>
  <div class="illegalAppointment">
    <div class="illegalAppointment-nav">
      <ul>
        <li v-for="item in carArr" @click="getLawlessData(item, 'click')">
          <span>{{ item.myNumberPlate }}</span>
          <i>{{ item.lawlessNum }}</i>
          <em class="blue" v-if="item.isMySelf == '0'">本人</em>
          <em class="yellow" v-else>他人</em>
        </li>
      </ul>
    </div>
    <div class="hint">
      <p>温馨提示：可预约粤B牌车全国的违法及外地车深圳的违法</p>
    </div>
  </div>
</template>
<script>
  import { queryLawlessByCar } from '@/config/baseURL'
  export default {
    name: 'illegalAppointment',
    data () {
      return {
        carArr: [],
        mobilePhone: ''
      }
    },
    computed: {
      queryURL () {
        return this.$store.getters.queryURL
      }
    },
    mounted () {
      this.init() // 初始化页面，查询名下所有车辆的违法
    },
    methods: {
      getLawlessData (item, type) {
        let reqData = {
          sourceOfCertification: 'C',
          licensePlateNo: item.myNumberPlate,
          licensePlateType: item.plateType,
          vehicleIdentifyNoLast4: item.behindTheFrame4Digits,
          identityCard: item.identityCard,
          mobilephone: this.mobilePhone
        }
        console.log(reqData)
        this.$axios.post(queryLawlessByCar, reqData).then(json => {
          if (json.code === '0000') {
            item.lawlessNum = json.data.length
            if (type === 'click') {
              let lawlessData = {
                info: {
                  behindTheFrame4Digits: reqData.vehicleIdentifyNoLast4,
                  plateType: reqData.licensePlateType,
                  myNumberPlate: reqData.licensePlateNo,
                  mobilephone: reqData.mobilephone,
                  identityCard: reqData.drivingLicenceNo
                },
                data: json.data
              }
              this.$store.commit('saveNewLawlessQuery', lawlessData)
              // this.$router.push('/illegalAppointmentMs', query: this.queryURL)
              this.$router.push({path: '/illegalAppointmentMs', query: this.queryURL})
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
      },
      init () {
        // 初始化车辆信息
        this.mobilePhone = this.$store.state.user.mobilePhone
        let cars = this.$store.state.user.cars || []
        // 判断没有绑定车辆跳转车辆查询
        if (cars.length !== 0 && cars[0].myNumberPlate) {
          cars.forEach((item) => {
            this.getLawlessData(item, 'init')
          })
        } else {
          this.$router.push({path: '/newqueryByCar_manual', query: this.queryURL})
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .illegalAppointment {
    padding: 30px 30px 0;
    .illegalAppointment-nav {
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
