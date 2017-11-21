<template>
  <div class="newQueryByCar-outer">
    <div class="newQueryByCar-carArr">
      <ul>
        <li v-for="item in carArr" @click="getLawlessData(item, 'click')">
          <span>{{ item.myNumberPlate }}</span>
          <i>{{ item.lawlessNum }}</i>
          <em class="blue" v-if="item.isMySelf == '0'">本人</em>
          <em class="yellow" v-else>他人</em>
        </li>
      </ul>
    </div>
    <div class="newQueryByCar-btn">
      <!-- <router-link to="newqueryByCar_manual">其他车辆查询</router-link> -->
      <!--<router-link to="newqueryByCard">驾驶证查询</router-link>-->
      <div class="newQueryByCar-hint">
        <p>温馨提示：可预约粤B牌车全国的违法及外地车深圳的违法</p>
      </div>
    </div>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>
<script>
  import { resultPost } from '../../../service/getData'
  import { queryLawlessByCar } from '../../../config/baseUrl'
  // import { verifyCode } from '../../../config/verifyCode'
  import { Toast } from 'mint-ui'
  export default {
    name: 'newQueryByCar',
    data () {
      return {
        carArr: []
      }
    },
    mounted () {
      if (window.localStorage.isLogin === undefined || this.$route.query.type === 'nologin') {
        this.$router.replace('newqueryByCar_manual?type=nologin')
        return false
      }
      this.init() // 初始化页面，查询名下所有车辆的违法
    },
    methods: {
      getLawlessData (item, type) {
        let reqData = {
          licensePlateNo: item.myNumberPlate,
          licensePlateType: item.plateType,
          vehicleIdentifyNoLast4: item.behindTheFrame4Digits,
          identityCard: item.identityCard,
          mobilephone: item.mobilephone
        }
        console.log(reqData)
        resultPost(queryLawlessByCar, reqData).then(json => {
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
              this.$router.push('/illegalAppointmentMs')
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
        let cars = window.localStorage.cars === undefined ? [] : JSON.parse(window.localStorage.cars)
        if (cars.length === 0) {
          this.$router.replace('newqueryByCar_manual')
          return
        }
        cars.forEach((item) => {
          this.getLawlessData(item, 'init')
        })
      }
    }
  }
</script>
