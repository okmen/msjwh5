<template>
  <div class="pledge-register form">
    <g-input title="业务类型" v-model="typeName" disabled></g-input>
    <div class="line-10"></div>
    <g-input title="车主姓名" placeholder="请输入车主姓名" v-model="carName"></g-input>
    <g-select title="证件名称" :data="certificateList" v-model="certificateListOne"></g-select>
    <g-input title="证件号码" placeholder="请输入证件号码" v-model="IDCard"></g-input>
    <g-input title="手机号码" placeholder="请输入手机号码" v-model="mobilePhone"></g-input>
    <get-verification-code :method="getCode" v-model="verificationCode"></get-verification-code>
    <plate-number-full v-model="plateNumber"></plate-number-full>
    <g-select title="车辆类型" :data="vehicleType" v-model="vehicleTypeOne" ref="vehicleType"></g-select>
    <g-select title="使用性质" :data="useNature" v-model="useNatureOne"></g-select>
    <g-input title="车身架号" placeholder="请输入车架后四位" v-model="carriageNum" maxlength="4"></g-input>
    <g-select title="预约地点" :data="appointmentLocation"  v-model="appointmentLocationOne" ref="appointmentLocation"></g-select>
    <div class="select">
      <span class="g-select-title">预约日期</span>
      <div class="g-select-value" @click.stop="getDateList">
        <input type="text" placeholder="请选择预约日期" disabled v-model="dateListOne">
        <ul class="select-list" v-if="showDateList">
          <li class="list-item" v-for="item in dateList" @click.stop="chooseDate(item)">
            <div class="list-item-time">{{item}}</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="select">
      <span class="g-select-title">预约时间</span>
      <div class="g-select-value" @click.stop="getTimeList">
        <input type="text" placeholder="请选择预约时间" disabled v-model="timeListOne">
        <ul class="select-list" v-if="showTimeList">
          <li class="list-item" v-for="item in timeList" @click.stop="chooseTime(item)"
              :class="{'bg-gray': item.num == 0}">
            <div class="list-item-time">{{item.apptime}}</div>
            <div class="list-item-num h-center" v-if="item.num!=0">剩余名额
              <div style="color: #19D051;margin-left: 4px;margin-right: 4px;"> {{item.num}}</div>
              位
            </div>
            <div v-if="item.num == 0">已满</div>
          </li>
        </ul>
      </div>
    </div>
    <g-button text="预约" @click.native="submit"></g-button>
  </div>
