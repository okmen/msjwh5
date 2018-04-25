<template lang="html">
   <mymap v-if="showMap" @submit="submitMap"></mymap>
   <div v-else class="illegalParking-outer">
      <ul class="illegalParking-from">
         <li class="illegalParking-item">
          <div class="illegalParking-hbs-name">
            <span>驾驶人</span>
          </div>
          <div class="illegalParking-input">
            <input type="text" class="text-input" readonly v-model="driver" placeholder="请输入驾驶人姓名">
          </div>
        </li>
        <li class="illegalParking-item">
          <div class="illegalParking-hbs-name">
            <span>车牌号码</span>
          </div>
          <div class="div-select">
            <span class="btn-select" @click.stop="licenseNoSelectClick()">{{ licensePlateNo }}</span>
            <div class="div-select-ul" v-if="licenseNoSelectShow">
              <ul>
                <li v-for="item in licenseNos" @click.stop = "licenseNoSelectClick(item)">{{item.myNumberPlate}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="illegalParking-item">
          <div class="illegalParking-hbs-name">
            <span>车牌类型</span>
          </div>
          <div class="div-select">

            <input type="text" class="text-input" readonly v-model="licensePlateTypeStr">
          </div>
        </li>
        <li class="illegalParking-item">
          <div class="illegalParking-hbs-name">
            <span>停车地点</span>
          </div>
          <div class="illegalParking-input width-85 left">
            <input type="text" class="text-input" readonly v-model="parkingAddr" placeholder="点击右侧按钮选择地址">
          </div>
          <div class="illegalParking-location right" @click.stop='getLocation()'></div>
        </li>
      </ul>
      <div class="tp-read illegalParking-read">
        <button class="btn" @click="queryList">查询违停免罚记录，请点击这里</button>
        <div class="tp-read-checkbox illegalParking-read-checkbox">
          <input type="checkbox" id="illegalParkingChecked" v-model="checked">
          <label for="illegalParkingChecked"></label>
        </div>
        <span class="read-and-agree">
          我已认真阅读并同意<router-link :to="{path: '/userAgreement/wtmf?type=nohandle'}" class="illegalParking-notice">《十分钟违停免罚须知》</router-link>
        </span>
      </div>
      <div class="tp-btn-sure">
        <button class="btn" @click="nextStep">下一步</button>
      </div>
      <div v-wechat-title="$route.meta.title"></div>
    </div> 
</template>
<script>
 import { MessageBox, Toast } from 'mint-ui'
 export default {
   computed: {
     licensePlateTypeStr: function () {
       let licensePlateTypeStr = ''
       switch (this.licensePlateType) {
         case '01':
           licensePlateTypeStr = '黄牌'
           break
         case '06':
           licensePlateTypeStr = '黑牌'
           break
         default:
           licensePlateTypeStr = '蓝牌'
       }
       return licensePlateTypeStr
     }
   },
   data () {
     return {
       showMap: false, // 显示地图
       driver: '', // 驾驶人姓名
       licensePlateNo: '', // 选中的车牌
       licenseNoSelectShow: false, // 车牌号码下拉框显示
       parkingAddr: '', // 停车地点
       checked: false // 勾选已阅读须知
     }
   },
   beforeRouteEnter (to, from, next) {
     next(vm => {
       if (from.name === 'userAgreement' || from.name === 'queryIllegalParking' || from.name === 'illegalParking_takePhoto') {
         vm.checked = vm.$store.state.pageRecord.data.reading || false
         vm.parkingAddr = vm.$store.state.pageRecord.data.parkingAddr
       }
     })
   },
   watch: {
     checked () {
       return this.savePageRecord()
     },
     parkingAddr () {
       return this.savePageRecord()
     }
   },
   methods: {
     getLocation: function () { // 显示地图
       this.showMap = true
     },
     queryList () {
       if (!this.licensePlateNo) {
         Toast({
           message: '请选择车牌号码',
           duration: 2000
         })
         return false
       }

       if (!this.licensePlateType) {
         Toast({
           message: '请选择车牌类型',
           duration: 2000
         })
         return false
       }
       this.$router.push(`/queryIllegalParking?number=${this.licensePlateNo}&type=${this.licensePlateType}`)
     },
     nextStep () { // 点击下一步
       let deltaT = Date.now() - this.entryTime
       if (deltaT >= 10 * 60 * 1000) { // 超过十分钟
         MessageBox('提示', '你已经超时操作').then(action => {
           this.$router.push('/')
         })
         return false
       }
       if (!this.licensePlateNo) {
         Toast({
           message: '请选择车牌号码',
           duration: 2000
         })
         return false
       }

       if (!this.licensePlateType) {
         Toast({
           message: '请选择车牌类型',
           duration: 2000
         })
         return false
       }

       if (!this.parkingAddr) {
         Toast({
           message: '请选择停车地点',
           duration: 2000
         })
         return false
       }

       if (!this.driver) {
         Toast({
           message: '请输入驾驶人姓名',
           duration: 2000
         })
         return false
       }

       if (!this.checked) {
         Toast({
           message: '请确认阅读并同意违停免罚须知',
           duration: 2000
         })
         return false
       }
       this.$store.commit('saveIllegalPark', {
         entryTime: this.entryTime, // 进入该页面时的时间戳
         formatDate: this.formatDate, // 时间
         licensePlateNo: this.licensePlateNo, // 车牌
         licensePlateType: this.licensePlateType, // 车牌类型
         parkingAddr: this.parkingAddr, // 停车地点
         driver: this.driver, // 驾驶人
         ticketNo: this.ticketNo // 违停告知书号
       })
       this.$router.push('/illegalParking_takePhoto')
     }
   },
   mounted () {}
 }
</script>

<style lang="less">
 .tp-read .btn{
  width: 100%; line-height: 2.5rem; height: 2.5rem; background: #09bb07; color: #fff; font-size: 1.125rem; text-align: center;
  outline: none; margin-bottom: 2rem;
}
.illegalParking-outer{
  background: #fff;
  font-size: 30px;
  padding: 28px 50px 0;
  input{
    font-size: 30px;
  }
  .width-85{
    width: 85%;
  }
  .div-select .btn-select{
    height: 100%;
    background-color: #fff;
  }
  .illegalParking-item{
    position: relative;
    padding-left: 145px;
    height: 60px;
    line-height: 60px;
    margin-bottom: 36px;
    .illegalParking-hbs-name{
      position: absolute;
      left: 0;
    }
    .illegalParking-input{
      font-size: 30px;
    }
  }
  .pad-left-210{
    padding-left: 210px;
  }
  .illegalParking-location{
    width: 64px;
    height: 100%;
    background: url('../../images/location-1.png') no-repeat center;
    background-size: 29px 40px;
  }
  .illegalParking-read{
    margin-top: 460px;
    padding: 0;
    height: 70px;
  }
  .tp-btn-sure button{
    margin-left: 0;
    margin-top: 140px;
  }
  .illegalParking-notice{
    text-decoration: underline;
    color: #2e8ffd;
  }
  .text-input{
    background: #fff;
  }
  input[readonly]{
    background: #efeff4;
  }
}
</style>
