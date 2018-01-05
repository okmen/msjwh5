<template>
  <div class="exchangeDrivingLicense">
    <div class="changeCard-top">
      <g-input class="changeCard-type" title="业务类型" value="换领行驶证" readonly></g-input>
    </div>
    <g-input title="车主姓名" v-model="name" readonly></g-input>
    <g-input title="证件号码" v-model="certificateNumber" readonly></g-input>
    <g-select title="车牌号码" :data="plateNumberData" v-model="plateNumber" ref="plateNumberName"></g-select>
    <g-select title="车牌类型" :data="plateSelectData" v-model="plateSelect" ref="plateSelectName"></g-select>
    <g-select title="户籍所在地" :data="getCensusRegisterData" v-model="getCensusRegister" @getSelected="getIndex"></g-select>
    <g-input title="收件人姓名" v-model="recipientName" placeholder="请输入收件人姓名"></g-input>
    <g-input title="收件人手机" v-model="recipientPhone" placeholder="请输入收件人手机号码"></g-input>
    <g-select-one title="深圳市" type="收件人地址" :data="areaSelectData" v-model="recipientAddressRegion"></g-select-one>
    <g-input v-model="recipientAddressDetail" placeholder="请输入详细地址"></g-input>
    <group title="请按示例图上传以下证件照片">
      <div class="upload-group">
        <g-upload text="身份证(正面)" id="file1" :bg="require('@/assets/images/IDcard-front.png')" v-model="IDCardFront"></g-upload>
        <g-upload text="身份证(反面)" id="file2" :bg="require('@/assets/images/IDcard-back.png')" v-model="IDCardBack"></g-upload>
        <g-upload text="机动车登记证书" id="file3" :bg="require('@/assets/images/register-credential.png')" v-model="registerCredential"></g-upload>
        <g-upload text="居住证正面" id="file4" :bg="require('@/assets/images/residence-permit-f.png')" v-model="residencePermitF" v-show="censusIndex === 1"></g-upload>
        <g-upload text="居住证反面" id="file5" :bg="require('@/assets/images/residence-permit-b.png')" v-model="residencePermitB" v-show="censusIndex === 1"></g-upload>
        <g-upload text="境外人员临住表" id="file6" :bg="require('@/assets/images/out-board.png')" v-model="board" v-show="censusIndex === 2"></g-upload>
      </div>
    </group>
    <g-button text="确认信息" @click.native="confirmInfo" v-if="cars.length"></g-button>
    <g-button text="确认信息" v-if="!cars.length" type="gray"></g-button>
  </div>
</template>

<script>
import {GInput, GSelect, GButton, GSelectOne, GRadio, Group, GUpload} from 'form'
import beforeSubmit from '@/mixins/beforeSubmit'
import { iocomotiveCarReplace } from '@/config/baseURL'
export default {
  name: 'exchangeDrivingLicense',
  data () {
    return {
      name: '',
      certificateNumber: '',
      plateNumberData: '',
      plateNumber: '',
      plateSelect: '02',
      getCensusRegisterData: [
        {name: '深户', value: '1'},
        {name: '非深户', value: '0'},
        {name: '外籍', value: '0'}
      ],
      getCensusRegister: '1',
      recipientName: '',
      recipientPhone: '',
      recipientAddressRegion: '福田区',
      recipientAddressDetail: '',
      IDCardFront: '',
      IDCardBack: '',
      registerCredential: '',
      residencePermitF: '',
      residencePermitB: '',
      board: '',
      censusIndex: 0
    }
  },
  components: {
    GInput,
    GSelect,
    GSelectOne,
    GButton,
    GRadio,
    Group,
    GUpload
  },
  computed: {
    plateSelectData () {
      return this.$store.state.plateType
    },
    areaSelectData () {
      return this.$store.state.cityAreaS
    },
    queryURL () {
      return this.$store.getters.queryURL
    }
  },
  mixins: [beforeSubmit],
  methods: {
    getIndex: function (index) {
      this.censusIndex = index
    },
    confirmInfo () {
      let obj = {
        recipientName: '请输入收件人名字',
        recipientPhone: '请输入收件人手机号码',
        recipientAddressDetail: '请输入详细地址',
        IDCardFront: '请上传身份证（正面）',
        IDCardBack: '请上传身份证（反面）',
        registerCredential: '请上传机动车登记证书'
      }
      if (this.$_myMinxin_beforeSubmit(obj)) return
      if (this.$verification.isPhone(this.recipientPhone)) return
      if (this.censusIndex === 2 && !this.board) {
        this.$toast({message: '请上传境外人员临住表', position: 'middle', duration: 3000})
      } else if (this.censusIndex === 1 && !this.residencePermitF) {
        this.$toast({message: '请上传居住证正面', position: 'middle', duration: 3000})
      } else if (this.censusIndex === 1 && !this.residencePermitB) {
        this.$toast({message: '请上传居住证反面', position: 'middle', duration: 3000})
      } else {
        this.subFn()
      }
    },
    subFn () {
      let plateSelectName = this.$refs.plateSelectName.currentName // 获取 name 值
      let plateNumberName = this.$refs.plateNumberName.currentName // 获取 name 值
      let dataList = {
        type: '补领行驶证',
        url: iocomotiveCarReplace,
        title: 'iocomotiveCarReplace',
        textObj: {
          'name': this.name,                            // 车主姓名
          'identificationNum': this.certificateNumber,  // 身份证号码
          'numberPlate': plateNumberName,               // 车牌号码
          'plateType': this.plateSelect,                // 车牌类型id
          'plateTypeStr': plateSelectName,              // 车牌类型name
          'placeOfDomicile': this.getCensusRegister,    // 户籍所在地
          'showIndex': this.censusIndex,
          'receiverName': this.recipientName,  // 收件人姓名
          'receiverNumber': this.recipientPhone,  // 收件人手机
          'receiverAddress': `深圳市${this.recipientAddressRegion}${this.recipientAddressDetail}`  // 收件人地址
        },
        imgObj: {
          'PHOTO9': this.IDCardFront || '',
          'PHOTO10': this.IDCardBack || '',
          'DJZSFYJ': this.registerCredential || '',
          'PHOTO31': this.censusIndex === 2 ? this.board : '',
          'JZZA': this.censusIndex === 1 ? this.residencePermitF : '',
          'JZZB': this.censusIndex === 1 ? this.residencePermitB : ''
        }
      }
      console.log(dataList)
      this.$store.commit('savePassByValue', dataList)
      this.$router.push({path: '/affirmInfo', query: this.queryURL})
    }
  },
  created () {
    let val = this.$store.state.user
    this.cars = val.cars
    if (this.cars.length) {
      let PlateData = []
      this.cars.map(item => {
        if (+item.isMySelf === 0) {
          PlateData.push({name: item.myNumberPlate, value: item.plateType})
        }
      })
      this.plateNumberData = PlateData
      this.plateNumber = this.plateNumberData[0].value
    } else {
      this.$MessageBox('温馨提示', '暂无车辆，您的车辆未绑定或者审核中')
    }
    this.name = val.userName
    this.certificateNumber = val.identityCard
  }
}
</script>

<style lang="less" scoped>
  .exchangeDrivingLicense{
    padding-bottom: 40px;
    .upload-group{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
  }
</style>
