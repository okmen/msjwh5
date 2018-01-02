<template>
  <div class="myCar-outer">
    <mt-swipe :continuous="false" id="car-swipe-box" :auto="0" :speed="300" v-if="show" :style="{height: 235+ sumHeight+'px'}">
      <mt-swipe-item v-for="(car, index) in carMsg" key="index">
        <div class="car-box">
          <div class="car-number">
            <i class="car-icon"></i>
            {{ car.numberPlateNumber }}
            <span class="myself" v-if="car.isMyself == '本人'">本人</span>
            <span class="others" v-else>他人</span>
            <span class="unbind" @click="unbindMyCar(car)">解除绑定</span>
          </div>
          <div class="car-status">
            <ul>
              <li>车牌类型:<span>{{ plateTypeList[car.plateType] }}</span></li>
              <li>年审时间:<span>{{ car.annualReviewDate }}</span><span style="color:#aaa">{{ car.annualReviewDateRemind
                }}</span></li>
            </ul>
          </div>
          <div class="car-user" v-if="car.isMyself == '本人'&&car.list">
            <div class="user-title">车辆使用人</div>
            <ul v-for="other in others">
              <li>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名:<span>{{ other.name }}</span></li>
              <li>身份证号:<span>{{ other.iDcard }}</span><span class="other-unbind" @click="unbindOthers(other, car)">解除他的绑定</span></li>
              <li>手机号码:<span>{{ other.mobilephone }}</span></li>
            </ul>
          </div>
        </div>
      </mt-swipe-item>
    </mt-swipe>
    <g-button text="添加车辆" @click.native="theNextStep"></g-button>
  </div>
</template>
<style lang="less" scoped>
  .myCar-outer {
    margin-top: 40px;
    padding:0 50px;
    height: 100%;
    overflow: hidden;
    .car-box {
      font-size:0.75rem;
      border:1px solid #a7d9f9;
      border-bottom:none;
      background-color: #fff;
      border-radius: 4px;
      span {
        margin-left: 20px;
      }
      .car-number {
        padding-left: 40px;
        height: 80px;
        line-height: 80px;
        color:#2696dd;
        font-weight: bold;
        border-bottom:1px solid #a7d9f9;
        position: relative;
        .car-icon {
          background-image: url("../../assets/images/car1.png");
          background-size: cover;
          display: inline-block;
          width: 52px;
          height: 40px;
          vertical-align: -8px;
        }
        span {
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
        .unbind {
          color: #2696dd;
          border:1px solid #2696dd;
          border-radius: 4px;
          position: absolute;
          right: 40px;
          height: 38px;
          line-height: 35px;
          top: 50%;
          margin-top: -16px;
        }
      }
      .car-deal {
        padding:0 36px;
        height: 74px;
        line-height: 74px;
        border-bottom:1px solid #a7d9f9;
        i {
          display: inline-block;
          width: 10px;
          height: 20px;
          background-image: url("../../assets/images/arrow_right.png");
          background-size: cover;
          float:right;
          margin-top:24px;
        }
      }
      .car-status {
        padding: 22px 36px;
        border-bottom:1px solid #a7d9f9;
        ul li{
          height: 60px;
          line-height: 60px;
        }
      }
      .car-user {
        padding: 22px 36px;
        border-bottom:1px solid #a7d9f9;
        .user-title {
          font-weight: bold;
          margin-bottom: 10px;
        }
        ul {
          margin-bottom: 20px;
        }
        ul li{
          height: 50px;
          .other-unbind {
            color: #2696dd;
            border:1px solid #2696dd;
            border-radius: 4px;
            padding: 0 8px;
            position: absolute;
            right:40px;
          }
        }
      }
    }
    .addCar-box {
      text-align: center;
      padding-bottom: 50px;
      .add-car {
        margin-top: 0;
        color:#fff;
        display: inline-block;
        text-align: center;
        line-height: 80px;
        font-weight: bold;
        width: 70%;
      }
    }
  }
  #car-swipe-box{
    box-sizing: border-box;
    width: 100%;
    margin-bottom: 40px;
    height: 470px;
    .mint-swipe-items-wrap {
      &:after { display: block; content: "clear"; height: 0; clear: both; overflow: hidden; visibility: hidden; }
    }
  }
</style>
<style lang="less">
  .mint-swipe-indicator{
    width: 20px !important;
    height: 20px !important;
    background-color: #40aadb !important;
  }
  .mint-swipe-indicator.is-active{
    opacity: 1;
  }
