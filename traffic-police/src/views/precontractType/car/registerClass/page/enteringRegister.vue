<template>
  <div class="register">
    <div class="register-item">
      <span class="register-item-title">车主姓名</span>
      <input type="text" placeholder="请输入车主姓名" class="register-item-input" v-model="ownerName">
    </div>
    <div-select :childInfo="credentialsName" @getSelected="getCredentialsNameOne"></div-select>
    <div class="register-item">
      <span class="register-item-title">证件号码</span>
      <input type="text" placeholder="请输入证件号码" class="register-item-input" v-model="IDcard">
    </div>
    <div class="register-item">
      <span class="register-item-title">手机号码</span>
      <input type="text" placeholder="请输入手机号码" class="register-item-input" v-model="mobilePhone">
    </div>
    <div class="register-item">
      <span class="register-item-title">验证码</span>
      <div class="register-item-input send-code">
        <input type="text" placeholder="请输入验证码" class="send-code-input" v-model="verificationCode" maxlength="6">
        <span class="send-code-btn" @click="getVerificationCode" v-if="showTime">获取验证码</span>
        <span class="send-code-btn" style="background: gray" v-if="!showTime">{{countDown}} s</span>
      </div>
    </div>
    <div class="register-item" v-if="$router.currentRoute.name != 'enteringRegister'">
      <span class="register-item-title">车牌号码</span>
      <div class="register-item-input send-code ">
        <div class="province-code">
          <div-select :childInfo="provinceCode" @getSelected="getProvinceCodeOne"></div-select>
        </div>
        <input type="text" placeholder="请输入车牌号码" class="province-code-input" v-model="plateNum">
      </div>
    </div>
    <div-select :childInfo="carSelectData" @getSelected="getCarSelectDataOne"></div-select>
    <div-radio v-if="carSelectDataStr == '小型汽车(蓝色)'&&$router.currentRoute.name == 'enteringRegister'"
               :childInfo="vehicleOrigin" @getSelected="getVehicleOriginOne" style="margin-bottom: 0"></div-radio>
    <div-select :childInfo="modelOfCar" @getSelected="getModelOfCarOne"></div-select>
    <div-select :childInfo="useNature" @getSelected="getUseNatureOne"></div-select>
    <div class="register-item" v-if="carSelectDataStr != '小型汽车(蓝色)'|| $router.currentRoute.name != 'enteringRegister'">
      <span class="register-item-title">车身架号</span>
      <input type="text" placeholder="请输入车架号全号" class="register-item-input" v-model="vehicleNum">
    </div>
    <div class="register-item" v-else-if="carSelectDataStr == '小型汽车(蓝色)'&&$router.currentRoute.name == 'enteringRegister'">
      <span class="register-item-title">车身架号</span>
      <input type="text" placeholder="请输入车架号全号" class="register-item-input" v-model="vehicleNum">
    </div>
    <div-select :childInfo="appointmentLocation" @getSelected="getAppointmentLocationOne"></div-select>
    <div class="register-item">
      <span class="register-item-title">预约日期</span>
      <div class="register-item-input register-item-select">
        <input type="text" placeholder="请选择预约日期" readonly v-model="yearMonthDay" @click.stop="toggleData">
        <ul class="register-item-ul" v-if="showItemData">
          <li class="register-item-li" v-for="item in allYearMonthDay" @click="chooseData(item)">{{item}}</li>
        </ul>
      </div>
    </div>
    <div class="register-item">
      <span class="register-item-title">预约时间</span>
      <div class="register-item-input register-item-select">
        <input type="text" placeholder="请选择预约时间" readonly v-model="appointmentTime" @click.stop="toggleTime">
        <ul class="register-item-ul" v-if="showItemTime">
          <li class="register-item-li" v-for="item in surplusData" @click="chooseTime(item)"
              :class="{'bg-gray': item.num == 0}">
            <div class="register-item-li-time">{{item.time}}</div>
            <div class="register-item-li-num" v-if="item.num!=0">剩余名额 <span
              class="register-item-li-number">{{item.num}}</span> 位
            </div>
            <div class="register-item-li-num" v-if="item.num == 0">已满</div>
          </li>
        </ul>
      </div>
    </div>
    <div-select :childInfo="pointerType" @getSelected="getPointerTypeOne"></div-select>
    <div class="register-item">
      <span class="register-item-title">指标号</span>
      <input type="text" :readonly="pointerTypeOne=='WZB'" placeholder="请输入指标号" class="register-item-input"
             v-model="targetNum">
    </div>
    <div class="register-reminder">
      提示: 非小型、微型载客汽车请选择无指标
    </div>
    <div class="register-submit" @click="registerSubmit">预  约</div>
  </div>
