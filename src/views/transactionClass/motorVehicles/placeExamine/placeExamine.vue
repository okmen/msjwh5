<template>
  <div class="placeExamine">
    <g-select title="车牌号码" ref="officeName" :data="vehicleData" v-model="vehicle"></g-select>
    <g-input title="车牌类型" v-model="carSelectData[plateType]" readonly></g-input>
    <g-select title="所有权" :data="ownerData" v-model="owner"></g-select>
    <g-input title="车架号" v-model="carriageNumber" readonly></g-input>
    <g-input title="车主身份证" v-model="identityCard" placeholder="请输入收件人姓名"></g-input>
    <g-input title="车主姓名" v-model="name" placeholder="请输入收件人姓名"></g-input>
    <g-select title="受托机构" :data="trusteeData" v-model="trusteeTimeMsg"></g-select>
    <g-input title="收件人姓名" v-model="addresseeName" placeholder="请输入收件人姓名" readonly></g-input>
    <g-input title="联系电话" v-model="mobile" placeholder="请输入收件人姓名" readonly></g-input>
    <get-verification-code :method="getCode"></get-verification-code>
    <g-input title="邮政编码" v-model="postalcode" placeholder="请输入邮政编码"></g-input>
    <g-select-one class="changeCard-set" title="深圳市" type="邮寄地址" :data="areaSelectData" v-model="areaSelect"></g-select-one>
    <g-input title="" v-model="mailingAddress" placeholder="请输入详细地址"></g-input>
    <g-button text="确认信息" @click.native="confirmInfo"></g-button>
  </div>
</template>

<script>
import {GInput, GSelect, GButton, GSelectOne, Group, GUpload} from 'form'
import GetVerificationCode from '@/components/GetVerificationCode'
import axios from '@/utils/axios'
import { getIssuing, sendSMS } from '@/config/baseURL'
export default {

  name: 'placeExamine',

  data () {
    return {
      vehicleData: [],
      vehicle: '',
      plateType: '',
      // ownerData: [],
      // owner: '',
      owner: '1',
      ownerData: [
        {
          value: '0',
          name: '个人'
        },
        {
          value: '1',
          name: '单位'
        }
      ],
      carriageNumber: '',
      identityCard: '',
      name: '',
      trusteeData: [],
      trusteeTimeMsg: '',
      addresseeName: '',
      mobile: '',
      identifying: '',
      postalcode: '',
      mailingAddress: '',
      areaSelect: '福田区'
    }
  },
  components: {
    GInput,
    GSelect,
    GButton,
    GSelectOne,
    Group,
    GUpload,
    GetVerificationCode
  },
  computed: {
    carSelectData () {
      return this.$store.state.carSelectData
    },
    areaSelectData () {
      return this.$store.state.cityAreaS
    },
    queryURL () {
      return this.$store.getters.queryURL
    },
    user () {
      return Object.assign({}, this.$store.state.user)
    }
  },
  watch: {
    vehicle () {
      this.carriageNumber = this.vehicle
      for (let i = 0; i < this.cars.length; i++) {
        if (this.vehicle === this.cars[i].behindTheFrame4Digits) {
          this.plateType = this.cars[i].plateType
        }
      }
    }
  },
  created () {
    let val = this.$store.state.user
    console.log(val)
    this.cars = val.cars
    if (this.cars.length !== 0) {
      let PlateData = []
      this.cars.map(item => {
        if (item.isMySelf === '0') {
          PlateData.push({name: item.myNumberPlate, value: item.behindTheFrame4Digits, str: item.plateType})
        }
      })
      this.vehicleData = PlateData
      console.log(this.vehicleData)
      this.carriageNumber = this.vehicleData[0].value
      this.vehicle = this.vehicleData[0].value
      this.plateType = this.vehicleData[0].str
    } else {
      this.$MessageBox('温馨提示', '暂无车辆,你可以通过深圳交警微信号的“个人中心”绑定车辆')
    }
    this.name = val.userName
    this.addresseeName = val.userName
    this.identityCard = val.identityCard
    this.mobile = val.mobilePhone
  },
  mounted: function () {
    axios.get(getIssuing).then(josn => {
      let trusData = []
      josn.data.map(item => {
        trusData.push({name: item.longName, value: item.shortName})
      })
      this.trusteeData = trusData
      this.trusteeTimeMsg = this.trusteeData[0].value
    })
  },
  methods: {
    // 发送验证码
    getCode (count) {
      let phonedata = {
        businessType: 'szjj'
      }
      axios.post(sendSMS, phonedata).then(data => {
        if (data.code === '0000') {
          count()
          this.$MessageBox('提示', data.data)
        } else {
          this.$MessageBox('提示', data.msg)
        }
      })
    },
    confirmInfo () {
      console.log(this.$refs.officeName.currentName)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
