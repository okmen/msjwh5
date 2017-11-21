<template>
  <div class="myCar-outer">
    <mt-swipe :continuous="false" id="car-swipe-box" :auto="0" :speed="300" v-if="show" :style="{height: 235+ sumHeight+'px'}">
      <mt-swipe-item v-for="(car, index) in carMsg">
        <div class="car-box">
          <div class="car-number">
            <i class="car-icon"></i>
            {{ car.numberPlateNumber }}
            <span class="myself" v-if="car.isMyself == '本人'">本人</span>
            <span class="others" v-else>他人</span>
            <span class="unbind" @click="unbindMyCar(car)">解除绑定</span>
          </div>
          <div class="car-deal" @click="hrefBtn(car)">
            当前本车有{{ car.illegalNumber }}宗违法尚未处理
            <i class="arrow"></i>
          </div>
          <div class="car-status">
            <ul>
              <li>车牌类型:<span>{{ plateTypeList[car.plateType] }}</span></li>
              <li>年审时间:<span>{{ car.annualReviewDate }}</span><span style="color:#aaa">{{ car.annualReviewDateRemind
                }}</span></li>
              <!--<li>{{ car.otherPeopleUse }}<span></span></li>-->
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
    <div class="addCar-box">
      <router-link to="addVehicle" class="add-car btn">添加车辆</router-link>
    </div>
  </div>
</template>
<style lang="less">
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
          background-image: url("../../../images/car1.png");
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
          background-image: url("../../../images/arrow_right.png");
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
<script>
  import { bindCar, queryLawlessByCar, unbindTheOtherDriverUseMyCar, unbindVehicle } from '../../../config/baseUrl'
  import { resultPost } from '../../../service/getData'
  import { Indicator, MessageBox, Toast } from 'mint-ui'
  import { mapActions } from 'vuex'
  export default {
    name: 'myCar',
    data () {
      return {
        show: false,
        carMsg: '',       // 用户绑定的车辆列表
        others: '',       // 车辆的使用人列表
        listNum: '',
        sumHeight: '',
        identityCard: window.localStorage.getItem('identityCard'),
        numberPlateNumber: window.localStorage.getItem('myNumberPlate'),
        carNumber: '',
        mobilephone: window.localStorage.getItem('mobilePhone'),
        vehicleIdentifyNoLast4: window.localStorage.getItem('behindTheFrame4Digits'),
        plateTypeList: {
          '02': '蓝牌',
          '01': '黄牌',
          '06': '黑牌'
        }
      }
    },
    methods: {
      hrefBtn: function (item) {
        console.log(item)
        let that = this
        let reqData = {
          licensePlateType: item.plateType,
          licensePlateNo: item.numberPlateNumber,
          vehicleIdentifyNoLast4: item.behindTheFrame4Digits,
          identityCard: item.identityCard,
          mobilephone: item.mobilephone === 'undefined' ? that.mobilephone : item.mobilephone,
          drivingLicenceNo: item.identityCard
        }
        console.log(reqData)
        Indicator.open()
        // resultPostNoLoading(queryLawlessByCar, reqData).then(json => {
        //   console.log(json)
        //   if (json.code === '0000') {
        //     this.reserveList = json.data
        //     console.log(json.data.length === 0)
        //     if (json.data.length === 0) {
        //       Indicator.close()
        //       MessageBox('提示', '该车辆暂无违法信息')
        //     } else {
        //       json.data.forEach((item, index) => { // 循环dataList 给每个item上面添加 check关联属性
        //         item.checkAddBorder = false
        //       })
        //       that.postAppealQuery(json.data)
        //       Indicator.close()
        //       that.$router.push('/illegalOrderDeal')
        //     }
        //   } else {
        //     Indicator.close()
        //     MessageBox('提示', json.msg)
        //   }
        // })
        resultPost(queryLawlessByCar, reqData).then(json => {
          if (json.code === '0000') {
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
            this.$router.push('newLawlessMsg')
          } else {
            Toast({
              message: json.msg,
              position: 'middle',
              duration: 2000
            })
          }
        })
      },
      unbindMyCar: function (item) {
        MessageBox.confirm('确定解绑车辆?').then(action => {
          // 解绑操作
          let reqData = {
            loginUser: this.identityCard,
            licensePlateType: item.plateType,
            licensePlateNumber: item.numberPlateNumber.slice(1),
            IDcard: item.identityCard,
            sourceOfCertification: 'C',
            identificationNO: 'A'
          }
          console.log(reqData)
//        Indicator.open()
          resultPost(unbindVehicle, reqData).then(json => {
            console.log(json)
            if (json.code === '0000') {
              Toast({
                message: '解绑成功',
                position: 'bottom',
                className: 'white'
              })
              this.initData()
            } else {
              Indicator.close()
              Toast({
                message: json.msg,
                position: 'bottom',
                className: 'white'
              })
            }
          })
        })
      },
      unbindOthers: function (other, car) {
        MessageBox.confirm('确定解除他的绑定?').then(action => {
          // 解绑操作
          let reqData = {
            loginUser: this.identityCard,
            plateType: car.plateType,
            numberPlateNumber: this.numberPlateNumber,
            IDcard: other.iDcard,
            sourceOfCertification: 'C',
            userSource: 'C'
          }
          console.log(reqData)
          Indicator.open()
          resultPost(unbindTheOtherDriverUseMyCar, reqData).then(json => {
            console.log(json)
            if (json.code === '0000') {
              Toast({
                message: '解绑成功',
                position: 'bottom',
                className: 'white'
              })
              this.initData()
            } else {
              Indicator.close()
              Toast({
                message: json.msg,
                position: 'bottom',
                className: 'white'
              })
            }
          })
        })
      },
      initData: function () {
        let reqData = {
          identityCard: this.identityCard,
          mobilephone: this.mobilephone
        }
        resultPost(bindCar, reqData).then(json => {
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
            Toast({
              message: json.msg,
              position: 'bottom',
              duration: 2000
            })
          }
        })
      },
      ...mapActions({
        postAppealQuery: 'postAppealQuery'
      })
    },
    mounted () {
      this.initData()
    }
  }
</script>
