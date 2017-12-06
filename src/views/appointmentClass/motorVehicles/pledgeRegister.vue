<template>
  <div class="pledge-register form">
    <g-input title="业务类型" value="抵押/解押登记现场办理"></g-input>
    <div class="line-10"></div>
    <g-input title="车主姓名" placeholder="请输入车主姓名" v-model="carName"></g-input>
    <g-select title="证件名称" :data="certificateList" v-model="certificateListOne"></g-select>
    <g-input title="证件号码" placeholder="请输入证件号码" v-model="IDCard"></g-input>
    <g-input title="手机号码" placeholder="请输入手机号码" v-model="mobilePhone"></g-input>
    <g-input title="验证码" placeholder="请输入验证码">
      <div slot="right" class="verify-code">
        获取验证码
      </div>
    </g-input>
    <g-select title="车辆类型" :data="vehicleType" v-model="vehicleTypeOne" ref="vehicleType"></g-select>
    <g-select title="使用性质" :data="useNature" v-model="useNatureOne"></g-select>
    <g-input title="车身架号" placeholder="请输入车架后四位" v-model="carName"></g-input>
    <g-select title="预约地点" :data="appointmentLocation" v-model="appointmentLocationOne"></g-select>
   <div class="select">
      <span class="g-select-title">预约日期</span>
      <div class="g-select-value" @click="getDateList">
        <input type="text" placeholder="请选择预约日期" disabled  v-model="dateListOne" >
        <ul class="select-list" v-if="showDateList">
          <li class="list-item" v-for="item in dateList" @click.stop="chooseDate(item)">
            <div class="list-item-time">{{item}}</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="select">
      <span class="g-select-title">预约时间</span>
      <div class="g-select-value" @click="getTimeList">
        <input type="text" placeholder="请选择预约时间" disabled  v-model="timeListOne" >
        <ul class="select-list" v-if="showTimeList">
          <li class="list-item" v-for="item in timeList" @click.stop="chooseTime(item)" :class="{'bg-gray': item.num == 0}">
            <div class="list-item-time">{{item.apptime}}</div>
            <div class="list-item-num h-center" v-if="item.num!=0">剩余名额 <div style="color: #19D051;margin-left: 4px;margin-right: 4px;"> {{item.num}}</div> 位
            </div>
            <div  v-if="item.num == 0">已满</div>
          </li>
        </ul>
      </div>
    </div>
    <g-button text="预约"></g-button>
  </div>
</template>
<script>
import {GInput, GSelect, GButton} from 'form'
import {getPageInit, getAppointmentDate, getAppTimes} from '@/config/baseURL'
export default {
  data () {
    return {
      carName: '',
      IDCard: '',
      mobilePhone: '',
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
      showTimeList: false
    }
  },
  components: {
    GInput, GSelect, GButton
  },
  computed: {
    businessTypeId () {
      return '4028823f4fabb851014fabc3f28a00b1'
    }
  },
  created () {
    this.$axios.post(getPageInit, {
      businessTypeId: this.businessTypeId,
      type: '1'
    }).then(data => {
      console.log(data)
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
          orgAddr: item.orgAddr
        })
      })
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
    // 获取日期列表
    getDateList () {
      this.$axios.post(getAppointmentDate, {
        businessTypeId: this.businessTypeId,
        orgId: this.appointmentLocationOne
      }).then(data => {
        this.dateList = []
        data.data.map(item => {
          this.dateList.push(item)
        })
        this.showDateList = true
      })
    },
    // 获取时间列表
    getTimeList () {
      this.showTimeList = true
      if (this.timeList.length > 0) return
      this.$axios.post(getAppTimes, {
        businessTypeId: this.businessTypeId,
        orgId: this.appointmentLocationOne,
        date: this.dateListOne,
        carTypeId: this.vehicleTypeOne
      }).then(data => {
        this.timeList = []
        data.data.map(item => {
          this.timeList.push({
            num: item.maxnumber - item.yetnumber,
            apptime: item.apptime
          })
        })
      })
    },
    // 选择时间
    chooseTime (item) {
      this.timeListOne = item.apptime
      this.showTimeList = false
    },
    // 选择日期
    chooseDate (item) {
      this.dateListOne = item
     this.showDateList = false
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
.pledge-register{
  .bg-gray{
    background: #cdcdcd;
  }
  .select{
    display: flex;
    padding:10px 40px;
    box-sizing: border-box;
    align-items: center;
    .g-select-title{
      width: 30%;
    }
    .placeholder{
      color: #868686;
    }
    .g-select-value{
      /*width: 70%;*/
      flex: 1;
      border: 2px solid #e5e5e5;
      border-radius: 8px;
      height: 56px;
      font-size: 30px;
      line-height: 56px;
      position: relative;
      background: white url("../../../assets/images/select1.png") 95% center/22px 13px no-repeat;
      span{
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
  input[disabled]{
    background-color:  white;
    width: 80%;
    height: 90%;
    border: none;
    outline: none;
  }
  .list-item{
    display: flex;
    padding-right: 20px;
    justify-content: space-between;
  }
}
</style>
