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
      <router-link to="newqueryByCard">驾驶证查询</router-link>
      <div class="newQueryByCar-hint">
        <p>温馨提示：可查粤B牌车全国的违法及外地车深圳的违法</p>
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
            let lawlessData = {
              info: item,
              data: json.data
            }
            if (type === 'click') {
              this.$store.commit('saveNewLawlessQuery', lawlessData)
              this.$router.push('/newLawlessMsg')
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
<style lang="less">
  .newQueryByCar-outer{
    padding: 30px 30px 0 ;
    .newQueryByCar-carArr{
      li{
        border: 2px solid #2696dd;
        border-radius: 6Px;
        height: 104px;
        position: relative;
        padding-left: 130px;
        box-sizing: border-box;
        margin-bottom: 20px;
        &::after{
          content: '';
          position: absolute;
          top: 50%;
          left: 40px;
          transform: translateY(-50%);
          width: 43px;
          height: 34px;
          background-image: url('../../../images/car1.png');
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
          background-image: url('../../../images/arrow_blue.png');
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
    .newQueryByCar-btn{
      padding: 20px 30px 20px;
      a{
        display: block;
        height: 80px;
        line-height: 80px;
        background-color: #2696dd;
        color: #fff;
        font-size: 32px;
        text-align: center;
        border-radius: 10Px;
        margin-bottom: 20px;
      }
    }
    .newQueryByCar-hint{
      padding-top: 20px;
      p{
        font-size: 24px;
        color: #666;
        span{
          color: #2696dd;
        }
      }
    }
  }
</style>