</template>
<script>
  import { GInput, GSelect, GButton } from 'form'
  import PlateNumberFull from '@/components/PlateNumberFull'
  import GetVerificationCode from '@/components/GetVerificationCode'
  import {
    getPageInit,
    getAppointmentDate,
    getAppTimes,
    simpleSendMessage,
    createVehicleInfoJD37
  } from '@/config/baseURL'
  import beforeSubmit from '@/mixins/beforeSubmit'

  export default {
    data () {
      return {
        typeName: '',
        carName: '',
        verificationCode: '',
        IDCard: '',
        mobilePhone: '',
        carriageNum: '',
        certificateListOne: '',
        certificateList: [],
        vehicleType: [],
        vehicleTypeOne: '',
        useNature: [],
        useNatureOne: '',
        appointmentLocation: [],
        appointmentLocationOne: '',
        dateList: [],
        dateListOne: '',
        timeList: [],
        timeListOne: '',
        showDateList: false,
        showTimeList: false,
        plateNumber: ''
      }
    },
    components: {
      GInput, GSelect, GButton, PlateNumberFull, GetVerificationCode
    },
    computed: {
      businessTypeId () {
        // return '4028823f4fabb851014fabc3f28a00b1'
        return this.$route.query.id
      },
      code () {
        // return 'JD37'
        return this.$route.query.codeName
      }
    },
    mixins: [beforeSubmit],
    created () {
      this.typeName = this.$route.query.name
      this.$axios.post(getPageInit, {
        businessTypeId: this.businessTypeId,
        type: '1'
      }).then(data => {
        if (data.code === '0000') {
          data.data.idTypeVOs.map((item, index) => {
            if (index === 0) {
              this.certificateListOne = item.id
            }
            this.certificateList.push({
              name: item.name,
              value: item.id
            })
          })
          data.data.carTypeVOs.map((item, index) => {
            if (index === 0) {
              this.vehicleTypeOne = item.id
            }
            this.vehicleType.push({
              name: item.name,
              value: item.id
            })
          })
          data.data.useCharaters.map((item, index) => {
            if (index === 0) {
              this.useNatureOne = item.id
            }
            this.useNature.push({
              name: item.name,
              value: item.id
            })
          })
          data.data.orgVOs.map((item, index) => {
            if (index === 0) {
              this.appointmentLocationOne = item.id
            }
            this.appointmentLocation.push({
              name: item.name,
              value: item.id,
              orgAddr: item.description
            })
          })
        } else {
          this.$MessageBox('提示', data.msg)
        }
      })
    },
    watch: {
      appointmentLocationOne () {
        this.dateList = []
        this.dateListOne = ''
        this.timeList = []
        this.timeListOne = ''
      },
      dateListOne () {
        this.timeList = []
        this.timeListOne = ''
      },
      vehicleTypeOne () {
        this.timeList = []
        this.timeListOne = ''
      }
    },
    methods: {
      // 获取验证码
      getCode (count) {
        let obj = {
          carName: '请输入车主姓名',
          IDCard: '请输入证件号码',
          mobilePhone: '请输入手机号码'
        }
        if (this.$_myMinxin_beforeSubmit(obj)) return
        if (this.$verification.specialCharacters(this.carName)) return
        if (this.$verification.isPhone(this.mobilePhone)) return
        let requesData = {
          mobile: this.mobilePhone,
          idType: this.certificateListOne,
          lx: 2,
          bookerType: this.$store.state.user.userName === this.carName ? 0 : 1,
          bookerName: this.carName,
          bookerIdNumber: this.$store.state.user.identityCard || this.IDCard,
          idNumber: this.IDCard,
          codes: this.code
        }
        this.$axios.post(simpleSendMessage, requesData).then(data => {
          count()
          this.$MessageBox('提示', data.msg)
        })
      },
      // 获取日期列表
      getDateList () {
        this.showTimeList = false
        if (this.dateList.length > 0) {
          this.showDateList = !this.showDateList
          return
        }
        this.$axios.post(getAppointmentDate, {
          businessTypeId: this.businessTypeId,
          orgId: this.appointmentLocationOne
        }).then(data => {
          if (data.code === '0000') {
            data.data.map(item => {
              this.dateList.push(item)
            })
            this.showDateList = true
          } else {
            this.$MessageBox('提示', data.msg)
          }
        })
      },
      // 获取时间列表
      getTimeList () {
        if (this.timeList.length > 0) {
          this.showTimeList = !this.showTimeList
          return
        }
        if (this.$_myMinxin_beforeSubmit({dateListOne: '请选择预约日期'})) return
        this.$axios.post(getAppTimes, {
          businessTypeId: this.businessTypeId,
          orgId: this.appointmentLocationOne,
          date: this.dateListOne,
          carTypeId: this.vehicleTypeOne
        }).then(data => {
          if (data.code === '0000') {
            data.data.map(item => {
              this.timeList.push({
                num: item.maxnumber - item.yetnumber,
                apptime: item.apptime
              })
            })
            this.showTimeList = true
          } else {
            this.$MessageBox('提示', data.msg)
          }
        })
      },
      // 选择时间
      chooseTime (item) {
        if (item.num === 0) {
          return
        }
        this.timeListOne = item.apptime
        this.showTimeList = false
      },
      // 选择日期
      chooseDate (item) {
        this.dateListOne = item
        this.showDateList = false
      },
      // 预约
      submit () {
        let obj = {
          carName: '请输入车主姓名',
          IDCard: '请输入证件号码',
          mobilePhone: '请输入手机号码',
          verificationCode: '请输入验证码',
          carriageNum: '请输入车架号后四位',
          dateListOne: '请选择预约日期',
          timeListOne: '请选择预约时间',
          plateNumber: '请输入车牌号'
        }
        if (this.$_myMinxin_beforeSubmit(obj)) return
        if (this.$verification.specialCharacters(this.carName)) return
        if (this.$verification.isPhone(this.mobilePhone)) return
        if (this.$verification.plateVerification(this.plateNumber)) return
        let orgAddr
        console.log(this.appointmentLocation)
        for (let i = 0, len = this.appointmentLocation.length; i < len; i++) {
          if (this.appointmentLocationOne === this.appointmentLocation[i].value) {
            orgAddr = this.appointmentLocation[i].orgAddr
            break
          }
        }
        let requestData = {
          name: this.carName,
          businessTypeId: this.businessTypeId,
          idTypeId: this.certificateListOne, // 证件名称
          idNumber: this.IDCard,
          mobile: this.mobilePhone,
          msgNumber: this.verificationCode,
          platNumber: this.plateNumber.toUpperCase(),
          carTypeId: this.vehicleTypeOne, // 车辆类型ID
          useCharater: this.useNatureOne,
          carFrame: this.carriageNum,  // 车身架号
          orgId: this.appointmentLocationOne, // 预约地点ID
          carTypeName: this.$refs.vehicleType.currentName, // 车辆类型名称
          orgName: this.$refs.appointmentLocation.currentName, // 预约地点
          orgAddr: orgAddr, // 预约地点详细地址
          // sourceOfCertification: window.localStorage.getItem('sourceOfCertification'), // 请求来源
          // openId: window.localStorage.getItem('openId'), // openID
          appointmentDate: this.dateListOne,
          appointmentTime: this.timeListOne,
          bookerName: this.$store.state.user.userName || this.carName,
          bookerIdNumber: this.$store.state.user.identityCard || this.IDCard,
          bookerType: this.$store.state.user.userName === this.carName ? 0 : 1,
          bookerMobile: this.mobilePhone
        }
        this.$axios.post(createVehicleInfoJD37, requestData).then(data => {
          if (data.code === '0000') {
            let dataInfo = {
              type: 2,
              reserveNo: data.msg.split('预约成功：您的预约号为：')[1].split(',')[0], // 预约编号
              businessType: '抵押/解押登记现场办理', // 预约业务名称
              numberPlate: this.plateNumber.toUpperCase(), // 车牌号
              vehicleType: this.$refs.vehicleType.currentName, // 车辆类型
              reserveAddress: this.$refs.appointmentLocation.currentName,  // 预约地点
              appointmentAddress: orgAddr, // 预约详细地址
              reserveTime: `${this.dateListOne} ${this.timeListOne}`, // 预约日期
              mobilephone: this.mobilePhone, // 手机号
              appointmentPerson: this.carName // 预约人
            }
            this.$store.commit('saveSuccessInfo', dataInfo)
            let source = this.$route.query.source
            let idcard = this.$route.query.idcard
            let openid = this.$route.query.openid
            this.$router.push({path: '/submitSuccess', query: {source: source, idcard: idcard, openid: openid}})
          } else {
            this.$MessageBox('提示', data.msg)
          }
        })
      },
      disappearSelectUl () {
        this.showTimeList = false
        this.showDateList = false
      }
    },
    mounted () {
      this.$nextTick(() => {
        document.getElementById('app').addEventListener('click', this.disappearSelectUl)
      })
    },
    destroyed () {
      document.getElementById('app').removeEventListener('click', this.disappearSelectUl)
    }
  }