</style>
<script>
  import { GButton } from 'form'
  import { bindCar, unbindTheOtherDriverUseMyCar, unbindVehicle } from '@/config/baseURL'
  import axios from '@/utils/axios'
  import { Indicator } from 'mint-ui'
  export default {
    name: 'myCar',
    data () {
      return {
        show: false,
        carMsg: '',       // 用户绑定的车辆列表
        others: '',       // 车辆的使用人列表
        listNum: '',
        sumHeight: '',
        identityCard: '',
        numberPlateNumber: '',
        carNumber: '',
        mobilephone: '',
        vehicleIdentifyNoLast4: '',
        plateTypeList: {
          '02': '蓝牌',
          '01': '黄牌',
          '06': '黑牌',
          '51': '小型新能源车号牌',
          '52': '大型新能源车号牌'
        }
      }
    },
    components: {
      GButton
    },
    computed: {
      source () {
        return this.$store.state.core.source
      },
      queryURL () {
        return this.$store.getters.queryURL
      }
    },
    created () {
      let val = this.$store.state.user
      this.identityCard = val.identityCard
      this.mobilephone = val.mobilePhone
      this.numberPlateNumber = val.myNumberPlate
      this.vehicleIdentifyNoLast4 = val.behindTheFrame4Digits
    },
    methods: {
      theNextStep () {
        this.$router.push({path: '/addVehicle', query: this.queryURL})
      },
      // 车辆解绑操作
      unbindMyCar: function (item) {
        this.$MessageBox.confirm('确定解绑车辆?').then(action => {
          let reqData = {
            loginUser: this.identityCard,
            licensePlateType: item.plateType,
            licensePlateNumber: item.numberPlateNumber.slice(1),
            IDcard: item.identityCard,
            sourceOfCertification: this.source,
            identificationNO: 'A'
          }
          console.log(reqData)
          axios.post(unbindVehicle, reqData).then(json => {
            console.log(json)
            if (json.code === '0000') {
              this.$toast({message: '解绑成功'})
              this.initData()
            } else {
              Indicator.close()
              this.$toast({message: json.msg})
            }
          })
        })
      },
      // 本人车辆他人解绑操作
      unbindOthers: function (other, car) {
        this.$MessageBox.confirm('确定解除他的绑定?').then(action => {
          // 解绑操作
          let reqData = {
            loginUser: this.identityCard,
            plateType: car.plateType,
            numberPlateNumber: this.numberPlateNumber,
            IDcard: other.iDcard,
            sourceOfCertification: this.source,
            userSource: this.source
          }
          console.log(reqData)
          Indicator.open()
          axios.post(unbindTheOtherDriverUseMyCar, reqData).then(json => {
            console.log(json)
            if (json.code === '0000') {
              this.$toast({message: '解绑成功'})
              this.initData()
            } else {
              Indicator.close()
              this.$toast({message: json.msg})
            }
          })
        })
      },
      initData: function () {
        let reqData = {
          identityCard: this.identityCard,
          mobilephone: this.mobilephone
        }
        axios.post(bindCar, reqData).then(json => {
          Indicator.close()
          console.log(json)
          if (json.code === '0000') {
            if (json.data.length !== 0) {
              this.show = true
              this.carMsg = json.data
              this.others = json.data[0].list
              this.listNum = json.data[0].list.length
              this.sumHeight = 90 * this.listNum
            }
          } else {
            this.$toast({message: json.msg})
          }
        })
      }
    },
    mounted () {
      this.initData()
      // let data = [
      //   {
      //     annualReviewDate: '2018-12-31',
      //     annualReviewDateRemind: '距离年审时间还有369天',
      //     behindTheFrame4Digits: '9094',
      //     identityCard: '622822198502074110',
      //     illegalNumber: '0',
      //     isMyself: '本人',
      //     list: [
      //       {
      //         iDcard: '362426199303075211',
      //         mobilephone: '17779607572',
      //         name: '罗荣华'
      //       },
      //       {
      //         iDcard: '445222199209020034',
      //         mobilephone: '15920050177',
      //         name: '张宇帆'
      //       }
      //     ],
      //     mobilephone: '15920071829',
      //     name: '王玉璞',
      //     numberPlateNumber: '粤B6F7M1',
      //     otherPeopleUse: '车辆其他使用人',
      //     plateType: '02'
      //   },
      //   {
      //     annualReviewDate: '2018-12-31',
      //     annualReviewDateRemind: '距离年审时间还有369天',
      //     behindTheFrame4Digits: '9094',
      //     identityCard: '622822198502074110',
      //     illegalNumber: '1',
      //     isMyself: '非本人',
      //     mobilephone: '15920071829',
      //     name: '张宇帆',
      //     numberPlateNumber: '粤B6A42E',
      //     otherPeopleUse: '车辆其他使用人',
      //     plateType: '02'
      //   }
      // ]
      // this.show = true
      // this.carMsg = data
      // this.others = data[0].list
      // this.listNum = data[0].list.length
      // this.sumHeight = 90 * this.listNum
    }
  }
</script>