</template>
<style lang="less" scoped>
  input {
    border: 2px solid #e5e5e5;
    border-radius: 8px;
    outline: none;
    height: 70px;
    font-size: 30px;
    padding-left: 20px;
  }

  .bg-gray {
    background: #cdcdcd;
  }

  .register-item {
    display: flex;
    height: 85px;
    margin-bottom: 10px;
    align-items: center;
    justify-content: space-between;
    .register-item-title {
      width: 31%;
    }
    .province-code {
      width: 140px;
    }
    .register-item-input {
      width: 68%;
      padding-left: 20px;
      height: 70px;
      font-size: 30px;
    }
    .province-code-input {
      width: 300px;
    }
    .register-item-select {
      padding-left: 0;
      width: 68%;
      position: relative;
      input {
        width: 100%;
        background: white url("../../../../../images/select1.png") 95% center/22px 13px no-repeat;
      }
      .register-item-ul {
        position: absolute;
        top: 72px;
        border: 1px solid #e5e5e5;
        width: 100%;
        z-index: 3;
        background: white;
        max-height: 400px;
        overflow: auto;
        .register-item-li {
          font-size: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-height: 65px;
          padding-left: 20px;
          padding-right: 20px;
          .register-item-li-number {
            color: #19D051;
          }
        }
      }
    }
    .send-code {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 0;
      .send-code-input {
        width: 250px;
      }
      .send-code-btn {
        background: #09bb07;
        height: 70px;
        line-height: 70px;
        text-align: center;
        color: white;
        width: 180px;
        border-radius: 8px;
      }
    }
  }

  .choose-date {
    display: flex;
    .choose-date-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .date-item-input {
        width: 165px;
        input {
          width: 100%;
          text-align: center;
          padding-left: 0;
        }
      }
      .date-item-time {
        margin-left: 15px;
        margin-right: 15px;
      }
    }

  }

  .register-reminder {
    color: #f02b28;
    margin: 34px 0 142px;
  }

  .register-submit {
    height: 80px;
    background: #10aeff;
    text-align: center;
    line-height: 80px;
    color: white;
    border-radius: 8px;
  }
