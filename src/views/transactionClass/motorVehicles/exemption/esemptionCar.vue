<template>
  <div class="exemption">
    <g-select title="车牌号码" :data="plateNumber" v-model="plateNumberOne" @getSelected="getPlateNumber" ref="plateNumberName"></g-select>
    <g-input title="车主姓名" v-model="ownersName" readonly></g-input>
    <g-select title="申请人类型" :data="congestionData" v-model="congestion"></g-select>
    <!-- <g-input title="行驶证编号" v-model="drivingLicense" placeholder="请输入行驶证编号"></g-input> -->
    <g-input title="手机号码" maxlength="11" v-model="mobilePhone" placeholder="请输入手机号码"></g-input>
    <get-verification-code :method="getCode" v-model="identifying"></get-verification-code>
    <g-input title="固定号码" v-model="telno" placeholder="请输入固定号码(非必填)"></g-input>
    <g-input title="收件人姓名" v-model="receiverName" readonly></g-input>
    <g-input title="收件人电话" maxlength="11" v-model="recipientPhone" readonly></g-input>
    <g-input title="邮政编码" v-model="postCode" placeholder="请输入邮政编码"></g-input>
    <g-select-one title="深圳市" type="收件人地址" :data="areaSelectData" v-model="recipientAddressRegion"></g-select-one>
    <g-input title="" v-model="mailingAddress" placeholder="请输入详细地址"></g-input>
    <g-date-picker title="保险生效日期" v-model="effectiveDate"></g-date-picker>
    <g-date-picker title="保险终止日期" v-model="terminationDate"></g-date-picker>
    <!-- <g-select title="保险结果告知方式" :data="placeSelectData" v-model="placeSelectMassage" classType='filled'></g-select>
    <g-input title="预约人" v-model="bookerName" placeholder="请输入预约人姓名"></g-input>
    <g-input title="预约人身份证号" v-model="bookerIdentityCard" placeholder="请输入预约人身份证号" classType='filled'></g-input>
    <g-input title="预约方式" value="本人" classType='filled' readonly></g-input> -->
    <!-- <span class="form-annotation">注:只能申请本人名下车辆</span> -->
    <g-button text="确认信息" @click.native="confirmInfo" v-if="myNumberPlate"></g-button>
    <g-button text="确认信息" v-if="!myNumberPlate" type="gray"></g-button>
  </div>
</template>