</script>

<style lang="less" scoped>
  .pledge-register {
    .bg-gray {
      background: #cdcdcd;
    }
    .select {
      display: flex;
      padding: 10px 40px;
      box-sizing: border-box;
      align-items: center;
      input{
        color: #000;
      }
      .g-select-title {
        width: 30%;
      }
      .placeholder {
        color: #868686;
      }
      .g-select-value {
        /*width: 70%;*/
        flex: 1;
        border: 2px solid #e5e5e5;
        border-radius: 8px;
        height: 56px;
        font-size: 30px;
        line-height: 56px;
        position: relative;
        background: white url("../../../assets/images/select1.png") 95% center/22px 13px no-repeat;
        span {
          display: block;
          width: 100%;
          height: 100%;
          margin-left: 20px;
        }
      }
      .select-list {
        position: absolute;
        top: 60px;
        right: 0;
        background: white;
        width: 100%;
        border: 2px solid #eee;
        line-height: 55px;
        z-index: 999;
        max-height: 400px;
        overflow: auto;
        .list-item {
          padding-left: 20px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
    input[disabled] {
      background-color: white;
      width: 80%;
      height: 90%;
      border: none;
      outline: none;
      color: #000;
    }
    .list-item {
      display: flex;
      padding-right: 20px;
      justify-content: space-between;
    }
  }
</style>
