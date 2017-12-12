<template>
  <div class="placeExamine">
    <g-select title="车牌号码" ref="officeName" :data="vehicleData" v-model="vehicle"></g-select>
    <g-input title="车牌类型" v-model="carSelectData[plateType]" readonly></g-input>
    <g-select title="所有权" :data="ownerData" v-model="owner"></g-select>
    <g-input title="车架号" v-model="carriageNumber" readonly></g-input>
    <g-input title="车主身份证" v-model="identityCard" placeholder="请输入车主身份证"></g-input>
    <g-input title="车主姓名" v-model="name" placeholder="请输入车主姓名"></g-input>
    <g-select title="受托机构" ref="trusteeName" :data="trusteeData" v-model="trusteeTimeMsg"></g-select>
    <g-input title="收件人姓名" v-model="addresseeName" placeholder="请输入收件人姓名" readonly></g-input>
    <g-input title="联系电话" v-model="mobile" placeholder="请输入联系电话" readonly></g-input>
    <get-verification-code :method="getCode" v-model="identifying"></get-verification-code>
    <g-input title="邮政编码" v-model="postalcode" placeholder="请输入邮政编码"></g-input>
    <g-select-one class="changeCard-set" title="深圳市" type="邮寄地址" :data="areaSelectData" v-model="areaSelect"></g-select-one>
    <g-input title="" v-model="mailingAddress" placeholder="请输入详细地址"></g-input>
    <g-button text="确认信息" @click.native="confirmInfo" v-if="cars.length"></g-button>
    <g-button text="确认信息" v-if="!cars.length" type="gray"></g-button>
  </div>
</template>
verificatioCode
<script>
import {GInput, GSelect, GButton, GSelectOne, Group, GUpload} from 'form'
import GetVerificationCode from '@/components/GetVerificationCode'
import axios from '@/utils/axios'
import { getIssuing, sendSMS, inspectionDeclaration, verificatioCode } from '@/config/baseURL'
import beforeSubmit from '@/mixins/beforeSubmit'
export default {

  name: 'placeExamine',

  data () {
    return {
      vehicleData: [],
      vehicle: '',
      plateType: '',
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
  mixins: [beforeSubmit],
  created () {
    let val = this.$store.state.user
    this.cars = val.cars
    console.log(this.cars, '77777777777777')
    if (this.cars.length) {
      let PlateData = []
      this.cars.map(item => {
        if (+item.isMySelf === 0) {
          PlateData.push({name: item.myNumberPlate, value: item.behindTheFrame4Digits, str: item.plateType})
        }
      })
      this.vehicleData = PlateData
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
    // 获取受托机构
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
        mobilephone: this.mobile,
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
    // 验证验证码接口
    verificationFn () {
      let verificationData = {
        mobilephone: this.mobile,
        validateCode: this.identifying
      }
      axios.post(verificatioCode, verificationData).then(json => {
        if (json.code === '0000') {
          this.subFn()
        } else {
          this.$toast({message: json.data, position: 'middle', duration: 3000})
        }
      })
    },
    confirmInfo () {
      let obj = {
        name: '请输入车主姓名',
        identityCard: '请输入车主身份证',
        identifying: '请输入验证码',
        postalcode: '请输入邮政编码',
        mailingAddress: '请输入详细地址'
      }
      if (this.$_myMinxin_beforeSubmit(obj)) return
      this.verificationFn()
      // this.subFn()
    },
    subFn () {
      let officeName = this.$refs.officeName.currentName
      let trusteeName = this.$refs.trusteeName.currentName
      let dataList = {
        type: '机动车委托异地定期检验申报',
        url: inspectionDeclaration,
        title: 'inspectionDeclaration',
        textObj: {
          'numberPlate': officeName,                       // 车牌号码
          'cartype': this.plateType,                           // 车辆类型
          'proprietorship': this.owner,                    // 所有权
          'behindTheFrame4Digits': this.carriageNumber,      // 车架号
          'carOwnerIdentityCard': this.identityCard,         // 车主身份证
          'name': this.name,                                 // 车主名字
          'associatedAgencyMsg': trusteeName,        // 受托机构全称
          'receiverName': this.addresseeName,                // 收件人名字
          'receiverNumber': this.mobile,                     // 联系电话
          'postCode': this.postalcode,                       // 邮政编码
          'receiverAddress': `深圳市,${this.areaSelect},${this.mailingAddress}`    // 收件人地址
        },
        invisibleObj: {
          'associatedAgency': this.trusteeTimeMsg,            // 受托机构
          'identityCard': this.identityCard  //  登录用户的身份证号码
        }
      }
      this.$store.commit('savePassByValue', dataList)
      this.$router.push({path: '/affirmInfo', query: this.queryURL})
    }
  }
}
</script>

<style lang="less" scoped>
  .placeExamine {
    padding: 20px 0 40px;
  }
</style>
