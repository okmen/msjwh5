<template lang="html">
  <div>
    <mymap v-if="showMap" @submit="submitMap"></mymap>
   <div v-else class="illegalParking-outer"  @click.stop="licenseNoSelectShow = false, licensePlateTypeSelectShow = false">
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
      </div>
      <div class="illegalParkingRead">
        <div class="tp-read-checkbox illegalParking-read-checkbox">
        <input type="checkbox" id="illegalParkingChecked" v-model="checked">
        <label for="illegalParkingChecked"></label>
      </div>
      <div class="read-and-agree">
        <span>我已认真阅读并同意</span>
        <router-link :to="{path: '/userKnowledge'}" class="illegalParking-notice">《十分钟违停免罚须知》</router-link>
      </div>
      </div>
      
      <div class="tp-btn-sure">
        <button class="btn" @click="nextStep">下一步</button>
      </div>
      <div v-wechat-title="$route.meta.title"></div>
    </div> 

  </div>
</template>
<script>
 import { MessageBox, Toast } from 'mint-ui'
//  import mymap from '@/components/map/map.vue'
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
       checked: false, // 勾选已阅读须知
       licenseNos: [], // 所有车牌
       ticketNo: '' // 违停告知书号
     }
   },
   // 判断是否是从下级或者协议页面返回并使用历史数据
   beforeRouteEnter (to, from, next) {
     next(vm => {
       if (from.name === 'userAgreement' || from.name === 'queryIllegalParking' || from.name === 'takePhoto') {
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
     savePageRecord () {
       this.$store.commit('savePageRecord', {
         reading: this.checked,
         parkingAddr: this.parkingAddr
       })
     },
     getLocation: function () { // 显示地图
       this.showMap = true
     },
     licenseNoSelectClick: function (obj) { // 选择车牌号码
       if (obj) {
         this.licensePlateNo = obj.myNumberPlate
         this.licensePlateType = obj.plateType
       }
       this.licenseNoSelectShow = !this.licenseNoSelectShow
       this.licensePlateTypeSelectShow = false
     },
     licensePlateTypeSelectClick: function (obj) { // 选择车牌类型
       if (obj) {
         this.licensePlateType = obj.type
       }
       this.licensePlateTypeSelectShow = !this.licensePlateTypeSelectShow
       this.licenseNoSelectShow = false
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
       this.$router.push('/takePhoto')
     },
     submitMap: function (obj) { // 确定选择地点
       this.showMap = false
       this.parkingAddr = obj.showAdd
     },
     getFormatTime: function () { // 获取格式化时间
      /* eslint-disable */
      let date = new Date()
      this.entryTime = date.getTime()
      /* eslint-enable */
       let formatMonth = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`
       let formatDate = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`
       let formatHour = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`
       let formatMinute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`
       let formatSecond = date.getSeconds() < 10 ? `0${date.getSeconds()}` : `${date.getSeconds()}`
       let formatTime = `${date.getFullYear()}-${formatMonth}-${formatDate} ${formatHour}:${formatMinute}:${formatSecond}`
       this.formatDate = formatTime
       return formatTime
     },
     getUserInfo: function () {
       let cars = JSON.parse(window.localStorage.getItem('cars')) || []
       if (cars.length) {
         cars.map(item => {
           this.licenseNos.push({myNumberPlate: item.myNumberPlate, plateType: item.plateType})
         })
         this.licensePlateNo = this.licenseNos[0].myNumberPlate
         this.licensePlateType = this.licenseNos[0].plateType
       } else {
         MessageBox('温馨提示', '暂无车辆,你可以通过“民生警务个人中心”绑定车辆')
       }
       this.licensePlateTypes = this.$store.state.licenseSelectData
     }
   },
   mounted () {
     let isLogin = window.localStorage.getItem('isLogin')
     if (isLogin !== 'true') { // 没有登陆的话需要跳转至登录页面
       this.$router.push('/login')
       return false
     }
     this.driver = window.localStorage.getItem('userName')
     this.getFormatTime()
     this.getUserInfo()
   },
   components: {
     mymap: () => import('@/components/map/map.vue')
   }
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
    margin-top: 20px;
  }
  .illegalParking-notice{
    text-decoration: underline;
    color: #2e8ffd;
  }
  .illegalParkingRead{
    width: 100%;
    margin-top: 30px;
    .read-and-agree{
      font-size: 26px;
    }
     .tp-read-checkbox{
    float:left;
    position:relative;
    margin:4px 20px 0 0;
    width:26px;
    height:26px;
    input[type=checkbox]{
      visibility: hidden;
    }
    label{
      position:absolute;
      width:26px;
      height:26px;
      top:0;
      left:0;
      background:#FFF;
      border:1px dotted #6a6a6a;
      -webkit-border-radius:6px;
      -moz-border-radius:6px;
      border-radius:6px;
      cursor:pointer;
    }
    label:after{
      opacity:0.2;
      content:'';
      position:absolute;
      width:24px;
      height:8px;
      background:transparent;
      top:0;
      left:3px;
      border:4px solid #333;
      border-top:none;
      border-right:none;
      -webkit-transform: rotate(-45deg);
      -moz-transform: rotate(-45deg);
      -o-transform: rotate(-45deg);
      -ms-transform: rotate(-45deg);
      transform: rotate(-45deg);
    }
    label:hover::after{
      opacity:0.5;
    }
    input[type=checkbox]:checked + label:after{
      opacity:1;
    }
  }
   .illegalParking-read-checkbox{
    width: 20px;
   }
  }
  .text-input{
    background: #fff;
  }
  input[readonly]{
    background: #efeff4;
  }
  .tp-read{
    // padding:28px 50px 0;
    width:100%;
    height:106px;
  }
  span{
    display:block;
    float:left;
    font-size:22px;
  }
 }
</style>