<script>
import {GInput, GSelect, GButton, GSelectOne, Group, GDatePicker} from 'form'
import {sendSMS, verificatioCode, createVehicleInspection, getCarTypeId} from '@/config/baseURL.js'
import axios from '@/utils/axios'
import GetVerificationCode from '@/components/GetVerificationCode'
import beforeSubmit from '@/mixins/beforeSubmit'
export default {
  name: 'exemption',
  data () {
    return {
      name: '补换检验合格标志',
      myNumberPlate: '',
      plateNumberOne: '0',               // 车牌号码
      ownersName: '',                    // 车主姓名
      allOwnersName: {},
      drivingLicense: '',                // 行驶证编号
      mobilePhone: '',                   // 手机号码
      telno: '',                         // 固定号码
      receiverName: '',                  // 收件人姓名
      recipientPhone: '',                // 收件人电话
      recipientAddressRegion: '福田区',   // 收件人地址区域
      identifying: '',                   // 验证码
      postCode: '',                      // 邮政编码
      mailingAddress: '',                // 详细地址
      bookerName: '',                    // 预约人
      bookerIdentityCard: '',            // 预约人身份证号
      orderMode: '0',                 // 预约方式
      effectiveDate: this.formatDate(new Date()),                 // 起始日期
      terminationDate: this.formatDate(new Date(), 1),               // 终止日期
      placeSelectMassage: '1',
      placeSelectData: [
        {
          'name': '互联网查询',
          'value': '1'
        },
        {
          'name': '短信告知',
          'value': '2'
        },
        {
          'name': '非移动电话告知',
          'value': '3'
        }
      ],
      congestion: '1',
      congestionData: [
        {
          'name': '机动车所有人',
          'value': '1'
        },
        {
          'name': '代理人',
          'value': '2'
        }
      ]
    }
  },
  components: {
    GInput,
    GSelect,
    GButton,
    GSelectOne,
    Group,
    GDatePicker,
    GetVerificationCode
  },
  computed: {
    plateNumber () {
      var plateInfo = {
        title: '车牌号码',
        option: []
      }
      let cars = this.$store.state.user.cars
      if (!cars) return plateInfo.option
      cars.map((item, index) => {
        if (+item.isMySelf === 0) {
          plateInfo.option.push({'name': item.myNumberPlate, 'value': index + ''})
          this.allOwnersName[index] = item.name
        }
      })
      return plateInfo.option
    },
    queryURL () {
      return this.$store.getters.queryURL
    },
    areaSelectData () {
      return this.$store.state.cityAreaS
    }
  },
  mixins: [beforeSubmit],
  methods: {
    // 确认信息
    confirmInfo () {
      let obj = {
        mobilePhone: '请输入手机号码',
        identifying: '请输入验证码',
        postCode: '请输入邮政编码',
        mailingAddress: '请输入详细地址'
      }
      if (this.$_myMinxin_beforeSubmit(obj)) return
      if (this.$verification.isPhone(this.mobilePhone)) return
      if (this.effectiveDate > this.terminationDate) {
        this.$toast({message: '请选择生效日期以后日期'})
        return
      }
      this.verificationFn()
    },
    subFn () {
      let dataList = {
        type: '核发机动车检验合格标志',
        url: createVehicleInspection,
        title: 'createVehicleInspection',
        textObj: {
          'numberPlate': this.plateNumberName,         // 车牌号码
          'name': this.ownersName,                     // 所有人
          'personType': this.congestion,               // 申请人类型
          'driveLicenseNumber': this.drivingLicense,   // 行驶证编号
          'mobilephone': this.mobilePhone,             // 手机号码
          'telno': this.telno,                         // 固定号码
          'receiverName': this.receiverName,           // 收件人姓名
          'receiverNumber': this.recipientPhone,       // 收件人电话
          'postCode': this.postCode,                   // 邮政编码
          'receiverAddress': `深圳市${this.recipientAddressRegion}${this.mailingAddress}`,    // 收件人地址
          'effectiveDate': this.effectiveDate,         // 保险生效日期
          'terminationDate': this.terminationDate,     // 保险终止日期
          'inform': this.placeSelectMassage,           // 保险告知方式
          'bookerName': this.$store.state.user.userName,              // 预约人名字
          'bookerIdentityCard': this.$store.state.user.identityCard,   // 预约人身份证
          'bookerType': this.orderMode                     // 预约方式
        },
        invisibleObj: {
          'carTypeId': this.carTypeId                    // 号牌类型
        }
      }
      this.$store.commit('savePassByValue', dataList)
      this.$router.push({path: '/affirmInfo', query: this.queryURL})
    },
    // 日期格式化
    formatDate: (date, addYear) => {
      var y = !addYear ? date.getFullYear() : date.getFullYear() + addYear
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      return y + '-' + m + '-' + d
    },
    // 发送验证码
    getCode (count) {
      let phonedata = {
        mobilephone: this.mobilePhone,
        businessType: 'szjj'
      }
      if (this.$verification.isPhone(this.mobilePhone)) return
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
        mobilephone: this.mobilePhone,
        validateCode: this.identifying
      }
      axios.post(verificatioCode, verificationData).then(json => {
        if (json.code === '0000') {
          this.carIdFn()
        } else {
          this.$toast({message: json.data, position: 'middle', duration: 3000})
        }
      })
    },
    getPlateNumber () {
      this.plateNumberName = this.$refs.plateNumberName.currentName
      this.ownersName = this.allOwnersName[this.plateNumberOne]
    },
    // 获取证件类型ID
    carIdFn: function () {
      let carIdFnData = {
        arg0: '',
        arg1: '',
        code: this.plateType
      }
      axios.post(getCarTypeId, carIdFnData).then(json => {
        if (json.code === '0000') {
          this.carTypeId = json.data
          this.subFn()
        } else {
          this.$MessageBox('提示', json.msg)
        }
      })
    }
  },
  mounted () {
    // let cars = this.$store.state.user.cars
    this.myNumberPlate = this.$store.state.user.myNumberPlate
    if (this.myNumberPlate) {
      this.ownersName = this.allOwnersName[this.plateNumberOne]
      this.receiverName = this.$store.state.user.userName
      this.recipientPhone = this.$store.state.user.mobilePhone
      this.plateNumberName = this.$refs.plateNumberName.currentName
      this.plateType = this.$store.state.user.cars[0].plateType
      console.log('当前车辆信息', this.$store.state.user.cars.length)
    } else {
      this.$MessageBox('温馨提示', '暂无车辆，您的车辆未绑定或者审核中')
    }
  }
}
</script>

<style lang="less" scoped>
.exemption{
  padding: 20px 0 40px;
  .form-annotation{
    padding: 16px 40px 0;
    color: red;
    font-size: 26px;
  }
}
</style>