</style>
<script>
  import {isPhone, specialCharacters} from 'service/regExp.js'
  import {resultPost} from 'service/getData'
  import {Toast, MessageBox} from 'mint-ui'
  import {mapGetters} from 'vuex'
  import {
    getAppointmentDate,
    getAppTimes,
    simpleSendMessage,
    createVehicleInfo
  } from 'config/baseUrl.js'
  export default {
    data () {
      return {
        carSelectDataStr: '', // 车辆类型选择
        showItemData: false, // 日期选择框
        showItemTime: false, // 时间选择框
        activeIndex: '',  // 点击出现蓝色边框序号
        provinceCode: {
          option: [
            {
              'str': '粤'
            },
            {
              'str': '鄂'
            },
            {
              'str': '豫'
            },
            {
              'str': '皖'
            },
            {
              'str': '赣'
            },
            {
              'str': '冀'
            },
            {
              'str': '鲁'
            },
            {
              'str': '浙'
            },
            {
              'str': '苏'
            },
            {
              'str': '湘'
            },
            {
              'str': '闽'
            },
            {
              'str': '蒙'
            },
            {
              'str': '京'
            },
            {
              'str': '辽'
            },
            {
              'str': '渝'
            },
            {
              'str': '沪'
            },
            {
              'str': '陕'
            },
            {
              'str': '川'
            },
            {
              'str': '黑'
            },
            {
              'str': '晋'
            },
            {
              'str': '桂'
            },
            {
              'str': '吉'
            },
            {
              'str': '宁'
            },
            {
              'str': '贵'
            },
            {
              'str': '琼'
            },
            {
              'str': '甘'
            },
            {
              'str': '青'
            },
            {
              'str': '津'
            },
            {
              'str': '云'
            },
            {
              'str': '藏'
            },
            {
              'str': '新'
            }
          ]
        },  // 省份 简称
        allYearMonthDay: '', // 所有的年月日
        yearMonthDay: '',
        modelOfCarOne: '', // 车辆型号
        surplusData: [],   // 剩余数量
        ownerName: '',  // 车主姓名
        IDcard: '',
        mobilePhone: '',
        verificationCode: '',  // 验证码
        plateNum: '',
        vehicleNum: '',   // 车身架号
        targetNum: '',    // 指标号码
        provinceCodeOne: '',  // 车牌省份简称
        carSelectDataOne: '', // 车辆类型
        useNatureOne: '', // 使用性质
        appointmentLocationOne: '',     // 预约地点参数
        appointmentLocationStr: '', // 预约地点的字符串
        pointerTypeOne: '',
        credentialsNameOne: '', // 证件名称一项
        showTime: true,
        countDown: 60,
        timer: '',
        appointmentTime: '', // 预约时间
//        businessTypeId: '',  // 业务类型编码
        bookerType: 0, // 预约方式，0 本人， 1普通代办 2专业代办
        vehicleOrigin: {
          title: '车辆产地',
          option: [
            {'str': '国产', 'id': '1', 'choose': true},
            {'str': '进口', 'id': '0', 'choose': false}
          ]
        }, // 车辆产地
        vehicleOriginOne: ''
      }
    },
    components: {
      divSelect: require('components/divSelect.vue'),
      divRadio: require('components/formTemplate/src/selfRadio.vue')
    },
    props: ['businessTypeId', 'achieveCode'],
    computed: {
      // 余量请求参数
      quotaRequest () {
        return {
          businessTypeId: this.businessTypeId,
          orgId: this.appointmentLocationOne,
          date: this.yearMonthDay,
          carTypeId: this.carSelectDataOne,
          optlittleCar: this.vehicleOriginOne
        }
      },
      // 时间请求参数
      timeRequest () {
        return {
          businessTypeId: this.businessTypeId,
          orgId: this.appointmentLocationOne
        }
      },
      ...mapGetters({
        modelOfCar: 'getModelOfCar',
        credentialsName: 'getCredentialsName',
        carSelectData: 'getCarSelectData',
        pointerType: 'getPointerType',
        appointmentLocation: 'getAppointmentLocation',
        useNature: 'getUseNature'
      })
    },
    watch: {
      appointmentLocationOne () {
        this.allYearMonthDay = ''
        this.surplusData = ''
        this.yearMonthDay = ''
        this.appointmentTime = ''
      },
      yearMonthDay () {
        this.surplusData = ''
        this.appointmentTime = ''
      },
      carSelectDataOne () {
        this.surplusData = ''
        this.appointmentTime = ''
      }
    },
    methods: {
      // 获取车辆型号
      getModelOfCarOne (val) {
        this.modelOfCarOne = val
      },
      // 选择预约日期
      chooseData (item) {
        this.yearMonthDay = item
        this.showItemData = false
      },
      // 选择预约时间
      chooseTime (item) {
        if (item.num === 0) {
          return
        }
        this.appointmentTime = item.time
        this.showItemTime = false
      },
      toggleData () {
        this.showItemTime = false
        if (!this.allYearMonthDay) {
          this.getAllYearMonthDay()
        } else {
          this.showItemData = !this.showItemData
        }
      },
      toggleTime () {
        this.showItemData = false
        if (!this.surplusData) {
          this.getQuotaInformation()
        } else {
          this.showItemTime = !this.showItemTime
        }
      },
      // 获取时间
      getAllYearMonthDay () {
        resultPost(getAppointmentDate, this.timeRequest).then(json => {
          console.log(json, '时间获取成功')
          if (json.code === '0000') {
            this.allYearMonthDay = json.data
            this.showItemData = !this.showItemData
          } else {
            this.allYearMonthDay = ''
            MessageBox('提示', json.msg)
          }
        })
      },
      // 获取配额信息
      getQuotaInformation () {
        if (!this.yearMonthDay) {
          Toast({
            message: '请先选择预约日期',
            duration: 2000
          })
          return
        }
        resultPost(getAppTimes, this.quotaRequest).then(json => {
          console.log(json, '配额信息')
          this.activeIndex = ''
          this.appointmentTime = ''
          if (json.code === '0000') {
            let arrData = []
            json.data.map(item => {
              arrData.push({'time': item.apptime, 'num': item.maxnumber - item.yetnumber})
            })
            this.surplusData = arrData
            this.showItemTime = !this.showItemTime
          } else {
            this.surplusData = ''
            MessageBox('提示', json.msg)
          }
        })
      },
      getCredentialsNameOne (val) {
        this.credentialsNameOne = val
      },
      getProvinceCodeOne (val) {
        this.provinceCodeOne = val
      },
      // 选择车辆 获取对应的车辆类型编码
      getCarSelectDataOne (val, index, str) {
        if (str !== '小型汽车(蓝色)') {
          this.vehicleOriginOne = ''
        }
        this.carSelectDataOne = val
        this.carSelectDataStr = str
      },
      getUseNatureOne (val) {
        this.useNatureOne = val
      },
      // 切换地点
      getAppointmentLocationOne (val, index, str) {
        this.appointmentLocationStr = str
        this.appointmentLocationOne = val
      },
      // 获取车辆产地
      getVehicleOriginOne (val) {
        this.vehicleOriginOne = val
      },
      getPointerTypeOne (val) {
        if (val === 'WZB') {
          this.targetNum = ''
        }
        this.pointerTypeOne = val
      },
      // 点击获取验证码
      getVerificationCode () {
        if (specialCharacters(this.ownerName)) {
          Toast({
            message: '车主姓名不能含有特殊字符',
            duration: 2000
          })
          return false
        } else if (!this.ownerName) {
          Toast({
            message: '请输入车主姓名',
            duration: 2000
          })
          return false
        }
        if (!this.IDcard) {
          Toast({
            message: '证件号码不能为空',
            duration: 2000
          })
          return false
        }
        if (!isPhone(this.mobilePhone)) {
          Toast({
            message: '手机号码格式不正确',
            duration: 2000
          })
          return false
        }
        if (window.localStorage.getItem('userName')) {
          this.bookerType = this.ownerName === window.localStorage.getItem('userName') ? 0 : 1
        }
        let requestData = {
          mobile: this.mobilePhone,
          idType: this.credentialsNameOne,
          lx: 2,
          bookerType: this.bookerType,
          bookerName: this.ownerName,
          bookerIdNumber: window.localStorage.getItem('identityCard') || this.IDcard,
          idNumber: this.IDcard,
          codes: this.achieveCode
        }
        console.log(requestData, '验证码请求参数')
        resultPost(simpleSendMessage, requestData).then(data => {
          console.log(data, '验证码')
          if (data.code === '0000') {
            MessageBox('提示', '验证码已发送')
            this.showTime = false
            this.timer = setInterval(() => {
              if (this.countDown === 0) {
                clearInterval(this.timer)
                this.showTime = true
                this.countDown = 60
                return
              }
              this.countDown--
            }, 1000)
          } else {
            MessageBox('提示', data.msg)
          }
        })
      },
      beforeSubmit () {
        if (specialCharacters(this.ownerName)) {
          Toast({
            message: '车主姓名不能含有特殊字符',
            duration: 2000
          })
          return false
        } else if (!this.ownerName) {
          Toast({
            message: '请输入车主姓名',
            duration: 2000
          })
          return false
        }
        if (!this.IDcard) {
          Toast({
            message: '证件号码不能为空',
            duration: 2000
          })
          return false
        }
        if (!isPhone(this.mobilePhone)) {
          Toast({
            message: '手机号码格式不正确',
            duration: 2000
          })
          return false
        }
        if (!this.verificationCode) {
          Toast({
            message: '请输入验证码',
            duration: 2000
          })
          return false
        }
        if (!this.vehicleNum) {
          Toast({
            message: '请输入车架号',
            duration: 2000
          })
          return false
        }
        if (!this.yearMonthDay) {
          Toast({
            message: '请选择预约日期',
            duration: 2000
          })
          return false
        }
        if (!this.appointmentTime) {
          Toast({
            message: '请选择预约时间',
            duration: 2000
          })
          return false
        }
        if (!this.targetNum && this.pointerTypeOne !== 'WZB') {
          Toast({
            message: '请输入指标号',
            duration: 2000
          })
          return false
        }
        return true
      },
      registerSubmit () {
        console.log(this.$store.state)
        if (!this.beforeSubmit()) return
        let appointmentLocation = this.$store.getters.getAppointmentLocationAll
        let orgAddr = ''
        for (let i = 0, len = appointmentLocation.length; i < len; i++) {
          if (appointmentLocation[i].id === this.appointmentLocationOne) {
            orgAddr = appointmentLocation[i].description
            break
          }
        }
        let requestObj = {
          name: this.ownerName,
          businessTypeId: this.businessTypeId,
          idTypeId: this.credentialsNameOne, // 证件名称
          idNumber: this.IDcard,
          mobile: this.mobilePhone,
          msgNumber: this.verificationCode,
          platNumber: (this.provinceCodeOne + this.plateNum.toUpperCase()) || this.vehicleNum,
          carTypeId: this.carSelectDataOne,
          useCharater: this.useNatureOne,
          carFrame: this.vehicleNum,  // 车身架号
          orgId: this.appointmentLocationOne,
          appointmentDate: this.yearMonthDay,
          appointmentTime: this.appointmentTime,
          bookerName: window.localStorage.getItem('userName') || this.ownerName,
          bookerIdNumber: window.localStorage.getItem('identityCard') || this.IDcard,
          bookerType: this.bookerType,
          indexType: this.pointerTypeOne,
          indexNo: this.targetNum,
          modelName: this.modelOfCarOne,
          bookerMobile: this.mobilePhone,
          optlittleCar: this.vehicleOriginOne,
          orgName: this.appointmentLocationStr,
          orgAddr: orgAddr,
          businessCode: `createVehicleInfo_${this.$route.query.code}`,
          businessName: this.$route.query.name,
          carTypeName: this.carSelectDataStr
        }
        console.log(requestObj, '请求的数据')
        resultPost(createVehicleInfo, requestObj).then(data => {
          console.log(data, '预约信息')
          if (data.code === '0000') {
            let dataInfo = {
              type: 2,
              reserveNo: data.data.waterNumber,
              businessType: this.$route.query.name,
              vehicleType: data.data.carTypeName,
              reserveAddress: data.data.orgName,
              appointmentAddress: data.data.orgAddr,
              reserveTime: `${this.yearMonthDay} ${this.appointmentTime}`,
              mobilephone: this.mobilePhone,
              appointmentPerson: data.data.name
            }
//          this.$store.commit('saveResponseData', data)
            this.$store.commit('saveSuccessInfo', dataInfo)
            this.$root.$router.isWeChat ? window.location.href = data.msg : this.$router.push('/submitSuccess')
          } else {
            MessageBox('提示', data.msg)
          }
        })
      },
      disappearSelectUl () {
        this.showItemTime = false
        this.showItemData = false
      }
    },
    mounted () {
      document.getElementById('app').addEventListener('click', this.disappearSelectUl)
    },
    destroyed () {
      document.getElementById('app').removeEventListener('click', this.disappearSelectUl)
    }
  }
</script>
